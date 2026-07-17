import { get, put, BlobNotFoundError } from "@vercel/blob";

/** True when Vercel Blob is configured (required for CMS writes on Vercel). */
export function isBlobConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      process.env.BLOB_STORE_ID?.trim(),
  );
}

export function isVercelRuntime(): boolean {
  return process.env.VERCEL === "1" || process.env.VERCEL === "true";
}

async function streamToText(stream: ReadableStream<Uint8Array>): Promise<string> {
  return new Response(stream).text();
}

/**
 * Read a private JSON document from Vercel Blob.
 * Returns null when the blob does not exist yet.
 */
export async function readJsonBlob<T>(pathname: string): Promise<T | null> {
  if (!isBlobConfigured()) return null;

  try {
    const result = await get(pathname, {
      access: "private",
      useCache: false,
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return null;
    }

    const text = await streamToText(result.stream);
    if (!text.trim()) return null;
    return JSON.parse(text) as T;
  } catch (err) {
    if (err instanceof BlobNotFoundError) return null;
    throw err;
  }
}

/** Write/overwrite a private JSON document in Vercel Blob. */
export async function writeJsonBlob(pathname: string, data: unknown): Promise<void> {
  if (!isBlobConfigured()) {
    throw new Error(
      "Vercel Blob is not configured. In Vercel → Storage, create a Blob store and ensure BLOB_READ_WRITE_TOKEN is set, then redeploy.",
    );
  }

  await put(pathname, JSON.stringify(data, null, 2) + "\n", {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}

export function storageWriteHint(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  const code = (err as NodeJS.ErrnoException)?.code;

  if (
    code === "EROFS" ||
    code === "EACCES" ||
    /read-only|EROFS|EACCES|permission denied/i.test(message)
  ) {
    return (
      "Cannot write files on Vercel’s serverless filesystem. " +
      "Create a Vercel Blob store for this project (Storage → Blob), " +
      "set BLOB_READ_WRITE_TOKEN, redeploy, then save again."
    );
  }

  return message || "Failed to save.";
}
