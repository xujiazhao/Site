import Container from "@/app/_components/container";
import { getAllItems } from "@/lib/api";
import { SelfIntro } from "@/app/_components/self-intro";
import Link from "next/link";
import DateFormatter from "@/app/_components/date-formatter";
import { ExperienceGrid } from "@/app/_components/experience-grid";
import { CreationSection } from "@/app/_components/creation-section";
import { WritingSection } from "@/app/_components/writing-section";
import { CoverImage } from "@/app/_components/cover-image";
import { PiBriefcaseBold } from "react-icons/pi";

export default function Index({ params }: { params: { lang: string } }) {
  const experiences = getAllItems("experience", params.lang)
    .sort((a, b) => (b.sorting || 0) - (a.sorting || 0));
  const projects = getAllItems("project", params.lang)
    .sort((a, b) => (b.sorting || 0) - (a.sorting || 0));
  const writings = getAllItems("writing", params.lang);
  const creations = getAllItems("creation", params.lang);

  const isEn = params.lang === "en";

  return (
    <main>
      <Container>
        <SelfIntro lang={params.lang} />

        {/* Experience Section - Table */}
        <section className="mb-20">
          <h2 className="mb-6 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
            {isEn ? "Experience" : "经历"}
          </h2>
          <ExperienceGrid
            experiences={experiences}
            lang={params.lang}
            isEn={isEn}
            icon={<PiBriefcaseBold className="w-4 h-4" style={{ position: 'relative', top: '1px' }} />}
          />
        </section>

        {/* Project Section - Cards */}
        <section className="mb-32">
          <h2 className="mb-8 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
             {isEn ? "Project" : "项目"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((post) => {
              const href = `/${params.lang}/project/${post.slug}`;
              return (
                <Link key={post.slug} href={href} className="group block">
                  {post.coverImage ? (
                    <CoverImage src={post.coverImage} alt={post.title} />
                  ) : (
                    <div className="overflow-hidden rounded-lg">
                      <div className="w-full aspect-[2/1] md:aspect-[3/2] bg-neutral-100" />
                    </div>
                  )}
                  <div className="mt-2">
                    <div className="flex items-center gap-1.5">
                      {post.favicon && (
                        <img src={post.favicon} alt="" className="w-4 h-4 flex-shrink-0" />
                      )}
                      <h3 className="text-base font-semibold leading-snug group-hover:underline">{post.title}</h3>
                    </div>
                    {(post.intro || post.excerpt) && (
                      <p className="text-sm text-neutral-500 line-clamp-2 mt-1">{post.intro || post.excerpt}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Writing Section - List */}
        <WritingSection writings={writings} lang={params.lang} isEn={isEn} />

        {/* Creation Section */}
        <CreationSection creations={creations} lang={params.lang} isEn={isEn} />
      </Container>
    </main>
  );
}
