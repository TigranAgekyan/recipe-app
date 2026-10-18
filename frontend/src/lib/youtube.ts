const ID_PATTERN = /^[\w-]{11}$/;

/** Extracts the video ID from watch, youtu.be, shorts, embed and live URLs. */
export function youtubeId(url: string | null): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^(www|m|music)\./, "");
  let id: string | null = null;
  if (host === "youtu.be") {
    id = parsed.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (parsed.pathname === "/watch") {
      id = parsed.searchParams.get("v");
    } else {
      id = parsed.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/]+)/)?.[1] ?? null;
    }
  }
  return id && ID_PATTERN.test(id) ? id : null;
}

export function isShorts(url: string | null): boolean {
  return !!url && /youtube\.com\/shorts\//.test(url);
}

export function thumbnailUrl(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/** "https://www.youtube.com/watch?v=abc" -> "youtube.com/watch?v=abc" */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
