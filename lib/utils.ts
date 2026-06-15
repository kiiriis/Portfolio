import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "Jan 2025 — Present" style label from two free-form date strings. */
export function dateRange(start?: string | null, end?: string | null): string {
  const s = (start ?? "").trim();
  const e = (end ?? "").trim();
  if (s && e) return `${s} — ${e}`;
  if (s) return `${s} — Present`;
  return e || "";
}

/** Turn a title into a url-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Extract a YouTube video id from common URL shapes. Returns null if not YouTube. */
export function youTubeId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

/**
 * Make an image URL safe to use in <img src>. Google Drive *share* links
 * (drive.google.com/file/d/<id>/view, open?id=<id>, uc?id=<id>) point at an
 * HTML page, not the image bytes, so they can't be hotlinked. Rewrite them to
 * the thumbnail endpoint, which serves the actual image. Other URLs pass through.
 */
export function normalizeImageUrl(url?: string | null): string {
  const u = (url ?? "").trim();
  if (!u) return "";
  const m = u.match(
    /drive\.google\.com\/(?:file\/d\/|(?:uc|open)\?(?:[^&]*&)*id=)([A-Za-z0-9_-]+)/
  );
  return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1200` : u;
}
