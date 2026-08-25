import Container from "@/app/_components/container";
import { getAllItems } from "@/lib/api";
import { SelfIntro } from "@/app/_components/self-intro";
import Link from "next/link";
import { ExperienceGrid } from "@/app/_components/experience-grid";
import { CreationSection } from "@/app/_components/creation-section";
import { WritingSection } from "@/app/_components/writing-section";
import { CoverImage } from "@/app/_components/cover-image";
import { HomeViewStateRestorer } from "@/app/_components/home-view-state-restorer";
import { PiBriefcaseBold } from "react-icons/pi";

export default async function Index({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const experiences = getAllItems("experience", lang)
    .sort((a, b) => (b.sorting || 0) - (a.sorting || 0));
  const projects = getAllItems("project", lang)
    .sort((a, b) => (b.sorting || 0) - (a.sorting || 0));
  const writings = getAllItems("writing", lang);
  const creations = getAllItems("creation", lang);

  const isEn = lang === "en";

  return (
    <main data-page-language={lang}>
      <HomeViewStateRestorer homePathname={`/${lang}`} />
      <Container>
        <SelfIntro lang={lang} />

        {/* Experience Section - Table */}
        <section className="mb-20">
          <h2 className="mb-6 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
            {isEn ? "Experience" : "经历"}
          </h2>
          <ExperienceGrid
            experiences={experiences}
            lang={lang}
            isEn={isEn}
            icon={<PiBriefcaseBold className="w-4 h-4" style={{ position: 'relative', top: '1px' }} />}
          />
        </section>

        {/* Project Section - Cards */}
        <section className="mb-32">
          <h2 className="mb-8 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
             {isEn ? "Project" : "项目"}
          </h2>
          <div className="homepage-media-breakout homepage-project-grid grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((post) => {
              const href = `/${lang}/project/${post.slug}`;
              return (
                <Link key={post.slug} href={href} className="group block">
                  {post.coverImage ? (
                    <CoverImage src={post.coverImage} alt={post.title} />
                  ) : (
                    <div className="overflow-hidden rounded-[24px] sm:rounded-[48px]">
                      <div className="aspect-video w-full bg-neutral-100 dark:bg-neutral-900" />
                    </div>
                  )}
                  <div className="homepage-media-caption mt-2">
                    <div className="flex items-center gap-1.5">
                      {post.favicon && (
                        <img
                          src={post.favicon}
                          alt=""
                          className={`h-4 w-4 flex-shrink-0 ${
                            post.favicon.includes("/appleicon.") ? "dark:invert" : ""
                          }`}
                        />
                      )}
                      <h3 className="text-base font-semibold leading-snug group-hover:underline">{post.title}</h3>
                    </div>
                    {(post.intro || post.excerpt) && (
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">{post.intro || post.excerpt}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Writing Section - List */}
        <WritingSection writings={writings} lang={lang} isEn={isEn} />

        {/* Creation Section */}
        <CreationSection creations={creations} lang={lang} isEn={isEn} />
      </Container>
    </main>
  );
}
