import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllItems } from "@/lib/api";

export default function Creation({ params }: { params: { lang: string } }) {
  const items = getAllItems("creation", params.lang);
  const heroItem = items[0];
  const moreItems = items.slice(1);

  return (
    <main>
      <Container>
         <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8 mb-8">
          Creation
        </h1>
        {heroItem && (
          <HeroPost
            title={heroItem.title}
            coverImage={heroItem.coverImage}
            date={heroItem.date}
            slug={heroItem.slug}
            excerpt={heroItem.excerpt}
            lang={params.lang}
            section="creation"
          />
        )}
        {moreItems.length > 0 && <MoreStories posts={moreItems} lang={params.lang} section="creation" />}
      </Container>
    </main>
  );
}
