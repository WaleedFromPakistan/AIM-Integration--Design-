import { getProjectByRoute } from "@/lib/projects";
import { listProjectBlobAssetsForApi } from "@/lib/projectBlobAssets";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/projects/<category>/<project>/media
 * Lists image blobs under the project's `blobAssetPrefix` (same-origin proxy URLs only).
 */
export async function GET(_request, { params }) {
  const { category, project } = await params;
  const found = getProjectByRoute({ category, project });
  if (!found?.blobAssetPrefix) {
    return Response.json(
      {
        ok: false,
        message: "Unknown project or blobAssetPrefix is not set on this project.",
      },
      { status: 404 },
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { ok: false, message: "BLOB_READ_WRITE_TOKEN is not configured." },
      { status: 500 },
    );
  }

  const pack = await listProjectBlobAssetsForApi(found.blobAssetPrefix);
  if (!pack) {
    return Response.json(
      { ok: false, message: "Could not list assets from blob storage." },
      { status: 502 },
    );
  }

  const strip = (g) => ({
    pathname: g.pathname,
    proxyUrl: g.proxyUrl,
    alt: g.alt,
    filename: g.filename,
  });

  return Response.json({
    ok: true,
    slug: found.slug,
    prefix: found.blobAssetPrefix,
    main: pack.main ? strip(pack.main) : null,
    gallery: (pack.gallery ?? []).map(strip),
  });
}
