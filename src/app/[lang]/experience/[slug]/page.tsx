import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllItems, getItemBySlug } from "@/lib/api";
import { CMS_NAME } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
import Container from "@/app/_components/container";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";

// Separate type since params are passed by Next.js
type Params = {
  params: {
    slug: string;
    lang: string;
  };
};

export default async function Post({ params }: Params) {
  const post = getItemBySlug("experience", params.slug, params.lang);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <Container>
        <article className="mb-32">
          <PostHeader
            title={post.title}
            date={post.date}
            favicon={post.favicon}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

export function generateMetadata({ params }: Params): Metadata {
  const post = getItemBySlug("experience", params.slug, params.lang);

  if (!post) {
    return notFound();
  }

  const title = post.title;
  const description = post.intro || post.excerpt || `${post.title} – Experience by ${CMS_NAME}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${CMS_NAME}`,
      description,
      images: post.ogImage.url ? [post.ogImage.url] : [],
    },
  };
}

export async function generateStaticParams() {
  const langs = ['en', 'zh'];
  const params: { lang: string; slug: string }[] = [];
  
  for (const lang of langs) {
    const posts = getAllItems("experience", lang); 
    posts.forEach((post) => {
       params.push({ lang, slug: post.slug });
    });
  }

  return params;
}
