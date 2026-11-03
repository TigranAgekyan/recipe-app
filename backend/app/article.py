import ipaddress
import re
import socket
import sys
import time

import httpx
import trafilatura
from recipe_scrapers import scrape_html

# Keep in sync with PLATFORMS in frontend/src/lib/source.ts
VIDEO_HOSTS = re.compile(
    r"(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be|tiktok\.com|"
    r"instagram\.com|instagr\.am|pinterest\.(com?\.)?[a-z]{2,3}|pin\.it)$"
)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; SimmerRecipeImporter/1.0)",
    "Accept": "text/html,application/xhtml+xml",
}
HTML_TYPES = ("text/html", "application/xhtml+xml")
MAX_REDIRECTS = 5
MAX_BYTES = 5_000_000
MAX_SECONDS = 30
MAX_TEXT_CHARS = 30_000
MIN_TEXT_CHARS = 200


def is_video_url(url):
    return bool(VIDEO_HOSTS.search(httpx.URL(url).host.lower()))


def _public_ip(url):
    """Resolves the host, refusing anything that isn't on the public internet."""
    if url.scheme not in ("http", "https") or url.port not in (None, 80, 443) or url.userinfo:
        raise ValueError("This link can't be imported")
    try:
        infos = socket.getaddrinfo(url.host, url.port or 443, type=socket.SOCK_STREAM)
    except socket.gaierror:
        raise ValueError("Couldn't find that website") from None
    ips = []
    for info in infos:
        ip = ipaddress.ip_address(info[4][0])
        ip = getattr(ip, "ipv4_mapped", None) or ip
        if not ip.is_global or ip.is_multicast:
            raise ValueError("This link can't be imported")
        ips.append(ip)
    # Containers often have no IPv6 route
    return str(min(ips, key=lambda ip: ip.version))


def _read_html(response, deadline):
    content_type = response.headers.get("content-type", "").split(";")[0].strip().lower()
    if content_type not in HTML_TYPES:
        raise ValueError("This link isn't a web page")
    body = bytearray()
    for chunk in response.iter_bytes():
        body += chunk
        if len(body) > MAX_BYTES:
            raise ValueError("This page is too large to import")
        if time.monotonic() > deadline:
            raise ValueError("This website took too long to respond")
    try:
        return body.decode(response.charset_encoding or "utf-8", errors="replace")
    except LookupError:
        return body.decode("utf-8", errors="replace")


def _fetch(url):
    """Returns (final_url, html), checking every redirect hop before connecting to it."""
    deadline = time.monotonic() + MAX_SECONDS
    # trust_env=False so a configured proxy can't bypass the address check
    with httpx.Client(timeout=10, trust_env=False) as client:
        target = httpx.URL(url)
        for _ in range(MAX_REDIRECTS + 1):
            # Connect to the address we checked, so DNS can't change between check and request
            pinned = target.copy_with(host=_public_ip(target))
            try:
                with client.stream(
                    "GET",
                    pinned,
                    headers={**HEADERS, "Host": target.netloc.decode("ascii")},
                    extensions={"sni_hostname": target.host},
                ) as response:
                    if response.is_redirect and "location" in response.headers:
                        target = target.join(response.headers["location"])
                        continue
                    if response.status_code in (401, 403, 429, 503):
                        raise ValueError("This website blocks automatic imports")
                    if response.status_code != 200:
                        raise ValueError(f"This page couldn't be loaded (HTTP {response.status_code})")
                    return str(target), _read_html(response, deadline)
            except httpx.TimeoutException:
                raise ValueError("This website took too long to respond") from None
            except httpx.HTTPError:
                raise ValueError("Couldn't connect to this website") from None
    raise ValueError("This link redirects too many times")


def _field(getter):
    # recipe-scrapers raises when a site doesn't provide a field
    try:
        return getter()
    except Exception:
        return None


def _structured(html, url):
    """Reads schema.org recipe data. Returns None if the page has no complete recipe."""
    try:
        scraper = scrape_html(html, url, supported_only=False)
    except Exception:
        return None
    ingredients = _field(scraper.ingredients)
    steps = _field(scraper.instructions_list)
    if not ingredients or not steps:
        return None

    details = [
        f"Servings: {_field(scraper.yields) or 'not stated'}",
        f"Total time in minutes: {_field(scraper.total_time) or 'not stated'}",
        "Ingredients:",
        *(f"- {i}" for i in ingredients),
    ]
    return {
        "title": _field(scraper.title),
        "description": "\n".join(details),
        "transcript": "\n".join(steps),
        "source": "structured data",
    }


def _page_text(html):
    text = trafilatura.extract(html, include_comments=False, include_tables=True)
    if not text or len(text) < MIN_TEXT_CHARS:
        raise ValueError("Couldn't read a recipe from this page")
    metadata = trafilatura.extract_metadata(html)
    return {
        "title": metadata.title if metadata else None,
        "description": "",
        "transcript": text[:MAX_TEXT_CHARS],
        "source": "page text",
    }


def get_article(url):
    final_url, html = _fetch(url)
    return _structured(html, final_url) or _page_text(html)


if __name__ == "__main__":
    result = get_article(sys.argv[1])
    print(f"Title:   {result['title']}")
    print(f"Source:  {result['source']}")
    print(f"\n{result['description']}\n\n{result['transcript'][:800]}")
