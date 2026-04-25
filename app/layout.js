import { Cormorant_Garamond, DM_Sans, Montserrat, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import seoDefaults from "@/web-data/seo/defaults.json";
import site from "@/web-data/site.json";

const brandAimFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-brand-aim-family",
  weight: ["700"],
});

const brandCondensedFont = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-brand-condensed-family",
  weight: ["700"],
});

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading-family",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body-family",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL(site.baseUrl),
  icons: {
    icon: [
      { url: "/logo/bg-transparent.png", type: "image/png" },
    ],
    shortcut: "/logo/bg-transparent.png",
    apple: "/logo/bg-transparent.png",
  },
  title: {
    default: seoDefaults.defaultTitle,
    template: seoDefaults.titleTemplate,
  },
  description: seoDefaults.defaultDescription,
  keywords: [
    "commercial kitchen design",
    "BIM modeling",
    "BIM coordination",
    "floor planning",
    "architectural design",
    "food service design",
    "kitchen layout design",
    "Revit BIM services",
    "construction documentation",
    "space planning",
    "hospitality design",
  ],
  authors: [{ name: site.companyName, url: site.baseUrl }],
  creator: site.companyName,
  publisher: site.companyName,
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: seoDefaults.locale,
    siteName: site.companyName,
    url: site.baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    site: seoDefaults.twitterSite,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: seoDefaults.themeColorLight },
    { media: "(prefers-color-scheme: dark)", color: seoDefaults.themeColorDark },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} ${brandAimFont.variable} ${brandCondensedFont.variable} h-full`}
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
