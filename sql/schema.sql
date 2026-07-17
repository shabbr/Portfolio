-- Portfolio CMS schema (MySQL 8+ / MariaDB 10.5+)
-- Run once on your database, then set DATABASE_URL in Vercel.

CREATE TABLE IF NOT EXISTS cms_documents (
  doc_key VARCHAR(64) NOT NULL PRIMARY KEY,
  data JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: verify
-- SELECT doc_key, updated_at FROM cms_documents;
