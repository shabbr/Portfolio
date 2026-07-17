# Portfolio

Personal portfolio for **Shabbar Abbas** — Full-Stack Engineer & Laravel Specialist. Built with Next.js, includes an admin CMS, contact email delivery, and password reset.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin

- Dashboard: `/admin`
- Configure email credentials and site content from the admin panel

## Environment

Copy `.env.example` to `.env.local` and set:

- `ADMIN_PASSWORD` / `ADMIN_SECRET`
- `RESEND_API_KEY` (for contact form emails)
- `NEXT_PUBLIC_SITE_URL` — **your live site URL** (required for SEO canonical, sitemap, OG, password-reset links)

### Vercel admin saves (MySQL — recommended)

Vercel’s filesystem is **read-only**, so Admin → Save cannot persist `data/portfolio.json` in production.

**Use MySQL** (best approach for this CMS):

1. Create a MySQL database (PlanetScale, Railway, Aiven, cPanel, RDS, etc.)
2. Run `sql/schema.sql` once on that database
3. In Vercel → **Settings → Environment Variables**, set:
   - `DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DB_NAME`  
     (or `MYSQL_HOST` / `MYSQL_USER` / `MYSQL_PASSWORD` / `MYSQL_DATABASE`)
4. **Redeploy**
5. Save from `/admin` — data is stored in the `cms_documents` table

Priority: **MySQL → Blob → local files**. Locally, files still work without a DB.

## SEO (on-page — built in)

- Semantic metadata (title template, description, keywords)
- Canonical URL + Open Graph + Twitter cards
- `robots.txt` + `sitemap.xml`
- JSON-LD (`Person` + `WebSite`)
- Brand logo (`/logo.svg`) for favicon / Apple icon / share image
- Admin routes disallowed from indexing

### Off-page ranking (do after deploy)

These cannot be done in code — you do them once the site is live:

1. Set `NEXT_PUBLIC_SITE_URL` to the production URL
2. [Google Search Console](https://search.google.com/search-console) → add property → submit `sitemap.xml`
3. [Bing Webmaster Tools](https://www.bing.com/webmasters) → submit sitemap
4. Share on LinkedIn / GitHub profile website field
5. Build quality backlinks (guest posts, directory listings, IconMarvel footer link)
6. Keep content updated via Admin (projects, experience)

## Logo

Brand mark is a rounded **SA** monogram (warm gold on dark), not a geometric triangle. Files:

- `public/logo.svg` — primary brand logo
- `app/icon.svg` — favicon
- `app/apple-icon.tsx` / `app/opengraph-image.tsx` — generated icons & OG image
