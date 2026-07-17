import ArcticBackground from "./components/ArcticBackground";
import Snowfall from "./components/Snowfall";
import CursorGlow from "./components/CursorGlow";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { PortfolioProvider } from "./components/PortfolioProvider";
import { readPortfolio } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const portfolio = await readPortfolio();

  return (
    <PortfolioProvider data={portfolio}>
      <main className="relative min-h-screen">
        <ArcticBackground />
        <Snowfall />
        <CursorGlow />
        <Navbar />
        <div className="relative z-10">
          <Hero />
          <div className="ice-divider mx-12 sm:mx-24" />
          <About />
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
      </main>
    </PortfolioProvider>
  );
}
