import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const description = `${site.name} — ${site.tagline} Based in ${site.location}.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Full-Stack Developer · AI & IoT`,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    "Deeghayu Adhikari",
    "Full-Stack Developer",
    "Sri Lanka",
    "Machine Learning Engineer",
    "AI Engineer",
    "IoT Developer",
    "Next.js Developer",
    "React Developer",
    "University of Kelaniya",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Full-Stack Developer · AI & IoT`,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Full-Stack Developer · AI & IoT`,
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
    { media: "(prefers-color-scheme: light)", color: "#eef0f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <GlassFilter />
          <CustomCursor />
          <Preloader />
          <SmoothScroll />
          <a
            href="#main"
            className="glass-strong fixed left-4 top-4 z-100 -translate-y-24 rounded-full px-5 py-3 text-sm font-semibold transition-transform focus:translate-y-0"
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
