import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DeferredFloatingCode from "./components/DeferredFloatingCode";
import JsonLd from "./components/JsonLd";
import { readPortfolio } from "@/lib/portfolio-store";

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

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "") ||
    "https://shabbr.github.io/Portfolio"
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const base = siteUrl();
  try {
    const { site } = await readPortfolio();
    const title = {
      default: `${site.fullName} | ${site.title}`,
      template: `%s | ${site.fullName}`,
    };
    const description = site.tagline;
    const keywords = [
      site.fullName,
      "Shabbar Abbas",
      "Full-Stack Engineer",
      "Laravel Developer",
      "Laravel Specialist",
      "PHP Developer",
      "Nuxt.js Developer",
      "Python Developer",
      "API Developer",
      "IconMarvel",
      "Lahore",
      "Pakistan",
      site.location,
      "Portfolio",
      "Web Developer",
    ];

    return {
      metadataBase: new URL(base),
      title,
      description,
      keywords,
      authors: [{ name: site.fullName, url: base }],
      creator: site.fullName,
      publisher: site.fullName,
      category: "technology",
      applicationName: `${site.fullName} Portfolio`,
      alternates: {
        canonical: base,
      },
      icons: {
        icon: [
          { url: "/logo.svg", type: "image/svg+xml" },
          { url: "/icon.svg", type: "image/svg+xml" },
        ],
        apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
        shortcut: ["/logo.svg"],
      },
      manifest: "/site.webmanifest",
      openGraph: {
        title: `${site.fullName} | ${site.title}`,
        description,
        url: base,
        siteName: `${site.fullName} Portfolio`,
        locale: "en_US",
        type: "website",
        images: [
          {
            url: "/opengraph-image",
            width: 1200,
            height: 630,
            alt: `${site.fullName} — ${site.title}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${site.fullName} | ${site.title}`,
        description,
        images: ["/opengraph-image"],
        creator: "@shabbr",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
      verification: process.env.GOOGLE_SITE_VERIFICATION
        ? { google: process.env.GOOGLE_SITE_VERIFICATION }
        : undefined,
    };
  } catch {
    return {
      metadataBase: new URL(base),
      title: "Shabbar Abbas | Full-Stack Engineer",
      description: "Full-Stack Software Engineer and founder of IconMarvel.",
      icons: { icon: [{ url: "/logo.svg", type: "image/svg+xml" }] },
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla) inject body attrs */}
      <body
        className="min-h-full flex flex-col bg-[#070504] text-[#fff2df]"
        suppressHydrationWarning
      >
        <JsonLd />
        <DeferredFloatingCode />
        {children}
      </body>
    </html>
  );
}
