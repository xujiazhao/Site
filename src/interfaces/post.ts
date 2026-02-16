
export type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  preview?: boolean;
  // New fields
  intro?: string;
  location?: string;
  dateRange?: string;
  type?: string;
  sorting?: number;
  area?: string[];
  skill?: string[];
  favicon?: string;
};
