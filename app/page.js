import homePage from "@/web-data/pages/home.json";
import media from "@/web-data/media/media.json";
import site from "@/web-data/site.json";
import { buildHomeViewModel } from "@/lib/buildHomeViewModel";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ServicesAccordion from "./components/ServicesAccordion";
import FeaturedProjects from "./components/FeaturedProjects";
import ProcessSection from "./components/ProcessSection";
import CTABanner from "./components/CTABanner";
import ReviewsSection from "./components/ReviewsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import FloatingThemeToggle from "./components/FloatingThemeToggle";

const viewModel = buildHomeViewModel({
  page: homePage,
  media,
  site,
});

export function generateMetadata() {
  const { seo } = viewModel;
  const base = site.baseUrl.replace(/\/$/, "");
  const ogUrl = seo.openGraphImage?.startsWith("http")
    ? seo.openGraphImage
    : `${base}${seo.openGraphImage || ""}`;
  const pageUrl = `${base}${seo.canonicalPath || "/"}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: pageUrl,
    },
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
              alt: `${site.companyName} — Commercial Kitchen Design, BIM & Architecture`,
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

export default function Home() {
  const jsonLdData = viewModel.seo.jsonLd;
  const jsonLdItems = Array.isArray(jsonLdData)
    ? jsonLdData
    : jsonLdData
      ? [jsonLdData]
      : [];

  return (
    <div className="aim-page-home min-h-0 flex-1">
      {jsonLdItems.map((schema, i) => (
        <script
          key={`jsonld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <a href="#main-content" className="aim-skip-link">
        Skip to main content
      </a>
      <Navbar data={viewModel.navbar} variant="home" />
      <main id="main-content" role="main" className="flex-1 pb-24 md:pb-28">
        <div id="top" />
        <Hero data={viewModel.hero} />
        <AboutSection data={viewModel.about} />
        <ServicesSection data={viewModel.services} />
        <ServicesAccordion data={viewModel.servicesAccordion} />
        <FeaturedProjects data={viewModel.featuredProjects} />
        <ProcessSection data={viewModel.process} />
        <ReviewsSection data={viewModel.reviews} />
        <CTABanner data={viewModel.ctaBanner} />
        <ContactSection data={viewModel.contact} />
      </main>
      <Footer data={viewModel.footer} site={viewModel.site} />
      <FloatingThemeToggle />
    </div>
  );
}
