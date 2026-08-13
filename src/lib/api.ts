import { Post } from "@/interfaces/post";
import { isLanguage } from "@/lib/i18n";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const contentDirectory = join(process.cwd(), "content");
const SAFE_SLUG = /^[a-z0-9][a-z0-9-]*$/;

export const CONTENT_COLLECTIONS = [
  "creation",
  "experience",
  "project",
  "writing",
] as const;

export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number];

// Collections that support both shared (content/{collection}/) and
// language-specific (content/{lang}/{collection}/) files.
const HYBRID_COLLECTIONS = new Set<ContentCollection>(["creation"]);

function getMarkdownSlugs(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.replace(/\.md$/, ""))
    .filter((slug) => SAFE_SLUG.test(slug))
    .sort();
}

function normalizeDate(value: unknown, fallback: Date): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
    return value;
  }

  return fallback.toISOString();
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function getSlugs(collection: ContentCollection, lang: string): string[] {
  if (!isLanguage(lang)) return [];

  const langDir = join(contentDirectory, lang, collection);
  const sharedDir = join(contentDirectory, collection);

  if (HYBRID_COLLECTIONS.has(collection)) {
    const langSlugs = getMarkdownSlugs(langDir);
    const sharedSlugs = getMarkdownSlugs(sharedDir);
    const langSet = new Set(langSlugs);
    return [...langSlugs, ...sharedSlugs.filter((slug) => !langSet.has(slug))];
  }

  return getMarkdownSlugs(langDir);
}

export function getItemBySlug(
  collection: ContentCollection,
  slug: string,
  lang: string,
): Post | null {
  const realSlug = slug.replace(/\.md$/, "");
  if (!isLanguage(lang) || !SAFE_SLUG.test(realSlug)) return null;

  let fullPath: string;
  if (HYBRID_COLLECTIONS.has(collection)) {
    const langPath = join(contentDirectory, lang, collection, `${realSlug}.md`);
    const sharedPath = join(contentDirectory, collection, `${realSlug}.md`);
    fullPath = fs.existsSync(langPath) ? langPath : sharedPath;
  } else {
    fullPath = join(contentDirectory, lang, collection, `${realSlug}.md`);
  }
  
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const lastModified = fs.statSync(fullPath).mtime;
  const coverImage = asString(data.coverImage);
  const ogImageUrl =
    typeof data.ogImage?.url === "string" ? data.ogImage.url : coverImage;

  const post: Post = {
    slug: realSlug,
    title: asString(data.title, "Untitled"),
    date: normalizeDate(data.date, lastModified),
    coverImage,
    excerpt: asString(data.excerpt),
    ogImage: { url: ogImageUrl },
    content,
    preview: data.preview === true,
    intro: asString(data.intro),
    location: asString(data.location),
    dateRange: asString(data.dateRange),
    type: asString(data.type),
    sorting: typeof data.sorting === "number" ? data.sorting : 0,
    area: asStringArray(data.area),
    skill: asStringArray(data.skill),
    favicon: asString(data.favicon),
    firstImage: (() => {
      const match = content.match(/!\[.*?\]\((.*?)\)/);
      return coverImage || match?.[1] || "";
    })(),
    lastModified: lastModified.toISOString(),
  };

  return post;
}

export function getAllItems(collection: ContentCollection, lang: string): Post[] {
  const slugs = getSlugs(collection, lang);
  return slugs
    .map((slug) => getItemBySlug(collection, slug, lang))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => {
      const dateDifference = Date.parse(b.date) - Date.parse(a.date);
      return dateDifference || a.slug.localeCompare(b.slug);
    });
}
