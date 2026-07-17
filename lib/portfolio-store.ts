import { promises as fs } from "fs";
import path from "path";
import type { PortfolioData } from "./portfolio-types";

const DATA_PATH = path.join(process.cwd(), "data", "portfolio.json");

export async function readPortfolio(): Promise<PortfolioData> {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as PortfolioData;
}

export async function writePortfolio(data: PortfolioData): Promise<void> {
  const normalized = normalizePortfolio(data);
  await fs.writeFile(DATA_PATH, JSON.stringify(normalized, null, 2) + "\n", "utf8");
}

function normalizePortfolio(data: PortfolioData): PortfolioData {
  return {
    ...data,
    navLinks: reindex(data.navLinks),
    about: {
      ...data.about,
      paragraphs: data.about.paragraphs.filter((p) => p.trim().length > 0),
      tags: data.about.tags.map((t) => t.trim()).filter(Boolean),
      stats: reindex(data.about.stats),
      highlights: reindex(data.about.highlights),
    },
    experience: reindex(data.experience),
    projects: reindex(data.projects),
    skillCategories: reindex(data.skillCategories),
    skillLevels: reindex(data.skillLevels),
  };
}

function reindex<T extends { order: number }>(items: T[]): T[] {
  return [...items]
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index }));
}
