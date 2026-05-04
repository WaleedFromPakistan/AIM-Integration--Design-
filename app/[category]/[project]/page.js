import { notFound } from "next/navigation";
import {
  getProjectByRoute,
  getProjectStaticParams,
} from "@/lib/projects";
import {
  buildProjectPageViewModel,
  mergeProjectBlobAssets,
} from "@/lib/buildProjectPageViewModel";
import { getCachedProjectBlobAssets } from "@/lib/projectBlobAssets";
import { buildHomeViewModel } from "@/lib/buildHomeViewModel";
import media from "@/web-data/media/media.json";
import site from "@/web-data/site.json";
import homePage from "@/web-data/pages/home.json";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FloatingThemeToggle from "@/app/components/FloatingThemeToggle";

import LenisProvider from "./_components/LenisProvider";
import ProjectHero from "./_components/ProjectHero";
import ProjectAbout from "./_components/ProjectAbout";
import ProjectBento from "./_components/ProjectBento";
import ProjectEquipment from "./_components/ProjectEquipment";
import ProjectHotline from "./_components/ProjectHotline";
import ProjectCallout from "./_components/ProjectCallout";
import ProjectSimpleGallery from "./_components/ProjectSimpleGallery";
import "./_components/project-page.css";

/* SSG + ISR — same strategy as the service detail pages. */
export const dynamic = "force-static";
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectStaticParams();
}

const homeViewModel = buildHomeViewModel({ page: homePage, media, site });

function rerootHash(href) {
  return typeof href === "string" && href.startsWith("#") ? `/${href}` : href;
}

function navbarForProject(nav) {
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

export async function generateMetadata({ params }) {
  const { category, project } = await params;
  const found = getProjectByRoute({ category, project });
  if (!found) return {};

  let vm = buildProjectPageViewModel({ page: found, media, site });
  if (found.blobAssetPrefix) {
    const blobPack = await getCachedProjectBlobAssets(found.blobAssetPrefix);
    if (blobPack) vm = mergeProjectBlobAssets(vm, blobPack, found);
  }
  const { seo } = vm;
  const base = site.baseUrl.replace(/\/$/, "");
  const ogUrl = seo.openGraphImage?.startsWith("http")
    ? seo.openGraphImage
    : `${base}${seo.openGraphImage || ""}`;
  const pageUrl = `${base}${seo.canonicalPath || vm.route}`;

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
      type: seo.openGraph?.type || "article",
      locale: "en_US",
      images: ogUrl
        ? [{ url: ogUrl, width: 1200, height: 630, alt: seo.title }]
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

export default async function ProjectPage({ params }) {
  const { category, project } = await params;
  const found = getProjectByRoute({ category, project });
  if (!found) notFound();

  let vm = buildProjectPageViewModel({ page: found, media, site });
  if (found.blobAssetPrefix) {
    const blobPack = await getCachedProjectBlobAssets(found.blobAssetPrefix);
    if (blobPack) vm = mergeProjectBlobAssets(vm, blobPack, found);
  }
  const jsonLd = vm.seo.jsonLd ? JSON.stringify(vm.seo.jsonLd) : null;

  const simple = vm.layout === "simple";

  return (
    <div
      className={`aim-page-project min-h-0 flex-1${simple ? " aim-page-project--simple" : ""}`}
    >
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      ) : null}

      <a href="#project-main" className="aim-skip-link">Skip to main content</a>
      <Navbar data={navbarForProject(homeViewModel.navbar)} variant="project" />

      <LenisProvider>
        <main id="project-main" role="main" className="flex-1">
          {vm.hero ? <ProjectHero data={vm.hero} /> : null}
          {vm.about ? <ProjectAbout data={vm.about} /> : null}
          {simple ? (
            vm.gallery ? <ProjectSimpleGallery data={vm.gallery} /> : null
          ) : (
            <>
              {vm.bento ? <ProjectBento data={vm.bento} /> : null}
              {vm.equipment ? <ProjectEquipment data={vm.equipment} /> : null}
              {vm.hotline ? <ProjectHotline data={vm.hotline} /> : null}
            </>
          )}
          {vm.callout ? <ProjectCallout data={vm.callout} /> : null}
        </main>
      </LenisProvider>

      <Footer data={homeViewModel.footer} site={homeViewModel.site} />
      <FloatingThemeToggle />
    </div>
  );
}
