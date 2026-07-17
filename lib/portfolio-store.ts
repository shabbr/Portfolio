import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import type { PortfolioData } from "./portfolio-types";
import {
  isBlobConfigured,
  isVercelRuntime,
  readJsonBlob,
  storageWriteHint,
  writeJsonBlob,
} from "./blob-store";

const DATA_PATH = path.join(process.cwd(), "data", "portfolio.json");
const BLOB_PATH = "cms/portfolio.json";

async function readPortfolioFromDisk(): Promise<PortfolioData> {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as PortfolioData;
}

async function writePortfolioToDisk(data: PortfolioData): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
}

/** Uncached load — use after writes or when bypassing React request cache. */
export async function loadPortfolio(): Promise<PortfolioData> {
  if (isBlobConfigured()) {
    const remote = await readJsonBlob<PortfolioData>(BLOB_PATH);
    if (remote) return remote;

    // First deploy / empty blob — seed from the repo file and persist to Blob.
    const seeded = await readPortfolioFromDisk();
    try {
      await writeJsonBlob(BLOB_PATH, seeded);
    } catch {
      // Read still works from disk on this request even if seed write fails.
    }
    return seeded;
  }

  return readPortfolioFromDisk();
}

/**
 * Deduplicate portfolio reads within a single request (page + metadata).
 * On Vercel with Blob configured, live CMS edits are read from Blob.
 * Otherwise falls back to the committed data/portfolio.json file.
 */
export const readPortfolio = cache(loadPortfolio);

export async function writePortfolio(data: PortfolioData): Promise<PortfolioData> {
  const normalized = normalizePortfolio(data);

  if (isBlobConfigured()) {
    await writeJsonBlob(BLOB_PATH, normalized);
    return normalized;
  }

  if (isVercelRuntime()) {
    throw new Error(
      "Cannot write files on Vercel’s serverless filesystem. " +
        "Create a Vercel Blob store for this project (Storage → Blob), " +
        "set BLOB_READ_WRITE_TOKEN, redeploy, then save again.",
    );
  }

  try {
    await writePortfolioToDisk(normalized);
    return normalized;
  } catch (err) {
    throw new Error(storageWriteHint(err));
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
