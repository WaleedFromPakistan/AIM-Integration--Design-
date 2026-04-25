import { resolveMediaUrl } from "./mediaBlob";

/**
 * Resolves mediaKey references from page JSON using the central media registry.
 * Keeps components free of registry shape — page passes fully resolved props.
 *
 * Supports three URL shapes in media.json:
 *   - "blob:path/to/file.png"                    → expanded to NEXT_PUBLIC_BLOB_BASE_URL/path/to/file.png
 *   - "/images/carosel-images/image-1.png"       → served from /public (unchanged)
 *   - "https://images.unsplash.com/…"            → external URL (unchanged)
 */
export function buildHomeViewModel({ page, media, site }) {
  const assets = media.assets;

  const pick = (key) => {
    const a = assets[key];
    if (!a) return { url: "", alt: "" };
    return { url: resolveMediaUrl(a.url), alt: a.alt ?? "", type: a.type };
  };

  const logo = pick(page.navbar.logoMediaKey);
  const heroVideo = pick(page.hero.videoMediaKey);
  const heroPoster = pick(page.hero.posterMediaKey);
  const aboutImage = pick(page.about.imageMediaKey);

  const services = page.services.items.map((item) => ({
    ...item,
    image: pick(item.imageMediaKey).url,
    imageAlt: pick(item.imageMediaKey).alt,
  }));

  const projects = page.projects.items.map((item) => ({
    ...item,
    image: pick(item.imageMediaKey).url,
    imageAlt: pick(item.imageMediaKey).alt,
  }));

  const ogImage =
    page.seo.openGraph?.imageMediaKey != null
      ? pick(page.seo.openGraph.imageMediaKey).url
      : heroPoster.url;

  const heroCarousel = page.hero?.heroCarousel;

  const normalizePublicSrc = (src) => {
    if (!src || typeof src !== "string") return "";
    const t = src.trim();
    if (!t) return "";
    // Let blob: prefix expand to full URL; treat http(s) as-is; prepend "/" for public/.
    if (t.startsWith("blob:")) return resolveMediaUrl(t);
    if (t.startsWith("http://") || t.startsWith("https://")) return t;
    return t.startsWith("/") ? t : `/${t}`;
  };

  const carouselSlides =
    heroCarousel?.slides?.map((slide) => ({
      id: slide.id,
      image: normalizePublicSrc(slide.imageSrc),
      imageAlt: slide.imageAlt ?? "",
      eyebrow: slide.eyebrow,
      title: slide.title,
      description: slide.description,
    })) ?? [];

  return {
    site,
    seo: {
      ...page.seo,
      openGraphImage: ogImage,
    },
    navbar: {
      ...page.navbar,
      logoUrl: logo.url,
      logoAlt: logo.alt || page.navbar.brandName,
    },
    hero: {
      ...page.hero,
      videoUrl: heroVideo.url,
      posterUrl: heroPoster.url,
      posterAlt: heroPoster.alt,
      carousel: {
        autoplayMs: heroCarousel?.autoplayMs ?? 6500,
        transitionMs: heroCarousel?.transitionMs ?? 900,
        slides: carouselSlides,
      },
    },
    about: {
      ...page.about,
      imageUrl: aboutImage.url,
      imageAlt: aboutImage.alt,
    },
    services: {
      ...page.services,
      items: services,
    },
    projects: {
      ...page.projects,
      items: projects,
    },
    reviews: page.reviews,
    contact: page.contact,
    mission: page.mission ?? null,
    servicesAccordion: page.servicesAccordion
      ? {
          ...page.servicesAccordion,
          items: page.servicesAccordion.items.map((item) => ({
            ...item,
            image: item.imageMediaKey ? pick(item.imageMediaKey).url : "",
            imageAlt: item.imageMediaKey ? pick(item.imageMediaKey).alt : "",
          })),
        }
      : null,
    featuredProjects: page.featuredProjects
      ? {
          ...page.featuredProjects,
          items: page.featuredProjects.items.map((item) => ({
            ...item,
            image: pick(item.imageMediaKey).url,
            imageAlt: pick(item.imageMediaKey).alt,
          })),
        }
      : null,
    process: page.process,
    ctaBanner: page.ctaBanner,
    footer: page.footer,
  };
}
