/**
 * Media proxy — streams files from Vercel Blob through our own domain.
 *
 * Any URL of shape /api/media/<path/to/file.ext> is proxied to
 *   `${BLOB_BASE_URL}/<path/to/file.ext>`
 *
 * Benefits:
 *   - Blob store hostname is never exposed to the client.
 *   - Same-origin — plays nicely with next/image optimizer (no remotePatterns).
 *   - We can swap storage providers later without touching component code.
 *   - Long-lived cache headers let Vercel's edge CDN absorb the hits.
 *
 * Required env (server-only, NOT NEXT_PUBLIC_):
 *   BLOB_BASE_URL=https://xxxxxxxxxxxx.public.blob.vercel-storage.com
 */

const BLOB_BASE_URL = process.env.BLOB_BASE_URL;

export async function GET(_request, { params }) {
  if (!BLOB_BASE_URL) {
    return new Response(
      "Media proxy is not configured. Set BLOB_BASE_URL in .env.local.",
      { status: 500 },
    );
  }

  const { path } = await params;
  if (!Array.isArray(path) || path.length === 0) {
    return new Response("Missing media path", { status: 400 });
  }

  // Re-encode each path segment so spaces / unicode survive the hop.
  const encoded = path.map((seg) => encodeURIComponent(seg)).join("/");
  const target = `${BLOB_BASE_URL.replace(/\/+$/, "")}/${encoded}`;

  let upstream;
  try {
    upstream = await fetch(target, {
      // Let Next cache the upstream fetch at the edge (blobs are immutable).
      cache: "force-cache",
    });
  } catch {
    return new Response("Upstream fetch failed", { status: 502 });
  }

  if (!upstream.ok) {
    return new Response("Not found", { status: upstream.status });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("content-length", contentLength);
  // Blob URLs are stable per uploaded file — cache aggressively.
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(upstream.body, { status: 200, headers });
}
