/**
 * Project registry — drives both the home Project Card grid and the
 * dynamic /[category]/[project] detail pages.
 *
 * To add a new project:
 *   1. Drop a JSON file in web-data/pages/projects/<slug>.json
 *      following the shape of industrial-kitchen-pakistan.json (or similar).
 *   2. Add any new media keys to web-data/media/media.json.
 *   3. Import + register here.
 *   Optional: set `blobAssetPrefix` (e.g. images/projects/.../Project-1) so
 *   the app lists Vercel Blob images at build/ISR time for hero, cards, and
 *   simple-layout galleries (see lib/projectBlobAssets.js).
 *
 * Both the dynamic route's generateStaticParams and the home page's
 * card grid read from PROJECTS, so a single registry edit propagates
 * to every surface.
 */
import industrialKitchenPakistan from "@/web-data/pages/projects/industrial-kitchen-pakistan.json";
import schoolKitchenUnitedKingdom from "@/web-data/pages/projects/school-kitchen-united-kingdom.json";
import premiumResidentialKitchenUae from "@/web-data/pages/projects/premium-residential-kitchen-uae.json";
import internationalKitchenHospitalityAustraliaQatar from "@/web-data/pages/projects/international-kitchen-hospitality-australia-qatar.json";

export const PROJECTS = {
  "industrial-kitchen-pakistan": industrialKitchenPakistan,
  "school-kitchen-united-kingdom": schoolKitchenUnitedKingdom,
  "premium-residential-kitchen-uae": premiumResidentialKitchenUae,
  "international-kitchen-hospitality-australia-qatar": internationalKitchenHospitalityAustraliaQatar,
};

export const PROJECT_SLUGS = Object.keys(PROJECTS);

export function getProjectBySlug(slug) {
  return PROJECTS[slug] ?? null;
}

/**
 * Returns [{ category, project }, ...] tuples for the dynamic route's
 * generateStaticParams. We intentionally match the route's two-segment
 * shape: /[category]/[project].
 */
export function getProjectStaticParams() {
  return Object.values(PROJECTS).map((p) => ({
    category: p.categorySlug,
    project: p.slug,
  }));
}

/**
 * Lookup by (category, project) for the dynamic route — the project's
 * registered categorySlug must match the URL's category segment, or
 * the route 404s.
 */
export function getProjectByRoute({ category, project }) {
  const found = PROJECTS[project];
  if (!found) return null;
  if (found.categorySlug !== category) return null;
  return found;
}
