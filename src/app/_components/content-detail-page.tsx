import Container from "@/app/_components/container";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import type { ContentCollection } from "@/lib/api";
import { getItemBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { notFound } from "next/navigation";

type Props = {
  collection: ContentCollection;
  lang: string;
  slug: string;
};

export async function ContentDetailPage({ collection, lang, slug }: Props) {
  const post = getItemBySlug(collection, slug, lang);
  if (!post) notFound();

  const content = await markdownToHtml(post.content);
  const isExperience = collection === "experience";
  const isWriting = collection === "writing";
  const isCreation = collection === "creation";

  return (
    <main>
      <Container>
        <article className="mb-12">
          <PostHeader
            title={post.title}
            date={post.date}
            favicon={post.favicon}
            skill={isCreation ? post.skill : undefined}
            type={isExperience ? post.type : isWriting ? post.type : undefined}
            typeBadge={!isExperience}
            area={isExperience ? post.area : undefined}
            dateRange={isExperience ? post.dateRange : undefined}
            location={isExperience ? post.location : undefined}
            showDate={isWriting}
            lang={lang}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}
