import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    // Dois sitemaps: o do Next cobre o site institucional; o do WordPress
    // cobre o blog, que é servido pelo proxy em /blog.
    sitemap: [
      "https://consultoriahorizon.com.br/sitemap.xml",
      "https://consultoriahorizon.com.br/blog/wp-sitemap.xml",
    ],
  };
}
