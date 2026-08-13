import type { ContentCollection } from "@/lib/api";
import { getAllItems, getItemBySlug } from "@/lib/api";
import { CMS_NAME } from "@/lib/constants";
import { LANGUAGES } from "@/lib/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const COLLECTION_LABELS: Record<ContentCollection, string> = {
  creation: "Creation",
  experience: "Experience",
  project: "Project",
  writing: "Writing",
};

export function getContentMetadata(
  collection: ContentCollection,
  slug: string,
  lang: string,
): Metadata {
  const post = getItemBySlug(collection, slug, lang);
  if (!post) notFound();

  const description =
    post.intro ||
    post.excerpt ||
    `${post.title} – ${COLLECTION_LABELS[collection]} by ${CMS_NAME}`;

  return {
    title: post.title,
    description,
    openGraph: {
      title: `${post.title} | ${CMS_NAME}`,
      description,
      images: post.ogImage.url ? [post.ogImage.url] : [],
    },
  };
}

export function getContentStaticParams(collection: ContentCollection) {
  return LANGUAGES.flatMap((lang) =>
    getAllItems(collection, lang).map((post) => ({ lang, slug: post.slug })),
  );
}
