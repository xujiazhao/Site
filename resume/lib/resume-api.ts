import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const resumeContentDir = join(process.cwd(), "resume", "content");

export interface ResumeData {
  variant: string;
  label: string;
  title: string;
  content: string;
  htmlContent: string;
}

export function getResumeVariants(lang: string): string[] {
  const dir = join(resumeContentDir, lang);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getResumeByVariant(
  lang: string,
  variant: string
): ResumeData | null {
  const fullPath = join(resumeContentDir, lang, `${variant}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    variant: data.variant || variant,
    label: data.label || variant,
    title: data.title || "Resume",
    content,
    htmlContent: "", // will be filled after markdown conversion
  };
}

export function getAllResumes(lang: string): ResumeData[] {
  const variants = getResumeVariants(lang);
  return variants
    .map((v) => getResumeByVariant(lang, v))
    .filter((r): r is ResumeData => r !== null);
}
