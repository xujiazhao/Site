import { type Author } from "./author";

export type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: Author;
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  preview?: boolean;
  // New fields
  intro?: string;
  location?: string;
  type?: string;
  sorting?: number;
  area?: string[];
  skill?: string[];
};
