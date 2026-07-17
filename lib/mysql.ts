import mysql, { type Pool, type PoolOptions, type RowDataPacket, type ResultSetHeader } from "mysql2/promise";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function isMysqlConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL?.trim() ||
      (process.env.MYSQL_HOST?.trim() && process.env.MYSQL_DATABASE?.trim()),
  );
}

function poolOptionsFromEnv(): PoolOptions {
  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    // mysql2 accepts a connection URI via the `uri` option in recent versions;
    // parse manually for broad compatibility.
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 3306,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, ""),
      waitForConnections: true,
      connectionLimit: 5,
      enableKeepAlive: true,
      ssl:
        parsed.searchParams.get("ssl") === "true" ||
        parsed.searchParams.get("sslmode") === "require"
          ? { rejectUnauthorized: false }
          : undefined,
    };
  }

  return {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
    enableKeepAlive: true,
    ssl:
      process.env.MYSQL_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined,
  };
}

export function getMysqlPool(): Pool {
  if (!isMysqlConfigured()) {
    throw new Error(
      "MySQL is not configured. Set DATABASE_URL (or MYSQL_HOST / MYSQL_USER / MYSQL_PASSWORD / MYSQL_DATABASE) in Vercel env vars.",
    );
  }
  if (!pool) {
    pool = mysql.createPool(poolOptionsFromEnv());
  }
  return pool;
}

/** Create cms_documents table if missing (safe to call repeatedly). */
export async function ensureMysqlSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getMysqlPool();
      await db.execute(`
        CREATE TABLE IF NOT EXISTS cms_documents (
          doc_key VARCHAR(64) NOT NULL PRIMARY KEY,
          data JSON NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  await schemaReady;
}

export async function readMysqlDocument<T>(key: string): Promise<T | null> {
  await ensureMysqlSchema();
  const db = getMysqlPool();
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT data FROM cms_documents WHERE doc_key = ? LIMIT 1",
    [key],
  );
  if (!rows.length) return null;

  const raw = rows[0].data;
  if (raw == null) return null;
  if (typeof raw === "string") return JSON.parse(raw) as T;
  return raw as T;
}

export async function writeMysqlDocument(key: string, data: unknown): Promise<void> {
  await ensureMysqlSchema();
  const db = getMysqlPool();
  const payload = JSON.stringify(data);
  await db.execute<ResultSetHeader>(
    `INSERT INTO cms_documents (doc_key, data)
     VALUES (?, CAST(? AS JSON))
     ON DUPLICATE KEY UPDATE data = VALUES(data)`,
    [key, payload],
  );
}
