/**
 * Resolves a service page (web-data/pages/services/<slug>.json) into a
 * fully-resolved viewModel — same pattern as buildHomeViewModel.
 *
 * Every imageMediaKey is replaced with { url, alt } pulled from the
 * central media registry, and `blob:` URLs are routed through the
 * /api/media proxy via lib/mediaBlob.resolveMediaUrl.
 */
import { resolveMediaUrl } from "./mediaBlob";

export function buildServicePageViewModel({ page, media, site }) {
  const assets = media.assets;

  const pick = (key) => {
    const a = assets[key];
    if (!a) return { url: "", alt: "" };
    return { url: resolveMediaUrl(a.url), alt: a.alt ?? "" };
  };

  // === Hero (single image) ===
  const heroImage = page.hero?.imageMediaKey
    ? pick(page.hero.imageMediaKey)
    : { url: "", alt: "" };
  const hero = page.hero
    ? {
        ...page.hero,
        imageUrl: heroImage.url,
        imageAlt: page.hero.imageAlt || heroImage.alt,
      }
    : null;

  // === About ===
  const aboutImage = page.about?.imageMediaKey
    ? pick(page.about.imageMediaKey)
    : { url: "", alt: "" };
  const about = page.about
    ? {
        ...page.about,
        imageUrl: aboutImage.url,
        imageAlt: aboutImage.alt,
      }
    : null;

  // === Gallery ===
  const gallery = page.gallery
    ? {
        ...page.gallery,
        items:
          page.gallery.items?.map((item) => {
            const img = item.imageMediaKey ? pick(item.imageMediaKey) : null;
            return {
              ...item,
              image: img?.url || "",
              alt: item.alt || img?.alt || "",
            };
          }) ?? [],
      }
    : null;

  // === Tools (no media) ===
  const tools = page.tools ?? null;

  // === SEO openGraph image ===
  const ogImage =
    page.seo?.openGraph?.imageMediaKey != null
      ? pick(page.seo.openGraph.imageMediaKey).url
      : heroImage?.url || "";

  return {
    site,
    slug: page.slug,
    category: page.category,
    catalogueFolder: page.catalogueFolder ?? null,
    seo: {
      ...page.seo,
      openGraphImage: ogImage,
    },
    hero,
    about,
    gallery,
    tools,
    recentProjects: page.recentProjects ?? null,
  };
}
