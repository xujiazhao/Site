import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllItems } from "@/lib/api";

export default function Project({ params }: { params: { lang: string } }) {
  const items = getAllItems("project", params.lang);
  const heroItem = items[0];
  const moreItems = items.slice(1);

  return (
    <main>
      <Container>
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8 mb-8">
          Projects
        </h1>
        {heroItem && (
          <HeroPost
            title={heroItem.title}
            coverImage={heroItem.coverImage}
            date={heroItem.date}
            slug={heroItem.slug}
            excerpt={heroItem.excerpt}
            lang={params.lang}
            section="project"
          />
        )}
        {moreItems.length > 0 && <MoreStories posts={moreItems} lang={params.lang} section="project" />}
      </Container>
    </main>
  );
}
