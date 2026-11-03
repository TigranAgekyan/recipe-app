import instagramIcon from "../assets/platforms/instagram.svg";
import pinterestIcon from "../assets/platforms/pinterest.svg";
import tiktokIcon from "../assets/platforms/tiktok.svg";
import youtubeIcon from "../assets/platforms/youtube.svg";
import { isShorts } from "./youtube";

// Keep in sync with VIDEO_HOSTS in backend/app/article.py
const PLATFORMS = [
  { pattern: /(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be)$/, name: "YouTube", icon: youtubeIcon },
  { pattern: /(^|\.)tiktok\.com$/, name: "TikTok", icon: tiktokIcon },
  { pattern: /(^|\.)(instagram\.com|instagr\.am)$/, name: "Instagram", icon: instagramIcon },
  { pattern: /(^|\.)(pinterest\.(com?\.)?[a-z]{2,3}|pin\.it)$/, name: "Pinterest", icon: pinterestIcon },
];

function hostname(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function findPlatform(host: string) {
  return PLATFORMS.find(({ pattern }) => pattern.test(host));
}

/** Where a recipe was imported from: a platform name, or the bare hostname for other sites. */
export function sourceName(url: string | null): string | null {
  const host = hostname(url);
  if (!host) return null;
  if (isShorts(url)) return "Shorts";
  return findPlatform(host)?.name ?? host.replace(/^www\./, "");
}

/** Known platforms are imported as videos; every other site is read as an article. */
export function isVideoSource(url: string | null): boolean {
  const host = hostname(url);
  return !!host && !!findPlatform(host);
}

/** Logo for a known platform, or null for other sites. */
export function sourceIcon(url: string | null): string | null {
  const host = hostname(url);
  return (host && findPlatform(host)?.icon) || null;
}
