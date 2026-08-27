import type { Metadata, Viewport } from "next";
import { Kanit, Noto_Sans_Sinhala } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AuroraBackground } from "@/components/AuroraBackground";
import { site } from "@/data/site";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const notoSinhala = Noto_Sans_Sinhala({
  variable: "--font-sinhala",
  weight: ["700", "900"],
  subsets: ["sinhala"],
  display: "swap",
});

/* Tab-width friendly: role phrase lives in the description/OG, not the tab */
const TITLE = site.name;
const description = `${site.name} — ${site.tagline} Based in ${site.location}.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: TITLE,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    "Deeghayu Adhikari",
    "Software Engineer",
    "Electronic Engineer",
    "Sri Lanka",
    "AI Engineer",
    "Machine Learning Engineer",
    "IoT Developer",
    "Embedded Systems",
    "Next.js Developer",
    "React Developer",
    "Visiting Lecturer",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  // canonical lives on page-level metadata (src/app/page.tsx) — a global
  // one here would leak onto 404s and every future route
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: TITLE,
    description,
    locale: "en_US",
    // og:image comes from the file convention (src/app/opengraph-image.tsx),
    // which outranks anything listed here — keep this empty to avoid a stale double.
  },
  // No title/description here: they'd be inherited verbatim by every
  // subpage's Twitter card. Next falls back to each page's resolved values.
  twitter: {
    card: "summary_large_image",
    creator: "@DeegayuA",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F3F5" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0C0C" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${kanit.variable} ${notoSinhala.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Runs before first paint: raise the CSS veil (globals.css
            html[data-intro]) on first visits so the SSR-visible hero never
            flashes before the Preloader mounts. Key mirrors PRELOAD_KEY. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(!sessionStorage.getItem("dw-preloaded")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="1"}catch(e){}',
          }}
        />
        <Providers>
          <AuroraBackground />
          <ScrollProgress />
          <CustomCursor />
          <Preloader />
          <SmoothScroll />
          <a
            href="#main"
            className="bg-slab text-slab-fg fixed left-4 top-4 z-[100] -translate-y-24 rounded-full px-5 py-3 text-sm font-semibold transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
