import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import type { PortfolioData } from "./portfolio-types";
import {
  cmsWriteUnavailableMessage,
  hasRemoteCmsBackend,
  readCmsDocument,
  storageWriteHint,
  writeCmsDocument,
} from "./cms-store";

const DATA_PATH = path.join(process.cwd(), "data", "portfolio.json");

async function readPortfolioFromDisk(): Promise<PortfolioData> {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as PortfolioData;
}

async function writePortfolioToDisk(data: PortfolioData): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
}

/** Uncached load — use after writes or when bypassing React request cache. */
export async function loadPortfolio(): Promise<PortfolioData> {
  const remote = await readCmsDocument<PortfolioData>("portfolio");
  if (remote) return remote;

  const seeded = await readPortfolioFromDisk();

  if (hasRemoteCmsBackend()) {
    try {
      await writeCmsDocument("portfolio", seeded);
    } catch {
      // Disk content still returned for this request.
    }
  }

  return seeded;
}

/**
 * Deduplicate portfolio reads within a single request (page + metadata).
 * Remote backends (MySQL / Blob) hold live CMS edits; disk is the seed/fallback.
 */
export const readPortfolio = cache(loadPortfolio);

export async function writePortfolio(data: PortfolioData): Promise<PortfolioData> {
  const normalized = normalizePortfolio(data);

  if (hasRemoteCmsBackend()) {
    await writeCmsDocument("portfolio", normalized);
    try {
      await writePortfolioToDisk(normalized);
    } catch {
      // Disk may be read-only on Vercel.
    }
    return normalized;
  }

  try {
    await writePortfolioToDisk(normalized);
    return normalized;
  } catch (err) {
    throw new Error(storageWriteHint(err) || cmsWriteUnavailableMessage());
  }
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
