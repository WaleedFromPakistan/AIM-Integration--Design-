/**
 * Lists image assets for a project folder in Vercel Blob (via @vercel/blob list).
 * Paths are exposed only as same-origin /api/media/... proxy URLs.
 *
 * Requires BLOB_READ_WRITE_TOKEN (server-only). When missing or on failure,
 * callers should fall back to media.json keys.
 */
import { cache } from "react";
import { list } from "@vercel/blob";
import { PROJECTS } from "@/lib/projects";

const IMAGE_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".avif",
  ".svg",
]);

export function safeProxyPath(pathname) {
  return pathname
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

function extOf(pathname) {
  const i = pathname.lastIndexOf(".");
  return i < 0 ? "" : pathname.slice(i).toLowerCase();
}

function isImagePathname(pathname) {
  if (!pathname || pathname.endsWith("/")) return false;
  return IMAGE_EXT.has(extOf(pathname));
}

/** Matches .../main/main.<ext> (folder "main", file "main"). */
export function isMainImagePath(pathname) {
  const p = pathname.replace(/\\/g, "/");
  return /\/main\/main\.(webp|jpe?g|png|gif|avif|svg)(\?.*)?$/i.test(p);
}

function filenameFromPath(pathname) {
  const i = pathname.lastIndexOf("/");
  return i < 0 ? pathname : pathname.slice(i + 1);
}

function humanAltFromFilename(filename) {
  const base = filename.replace(/\.[^.]+$/i, "").replace(/[-_]+/g, " ");
  if (!base) return filename;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

async function listAllBlobs(prefix, token) {
  const normalized = prefix.endsWith("/") ? prefix : `${prefix}/`;
  const out = [];
  let cursor;
  for (;;) {
    const res = await list({ prefix: normalized, token, cursor });
    out.push(...(res.blobs ?? []));
    if (!res.hasMore) break;
    cursor = res.cursor;
    if (!cursor) break;
  }
  return out;
}

/**
 * @param {string} prefix Blob pathname prefix, e.g. "images/projects/Commercial-Kitchen/Project-1"
 * @returns {Promise<{ main: object | null, gallery: object[] } | null>}
 *   main/gallery entries: { pathname, proxyUrl, filename, alt }
 */
export async function listProjectBlobAssetsForApi(prefix) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token || typeof prefix !== "string" || !prefix.trim()) {
    return null;
  }

  const trimmed = prefix.trim().replace(/^\/+/, "");

  try {
    const blobs = await listAllBlobs(trimmed, token);
    const images = blobs
      .filter((b) => b.pathname && isImagePathname(b.pathname))
      .map((b) => {
        const pathname = b.pathname;
        const filename = filenameFromPath(pathname);
        return {
          pathname,
          proxyUrl: `/api/media/${safeProxyPath(pathname)}`,
          filename,
          alt: humanAltFromFilename(filename),
        };
      })
      .sort((a, b) => a.pathname.localeCompare(b.pathname, "en"));

    if (images.length === 0) {
      return { main: null, gallery: [] };
    }

    const main =
      images.find((img) => isMainImagePath(img.pathname)) ?? images[0];
    const gallery = images.filter((img) => img.pathname !== main.pathname);

    return { main, gallery };
  } catch (err) {
    console.error(
      "[fetchProjectBlobAssets]",
      trimmed,
      err?.message || err,
    );
    return null;
  }
}

/** Dedupe list() within a single RSC request (e.g. generateMetadata + page). */
export const getCachedProjectBlobAssets = cache(listProjectBlobAssetsForApi);

export async function fetchProjectBlobAssets(prefix) {
  return getCachedProjectBlobAssets(prefix);
}

/**
 * For the home project grid: main image per project when `blobAssetPrefix` is set.
 * @returns {Promise<Record<string, { imageUrl: string, imageAlt: string }>>}
 */
async function fetchProjectCardBlobOverrides(projects) {
  const rows = await Promise.all(
    Object.values(projects).map(async (p) => {
      if (!p.blobAssetPrefix) return null;
      const pack = await getCachedProjectBlobAssets(p.blobAssetPrefix);
      const url = pack?.main?.proxyUrl;
      if (!url) return null;
      return [
        p.slug,
        {
          imageUrl: url,
          imageAlt: pack.main.alt || p.card?.title || "",
        },
      ];
    }),
  );
  /** @type {Record<string, { imageUrl: string, imageAlt: string }>} */
  const out = {};
  for (const row of rows) {
    if (row) out[row[0]] = row[1];
  }
  return out;
}

/** One Blob list round-trip per home request (metadata + page share this). */
export const getCachedProjectCardBlobOverrides = cache(async () =>
  fetchProjectCardBlobOverrides(PROJECTS),
);
