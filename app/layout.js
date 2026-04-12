import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import seoDefaults from "@/web-data/seo/defaults.json";
import site from "@/web-data/site.json";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading-family",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body-family",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(site.baseUrl),
  title: {
    default: seoDefaults.defaultTitle,
    template: seoDefaults.titleTemplate,
  },
  description: seoDefaults.defaultDescription,
  keywords: [
    "commercial kitchen design",
    "BIM modeling",
    "floor planning",
    "architectural design",
  ],
  openGraph: {
    type: "website",
    locale: seoDefaults.locale,
    siteName: site.companyName,
  },
  twitter: {
    card: "summary_large_image",
    site: seoDefaults.twitterSite,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className={`min-h-full flex flex-col aim-body ${bodyFont.className}`}
      >
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      </body>
    </html>
  );
}
