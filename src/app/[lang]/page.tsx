import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllItems } from "@/lib/api";

export default function Index({ params }: { params: { lang: string } }) {
  const allPosts = getAllItems("writing", params.lang);

  const heroPost = allPosts[0];

  const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <Intro />
        {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.coverImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
            lang={params.lang}
            section="writing"
          />
        )}
        {morePosts.length > 0 && <MoreStories posts={morePosts} lang={params.lang} section="writing" />}
      </Container>
    </main>
  );
}
