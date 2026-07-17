import { readPortfolio } from "@/lib/portfolio-store";

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "") ||
    "https://shabbr.github.io/Portfolio"
  );
}

/** JSON-LD for Person + WebSite — helps Google understand the portfolio. */
export default async function JsonLd() {
  let site;
  try {
    ({ site } = await readPortfolio());
  } catch {
    return null;
  }

  const url = siteUrl();
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.fullName,
    url,
    image: `${url}/logo.svg`,
    jobTitle: site.title,
    description: site.tagline,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location,
      addressCountry: "PK",
    },
    sameAs: [site.github, site.linkedin, site.website].filter(Boolean),
    knowsAbout: [
      "Laravel",
      "PHP",
      "Nuxt.js",
      "Python",
      "Full-Stack Development",
      "REST APIs",
      "Web Applications",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${site.fullName} Portfolio`,
    url,
    description: site.tagline,
    author: { "@type": "Person", name: site.fullName },
    inLanguage: "en",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
