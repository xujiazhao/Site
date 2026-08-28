import { MetadataRoute } from "next";
import { getAllItems } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";
import { LANGUAGES } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const collections = ["experience", "project", "writing"] as const;
  const entries: MetadataRoute.Sitemap = [];

  // Home pages
  for (const lang of LANGUAGES) {
    entries.push({
      url: `${SITE_URL}/${lang}`,
      changeFrequency: "weekly",
      priority: 1,
    });
    entries.push({
      url: `${SITE_URL}/${lang}/atlas`,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Collection pages
  for (const lang of LANGUAGES) {
    for (const collection of collections) {
      const items = getAllItems(collection, lang);
      for (const item of items) {
        entries.push({
          url: `${SITE_URL}/${lang}/${collection}/${item.slug}`,
          lastModified: new Date(item.lastModified),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  }

  // Creation pages (shared, no lang prefix needed but routed under lang)
  for (const lang of LANGUAGES) {
    const creations = getAllItems("creation", lang);
    for (const item of creations) {
      entries.push({
        url: `${SITE_URL}/${lang}/creation/${item.slug}`,
        lastModified: new Date(item.lastModified),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
