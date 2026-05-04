import { notFound } from "next/navigation";
import { SERVICE_SLUGS, getServiceBySlug } from "@/lib/services";
import { buildServicePageViewModel } from "@/lib/buildServicePageViewModel";
import { buildHomeViewModelWithBlobCards } from "@/lib/buildHomeViewModel";
import media from "@/web-data/media/media.json";
import site from "@/web-data/site.json";
import homePage from "@/web-data/pages/home.json";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FloatingThemeToggle from "@/app/components/FloatingThemeToggle";
import FeaturedProjects from "@/app/components/FeaturedProjects";

import ServiceHero from "@/app/services/_components/ServiceHero";
import ServiceAbout from "@/app/services/_components/ServiceAbout";
import ServiceGallery from "@/app/services/_components/ServiceGallery";
import ServiceTools from "@/app/services/_components/ServiceTools";

/* ============================================================
   SSG + ISR
   - generateStaticParams: returns the 4 known service slugs so all
     four detail pages are generated as fully static HTML at build.
   - dynamic = "force-static" + revalidate = 3600: identical to the
     home page strategy. Each unique URL is cached at the edge for
     1 hour, then quietly regenerated in the background.
   ============================================================ */
export const dynamic = "force-static";
export const revalidate = 3600;
export const dynamicParams = false; // 404 unknown slugs at the edge

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

/**
 * Convert in-page hash links (e.g. "#about") to root-anchored hash links
 * ("/#about") so they navigate from a service page back to the home
 * section. Absolute and route-prefixed hrefs are left untouched.
 */
function rerootHash(href) {
  return typeof href === "string" && href.startsWith("#") ? `/${href}` : href;
}

function navbarForService(nav) {
  if (!nav) return nav;
  return {
    ...nav,
    links: nav.links?.map((l) => ({ ...l, href: rerootHash(l.href) })),
    servicesMenu: nav.servicesMenu
      ? {
          ...nav.servicesMenu,
          items: nav.servicesMenu.items?.map((i) => ({ ...i, href: rerootHash(i.href) })),
        }
      : undefined,
    cta: nav.cta ? { ...nav.cta, href: rerootHash(nav.cta.href) } : undefined,
  };
}

/* ============================================================
   SEO metadata per slug
   ============================================================ */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const viewModel = buildServicePageViewModel({ page: service, media, site });
  const { seo } = viewModel;
  const base = site.baseUrl.replace(/\/$/, "");
  const ogUrl = seo.openGraphImage?.startsWith("http")
    ? seo.openGraphImage
    : `${base}${seo.openGraphImage || ""}`;
  const pageUrl = `${base}${seo.canonicalPath || `/services/${slug}`}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: pageUrl },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: pageUrl,
      siteName: site.companyName,
      type: seo.openGraph?.type || "website",
      locale: "en_US",
      images: ogUrl
        ? [
            {
              url: ogUrl,
              width: 1200,
              height: 630,
              alt: `${seo.title}`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ogUrl ? [ogUrl] : [],
      site: "@aimintegrateddesign",
    },
  };
}

/* ============================================================
   Page render
   ============================================================ */
export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const viewModel = buildServicePageViewModel({ page: service, media, site });

  const homeViewModel = await buildHomeViewModelWithBlobCards({
    page: homePage,
    media,
    site,
  });

  // Use the same registry-backed project cards as the home page,
  // scoped by this service's filter category when set.
  const recentProjectsData = homeViewModel.featuredProjects
    ? {
        ...homeViewModel.featuredProjects,
        eyebrow: viewModel.recentProjects?.eyebrow ?? homeViewModel.featuredProjects.eyebrow,
        title: viewModel.recentProjects?.title ?? homeViewModel.featuredProjects.title,
        subtitle: viewModel.recentProjects?.subtitle ?? homeViewModel.featuredProjects.subtitle,
        id: "service-projects",
        items: homeViewModel.featuredProjects.items.filter(
          (p) => !viewModel.recentProjects?.filterCategory ||
            p.category === viewModel.recentProjects.filterCategory,
        ),
      }
    : null;

  const jsonLd = viewModel.seo.jsonLd
    ? JSON.stringify(viewModel.seo.jsonLd)
    : null;

  return (
    <div className="aim-page-service min-h-0 flex-1">
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      ) : null}

      <a href="#service-main" className="aim-skip-link">
        Skip to main content
      </a>
      <Navbar data={navbarForService(homeViewModel.navbar)} variant="service" />

      <main id="service-main" role="main" className="flex-1 pb-24 md:pb-28">
        <ServiceHero data={viewModel.hero} />
        <ServiceAbout data={viewModel.about} slug={slug} />
        <ServiceGallery data={viewModel.gallery} />
        <ServiceTools data={viewModel.tools} />
        {recentProjectsData?.items?.length ? (
          <FeaturedProjects
            data={recentProjectsData}
            defaultFilter={viewModel.recentProjects?.filterCategory ?? "All"}
            hideFilter
          />
        ) : null}
      </main>

      <Footer data={homeViewModel.footer} site={homeViewModel.site} />
      <FloatingThemeToggle />
    </div>
  );
}
