import { MetadataRoute } from "next";
import { getAllItems } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const langs = ["en", "zh"];
  const collections = ["experience", "project", "writing"] as const;
  const entries: MetadataRoute.Sitemap = [];

  // Home pages
  for (const lang of langs) {
    entries.push({
      url: `${SITE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
  }

  // Collection pages
  for (const lang of langs) {
    for (const collection of collections) {
      const items = getAllItems(collection, lang);
      for (const item of items) {
        entries.push({
          url: `${SITE_URL}/${lang}/${collection}/${item.slug}`,
          lastModified: item.date ? new Date(item.date) : new Date(),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  }

  // Creation pages (shared, no lang prefix needed but routed under lang)
  for (const lang of langs) {
    const creations = getAllItems("creation", lang);
    for (const item of creations) {
      entries.push({
        url: `${SITE_URL}/${lang}/creation/${item.slug}`,
        lastModified: item.date ? new Date(item.date) : new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
