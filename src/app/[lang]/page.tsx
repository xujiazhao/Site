import Container from "@/app/_components/container";
import { getAllItems } from "@/lib/api";
import { SelfIntro } from "@/app/_components/self-intro";
import { PostPreview } from "@/app/_components/post-preview";
import Link from "next/link";
import DateFormatter from "@/app/_components/date-formatter";

export default function Index({ params }: { params: { lang: string } }) {
  const experiences = getAllItems("experience", params.lang)
    .sort((a, b) => (b.sorting || 0) - (a.sorting || 0));
  const projects = getAllItems("project", params.lang);
  const writings = getAllItems("writing", params.lang);
  const creations = getAllItems("creation", params.lang);

  const isEn = params.lang === "en";

  return (
    <main>
      <Container>
        <SelfIntro lang={params.lang} />

        {/* Experience Section - Table */}
        <section className="mb-32">
          <h2 className="mb-8 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
            {isEn ? "Experience" : "经历"}
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-lg border-separate border-spacing-y-4">
              <thead>
                <tr className="text-left text-neutral-500 font-normal border-b">
                  <th className="pb-4 pr-4 pl-2">{isEn ? "Organization" : "机构"}</th>
                  <th className="pb-4 pr-4">{isEn ? "Type" : "类型"}</th>
                  <th className="pb-4 pr-4">{isEn ? "Date Range" : "时间"}</th>
                  <th className="pb-4 pr-4">{isEn ? "Location" : "地点"}</th>
                  <th className="pb-4 pr-2">{isEn ? "Area" : "领域"}</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((exp) => (
                  <tr key={exp.slug} className="group hover:bg-neutral-50 transition-colors rounded-lg">
                    <td className="py-4 pr-4 pl-2 font-bold align-top border-b border-neutral-100 group-hover:border-transparent">
                      <Link href={`/${params.lang}/experience/${exp.slug}`} className="hover:underline flex items-center gap-2">
                        {exp.favicon && (
                          <img src={exp.favicon} alt="" className="w-5 h-5 inline-block flex-shrink-0" />
                        )}
                        {exp.title}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 align-top text-neutral-600 border-b border-neutral-100 group-hover:border-transparent">
                      {exp.type}
                    </td>
                    <td className="py-4 pr-4 align-top text-neutral-600 font-mono text-sm border-b border-neutral-100 group-hover:border-transparent whitespace-nowrap">
                      {exp.dateRange || <DateFormatter dateString={exp.date} />}
                    </td>
                    <td className="py-4 pr-4 align-top text-neutral-600 border-b border-neutral-100 group-hover:border-transparent">
                      {exp.location}
                    </td>
                    <td className="py-4 pr-2 align-top border-b border-neutral-100 group-hover:border-transparent">
                      {exp.area && exp.area.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {exp.area.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block bg-neutral-200 text-neutral-600 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Project Section - Cards */}
        <section className="mb-32">
          <h2 className="mb-8 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
             {isEn ? "Project" : "项目"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8">
            {projects.map((post) => {
              const href = `/${params.lang}/project/${post.slug}`;
              return (
                <Link key={post.slug} href={href} className="group block">
                  <div className="relative overflow-hidden rounded-lg">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-neutral-100" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        {post.favicon && (
                          <img src={post.favicon} alt="" className="w-5 h-5 flex-shrink-0" />
                        )}
                        <h3 className="text-xl font-bold leading-snug">{post.title}</h3>
                      </div>
                      {(post.intro || post.excerpt) && (
                        <p className="text-sm text-white/80 line-clamp-2">{post.intro || post.excerpt}</p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Writing Section - List */}
        <section className="mb-32">
          <h2 className="mb-8 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
             {isEn ? "Writing" : "写作"}
          </h2>
          <div className="flex flex-col">
            {writings.map((post) => (
              <div key={post.slug} className="group flex flex-col md:flex-row md:items-baseline justify-between border-b border-neutral-100 py-6 hover:bg-neutral-50 transition-colors px-2 rounded-lg">
                <div className="md:w-3/4">
                  <h3 className="text-2xl mb-2 font-medium">
                    <Link href={`/${params.lang}/writing/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-lg text-neutral-500">{post.excerpt}</p>
                </div>
                <div className="md:w-1/4 text-neutral-400 font-mono md:text-right mt-2 md:mt-0 text-sm">
                  <DateFormatter dateString={post.date} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Creation Section - Masonry */}
        <section className="mb-32">
          <h2 className="mb-8 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
             {isEn ? "Creation" : "创作"}
          </h2>
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {creations.map((post) => {
              const href = `/${params.lang}/creation/${post.slug}`;
              return (
                <Link key={post.slug} href={href} className="group block break-inside-avoid">
                  {post.firstImage && (
                    <img
                      src={post.firstImage}
                      alt={post.title}
                      className="w-full rounded-lg group-hover:opacity-90 transition-opacity duration-200"
                    />
                  )}
                  <h3 className="mt-2 text-lg font-medium group-hover:underline">{post.title}</h3>
                </Link>
              );
            })}
          </div>
        </section>
      </Container>
    </main>
  );
}
