/**
 * Resolves a project page (web-data/pages/projects/<slug>.json) into a
 * fully-rendered viewModel. Mirrors buildHomeViewModel / buildServicePageViewModel:
 * all imageMediaKey references are looked up in the central media registry
 * and replaced with { url, alt }.
 */
import { resolveMediaUrl } from "./mediaBlob";

export function buildProjectPageViewModel({ page, media, site }) {
  const assets = media.assets;

  const pick = (key) => {
    const a = assets[key];
    if (!a) return { url: "", alt: "" };
    return { url: resolveMediaUrl(a.url), alt: a.alt ?? "" };
  };

  const cardImage = page.card?.imageMediaKey
    ? pick(page.card.imageMediaKey)
    : { url: "", alt: "" };

  const heroKey =
    page.hero?.imageMediaKey || page.card?.imageMediaKey || null;
  let heroImage = heroKey ? pick(heroKey) : { url: "", alt: "" };
  if (!heroImage.url && page.card?.imageMediaKey) {
    heroImage = pick(page.card.imageMediaKey);
  }

  const floorPlanImg = page.bento?.floorPlan?.imageMediaKey
    ? pick(page.bento.floorPlan.imageMediaKey)
    : { url: "", alt: "" };

  const sectionImg = page.bento?.section?.imageMediaKey
    ? pick(page.bento.section.imageMediaKey)
    : { url: "", alt: "" };

  const equipmentImg = page.equipment?.imageMediaKey
    ? pick(page.equipment.imageMediaKey)
    : { url: "", alt: "" };

  const hotlineImg = page.hotline?.imageMediaKey
    ? pick(page.hotline.imageMediaKey)
    : { url: "", alt: "" };

  const ogFromKey =
    page.seo?.openGraph?.imageMediaKey != null
      ? pick(page.seo.openGraph.imageMediaKey).url
      : "";
  const ogImage = ogFromKey || heroImage.url || cardImage.url;

  const mainFallback =
    cardImage.url || heroImage.url
      ? { url: cardImage.url || heroImage.url, alt: cardImage.alt || heroImage.alt }
      : { url: "", alt: "" };

  const galleryVm =
    page.gallery?.items?.length > 0
      ? {
          ...page.gallery,
          items: page.gallery.items
            .map((item) => {
              const resolved = item.imageMediaKey
                ? pick(item.imageMediaKey)
                : { url: "", alt: "" };
              const url = resolved.url || mainFallback.url;
              const alt =
                item.imageAlt || resolved.alt || mainFallback.alt || item.caption || "";
              return { ...item, imageUrl: url, imageAlt: alt };
            })
            .filter((item) => item.imageUrl),
        }
      : null;

  return {
    site,
    slug: page.slug,
    categorySlug: page.categorySlug,
    category: page.category,
    route: page.route,
    layout: page.layout ?? "full",
    seo: {
      ...page.seo,
      openGraphImage: ogImage,
    },
    card: page.card
      ? {
          ...page.card,
          imageUrl: cardImage.url,
          imageAlt: page.card.imageAlt || cardImage.alt,
          href: page.route,
        }
      : null,
    hero: page.hero
      ? {
          ...page.hero,
          imageUrl: heroImage.url,
          imageAlt: page.hero.imageAlt || heroImage.alt,
        }
      : null,
    about: page.about ?? null,
    bento: page.bento
      ? {
          ...page.bento,
          floorPlan: page.bento.floorPlan
            ? {
                ...page.bento.floorPlan,
                imageUrl: floorPlanImg.url,
                imageAlt: page.bento.floorPlan.imageAlt || floorPlanImg.alt,
              }
            : null,
          section: page.bento.section
            ? {
                ...page.bento.section,
                imageUrl: sectionImg.url,
                imageAlt: page.bento.section.imageAlt || sectionImg.alt,
              }
            : null,
        }
      : null,
    equipment: page.equipment
      ? {
          ...page.equipment,
          imageUrl: equipmentImg.url,
          imageAlt: page.equipment.imageAlt || equipmentImg.alt,
        }
      : null,
    hotline: page.hotline
      ? {
          ...page.hotline,
          imageUrl: hotlineImg.url,
          imageAlt: page.hotline.imageAlt || hotlineImg.alt,
        }
      : null,
    callout: page.callout ?? null,
    gallery: galleryVm?.items?.length ? galleryVm : null,
  };
}

/**
 * When {@link fetchProjectBlobAssets} returns data, overlay hero/card/OG
 * and (for layout "simple") replace the gallery with live Blob listings.
 */
export function mergeProjectBlobAssets(vm, blobPack, page) {
  if (!blobPack) return vm;
  const hasMain = Boolean(blobPack.main?.proxyUrl);
  const hasGallery = blobPack.gallery?.length > 0;
  if (!hasMain && !hasGallery) return vm;

  const mainUrl = blobPack.main?.proxyUrl ?? "";
  const mainAlt =
    blobPack.main?.alt ||
    page.hero?.imageAlt ||
    page.card?.title ||
    vm.hero?.imageAlt ||
    "";

  let next = { ...vm };

  if (mainUrl) {
    next.seo = { ...next.seo, openGraphImage: mainUrl };
    next.card = next.card
      ? {
          ...next.card,
          imageUrl: mainUrl,
          imageAlt: next.card.imageAlt || mainAlt,
        }
      : next.card;
    next.hero = next.hero
      ? {
          ...next.hero,
          imageUrl: mainUrl,
          imageAlt: next.hero.imageAlt || mainAlt,
        }
      : next.hero;
  }

  const useBlobGallery =
    (page.layout ?? "full") === "simple" &&
    Array.isArray(blobPack.gallery) &&
    blobPack.gallery.length > 0;

  if (useBlobGallery) {
    next.gallery = {
      title: page.gallery?.title ?? "Project imagery",
      subtitle: page.gallery?.subtitle ?? "",
      items: blobPack.gallery.map((g) => ({
        id: g.pathname,
        imageUrl: g.proxyUrl,
        imageAlt: g.alt,
        caption: g.filename,
      })),
    };
  }

  return next;
}

/**
 * Resolves all registered projects to the lightweight `card` shape used
 * by the home-page Project Card grid. Returns an array of:
 *   { slug, categorySlug, href, title, category, location, year, description, imageUrl, imageAlt, ctaLabel }
 */
export function buildProjectCards({ projects, media, projectCardOverrides }) {
  const assets = media.assets;
  const pick = (key) => {
    const a = assets[key];
    if (!a) return { url: "", alt: "" };
    return { url: resolveMediaUrl(a.url), alt: a.alt ?? "" };
  };

  const overrides = projectCardOverrides && typeof projectCardOverrides === "object"
    ? projectCardOverrides
    : {};

  return Object.values(projects).map((p) => {
    const o = overrides[p.slug];
    const img =
      o?.imageUrl
        ? { url: o.imageUrl, alt: o.imageAlt ?? "" }
        : p.card?.imageMediaKey
          ? pick(p.card.imageMediaKey)
          : { url: "", alt: "" };
    return {
      slug: p.slug,
      categorySlug: p.categorySlug,
      href: p.route,
      title: p.card?.title ?? "",
      category: p.card?.category ?? p.category ?? "",
      location: p.card?.location ?? "",
      year: p.card?.year ?? "",
      description: p.card?.description ?? "",
      imageUrl: img.url,
      imageAlt: p.card?.imageAlt || img.alt,
      ctaLabel: p.card?.ctaLabel ?? "Learn More",
    };
  });
}
