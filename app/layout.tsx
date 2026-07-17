import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingCode from "./components/FloatingCode";
import { readPortfolio } from "@/lib/portfolio-store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { site } = await readPortfolio();
    const title = `${site.fullName} - ${site.title}`;
    return {
      title,
      description: site.tagline,
      keywords: [
        site.fullName,
        "Full-Stack Engineer",
        "Laravel Developer",
        "PHP Developer",
        "Nuxt.js",
        "IconMarvel",
        site.location,
      ],
      authors: [{ name: site.fullName }],
      openGraph: {
        title,
        description: site.tagline,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Shabbar Abbas - Full-Stack Engineer",
      description: "Full-Stack Software Engineer and founder of IconMarvel.",
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
      <body className="min-h-full flex flex-col bg-[#070504] text-[#fff2df]">
        <FloatingCode />
        {children}
      </body>
    </html>
  );
}
