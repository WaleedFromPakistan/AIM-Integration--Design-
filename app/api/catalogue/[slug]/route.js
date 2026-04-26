/**
 * Catalogue lookup — returns the first downloadable asset in a service's
 * blob catalogue folder (or 404 if the folder is empty / missing).
 *
 *   GET /api/catalogue/<slug>
 *     200  { available: true, url: "/api/media/cataloge/...", filename: "x.pdf" }
 *     404  { available: false, message: "Catalogue not available yet." }
 *
 * The client (catalogue button in ServiceAbout) calls this on click.
 *
 * Why we list the folder instead of hard-coding a filename:
 *   The user uploads catalogues later, possibly with arbitrary filenames
 *   (e.g. CK-Catalogue-2026.pdf). Listing the prefix lets us pick up
 *   whatever they put there without code changes.
 *
 * Caching: we DON'T statically cache this — clients might upload a new
 * catalogue and expect the next click to find it. Vercel's blob list call
 * is fast and cheap, so we accept the per-call overhead.
 */
import { list } from "@vercel/blob";
import { getServiceBySlug } from "@/lib/services";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_EXT = new Set([".pdf", ".png", ".jpg", ".jpeg", ".webp"]);

function safeProxyPath(pathname) {
  // Encode each segment so spaces/unicode survive
  return pathname
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

export async function GET(_request, { params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return Response.json(
      { available: false, message: "Unknown service." },
      { status: 404 },
    );
  }

  const folder = service.catalogueFolder;
  if (!folder) {
    return Response.json(
      { available: false, message: "Catalogue not available yet." },
      { status: 404 },
    );
  }

  // Make sure prefix ends with a slash so we list folder contents only.
  const prefix = folder.endsWith("/") ? folder : `${folder}/`;

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return Response.json(
      { available: false, message: "Blob storage not configured." },
      { status: 500 },
    );
  }

  let files;
  try {
    const res = await list({ prefix, token });
    files = res.blobs ?? [];
  } catch {
    return Response.json(
      { available: false, message: "Could not check catalogue right now." },
      { status: 502 },
    );
  }

  // Filter out folder placeholders and unsupported file types
  const downloadable = files.filter((b) => {
    if (!b.pathname || b.pathname.endsWith("/")) return false;
    const ext = b.pathname.slice(b.pathname.lastIndexOf(".")).toLowerCase();
    return ALLOWED_EXT.has(ext);
  });

  if (downloadable.length === 0) {
    return Response.json(
      { available: false, message: "Catalogue not available yet." },
      { status: 404 },
    );
  }

  // Prefer PDFs if present; otherwise return the first item.
  const pdf = downloadable.find((b) => b.pathname.toLowerCase().endsWith(".pdf"));
  const chosen = pdf ?? downloadable[0];
  const filename = chosen.pathname.slice(chosen.pathname.lastIndexOf("/") + 1);

  // Route the file through our /api/media proxy so the blob hostname
  // never reaches the client.
  const proxyUrl = `/api/media/${safeProxyPath(chosen.pathname)}`;

  return Response.json({
    available: true,
    url: proxyUrl,
    filename,
  });
}
