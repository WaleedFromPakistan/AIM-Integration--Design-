/**
 * Service slug -> page data registry.
 *
 * Adding a new service: drop a JSON file in web-data/pages/services/,
 * import it here, and add an entry to SERVICES.
 *
 * Each entry is consumed by:
 *   - app/services/[slug]/page.js   (rendering + metadata)
 *   - generateStaticParams           (SSG of all known slugs at build time)
 */
import commercialKitchen from "@/web-data/pages/services/commercial-kitchen.json";
import floorPlanning from "@/web-data/pages/services/floor-planning.json";
import bimModeling from "@/web-data/pages/services/bim-modeling.json";
import architectureInterior from "@/web-data/pages/services/architecture-interior.json";

export const SERVICES = {
  "commercial-kitchen": commercialKitchen,
  "floor-planning": floorPlanning,
  "bim-modeling": bimModeling,
  "architecture-interior": architectureInterior,
};

export const SERVICE_SLUGS = Object.keys(SERVICES);

export function getServiceBySlug(slug) {
  return SERVICES[slug] ?? null;
}
