import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.icop.info";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin app is behind auth; keep it out of the index.
      disallow: ["/dashboard", "/gardens", "/plots", "/reports", "/settings"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
