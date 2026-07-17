"use client";

import { createContext, useContext, useMemo } from "react";
import type { PortfolioData } from "@/lib/portfolio-types";
import { sortByOrder } from "@/lib/portfolio-types";

const PortfolioContext = createContext<PortfolioData | null>(null);

export function PortfolioProvider({
  data,
  children,
}: {
  data: PortfolioData;
  children: React.ReactNode;
}) {
  const value = useMemo(() => data, [data]);
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): PortfolioData {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return ctx;
}

export function useVisibleExperience() {
  const { experience } = usePortfolio();
  return useMemo(
    () => sortByOrder(experience.filter((e) => e.visible)),
    [experience],
  );
}

export function useVisibleProjects() {
  const { projects } = usePortfolio();
  return useMemo(
    () => sortByOrder(projects.filter((p) => p.visible)),
    [projects],
  );
}

export function useOrderedNav() {
  const { navLinks } = usePortfolio();
  return useMemo(() => sortByOrder(navLinks), [navLinks]);
}

export function useOrderedSkillCategories() {
  const { skillCategories } = usePortfolio();
  return useMemo(() => sortByOrder(skillCategories), [skillCategories]);
}

export function useOrderedSkillLevels() {
  const { skillLevels } = usePortfolio();
  return useMemo(() => sortByOrder(skillLevels), [skillLevels]);
}
