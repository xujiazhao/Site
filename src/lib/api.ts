import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const contentDirectory = join(process.cwd(), "content");

export function getSlugs(collection: string, lang: string) {
  const dir = join(contentDirectory, lang, collection);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir);
}

export function getItemBySlug(collection: string, slug: string, lang: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(contentDirectory, lang, collection, `${realSlug}.md`);
  
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const post: Post = {
    slug: realSlug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString(),
    coverImage: data.coverImage || '',
    excerpt: data.excerpt || '',
    ogImage: data.ogImage || { url: data.coverImage || '' },
    content,
    preview: data.preview || false,
    intro: data.intro || '',
    location: data.location || '',
    dateRange: data.dateRange || '',
    type: data.type || '',
    sorting: data.sorting || 0,
    area: data.area || [],
    skill: data.skill || [],
  };

  return post;
}

export function getAllItems(collection: string, lang: string): Post[] {
  const slugs = getSlugs(collection, lang);
  const posts = slugs
    .map((slug) => getItemBySlug(collection, slug, lang))
    .filter((post): post is Post => post !== null)
    // Sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
