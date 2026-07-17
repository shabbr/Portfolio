import {
  isBlobConfigured,
  isVercelRuntime,
  readJsonBlob,
  storageWriteHint,
  writeJsonBlob,
} from "./blob-store";
import { isMysqlConfigured, readMysqlDocument, writeMysqlDocument } from "./mysql";

export type CmsBackend = "mysql" | "blob" | "filesystem";

export function getCmsBackend(): CmsBackend {
  if (isMysqlConfigured()) return "mysql";
  if (isBlobConfigured()) return "blob";
  return "filesystem";
}

/** True when a remote store (MySQL or Blob) can accept CMS writes. */
export function hasRemoteCmsBackend(): boolean {
  const backend = getCmsBackend();
  return backend === "mysql" || backend === "blob";
}

export function canPersistCmsWrites(): boolean {
  if (hasRemoteCmsBackend()) return true;
  return !isVercelRuntime();
}

export function cmsWriteUnavailableMessage(): string {
  return (
    "Live CMS saves need MySQL. Set DATABASE_URL in Vercel env vars, " +
    "run sql/schema.sql once on your database, redeploy, then save again. " +
    "(Optional fallback: Vercel Blob via BLOB_READ_WRITE_TOKEN.)"
  );
}

/**
 * Read a CMS JSON document from MySQL or Blob.
 * Returns null when not found / not configured (caller uses disk/defaults).
 */
export async function readCmsDocument<T>(
  key: "portfolio" | "settings",
): Promise<T | null> {
  const backend = getCmsBackend();

  if (backend === "mysql") {
    return readMysqlDocument<T>(key);
  }

  if (backend === "blob") {
    return readJsonBlob<T>(`cms/${key}.json`);
  }

  return null;
}

/** Persist a CMS JSON document to MySQL or Blob. */
export async function writeCmsDocument(
  key: "portfolio" | "settings",
  data: unknown,
): Promise<"mysql" | "blob"> {
  const backend = getCmsBackend();

  if (backend === "mysql") {
    await writeMysqlDocument(key, data);
    return "mysql";
  }

  if (backend === "blob") {
    await writeJsonBlob(`cms/${key}.json`, data);
    return "blob";
  }

  throw new Error(cmsWriteUnavailableMessage());
}

export { storageWriteHint, isVercelRuntime };
