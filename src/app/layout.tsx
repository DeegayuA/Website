import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { GlassFilter } from "@/components/GlassFilter";
import { CustomCursor } from "@/components/CustomCursor";
import { site } from "@/data/site";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = `${site.name} — Software + Electronic Engineer`;
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: TITLE,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description,
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
    { media: "(prefers-color-scheme: light)", color: "#e9edf3" },
    { media: "(prefers-color-scheme: dark)", color: "#070b12" },
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
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <GlassFilter />
          <CustomCursor />
          <Preloader />
          <SmoothScroll />
          <a
            href="#main"
            className="glass-strong fixed left-4 top-4 z-[100] -translate-y-24 rounded-full px-5 py-3 text-sm font-semibold transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <AuroraBackground />
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
