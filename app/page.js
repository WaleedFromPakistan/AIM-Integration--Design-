import homePage from "@/web-data/pages/home.json";
import media from "@/web-data/media/media.json";
import site from "@/web-data/site.json";
import { buildHomeViewModel } from "@/lib/buildHomeViewModel";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ProjectsSection from "./components/ProjectsSection";
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

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: seo.canonicalPath },
    robots: seo.robots,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${base}${seo.canonicalPath || "/"}`,
      type: seo.openGraph?.type || "website",
      images: ogUrl ? [{ url: ogUrl, alt: site.companyName }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ogUrl ? [ogUrl] : [],
    },
  };
}

export default function Home() {
  const jsonLd = viewModel.seo.jsonLd
    ? JSON.stringify(viewModel.seo.jsonLd)
    : null;

  return (
    <div className="aim-page-home min-h-0 flex-1">
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      ) : null}
      <Navbar data={viewModel.navbar} variant="home" />
      <main id="top" className="flex-1 pb-24 md:pb-28">
        <Hero data={viewModel.hero} />
        <AboutSection data={viewModel.about} />
        <ServicesSection data={viewModel.services} />
        <ProjectsSection data={viewModel.projects} />
        <ReviewsSection data={viewModel.reviews} />
        <ContactSection data={viewModel.contact} />
      </main>
      <Footer data={viewModel.footer} site={viewModel.site} />
      <FloatingThemeToggle />
    </div>
  );
}
