import ArcticBackground from "./components/ArcticBackground";
import DeferredEffects from "./components/DeferredEffects";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DeferredAbout from "./components/DeferredAbout";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import { PortfolioProvider } from "./components/PortfolioProvider";
import { readPortfolio } from "@/lib/portfolio-store";

/** Revalidate CMS content periodically instead of blocking every request. */
export const revalidate = 60;

export default async function Home() {
  const portfolio = await readPortfolio();

  return (
    <PortfolioProvider data={portfolio}>
      <main className="relative min-h-screen">
        <ArcticBackground />
        <DeferredEffects />
        <Navbar />
        <div className="relative z-10">
          <Hero />
          <div className="ice-divider mx-12 sm:mx-24" />
          <DeferredAbout />
          <div className="ice-divider mx-12 sm:mx-24" />
          <Experience />
          <div className="ice-divider mx-12 sm:mx-24" />
          <Projects />
          <div className="ice-divider mx-12 sm:mx-24" />
          <Skills />
          <div className="ice-divider mx-12 sm:mx-24" />
          <Contact />
          <Footer />
        </div>
        <WhatsAppFloat />
      </main>
    </PortfolioProvider>
  );
}
