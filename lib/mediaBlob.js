/**
 * Resolve short blob paths (e.g. "blob:logo/logo.webp") to same-origin
 * proxy URLs served by the route handler at app/api/media/[...path]/route.js.
 *
 * Why a proxy instead of the raw blob URL?
 *   - Keeps the Vercel Blob hostname private (client never sees it).
 *   - Stays same-origin, so next/image needs no remotePatterns entry.
 *   - Lets us swap storage providers later without touching component code.
 *
 * Usage in media.json:
 *   { "logo-primary": { "type": "image", "url": "blob:logo/logo.webp", "alt": "…" } }
 *
 * Any URL that doesn't start with "blob:" is returned untouched — so local
 * `/images/...` paths and external (Unsplash/Mixkit) URLs keep working.
 */

const BLOB_PREFIX = "blob:";
const PROXY_ROUTE = "/api/media";

export function resolveMediaUrl(url) {
  if (!url || typeof url !== "string") return url || "";
  if (!url.startsWith(BLOB_PREFIX)) return url;

  // "blob:logo/logo.webp" -> "logo/logo.webp"
  const pathname = url.slice(BLOB_PREFIX.length).replace(/^\/+/, "");
  if (!pathname) return "";

  // Encode each segment so spaces and unicode are safe in the URL.
  const safe = pathname
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");

  return `${PROXY_ROUTE}/${safe}`;
}
