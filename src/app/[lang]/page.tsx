import Container from "@/app/_components/container";
import { getAllItems } from "@/lib/api";
import { SelfIntro } from "@/app/_components/self-intro";
import Link from "next/link";
import DateFormatter from "@/app/_components/date-formatter";
import { ClickableRow } from "@/app/_components/clickable-row";
import { CreationSection } from "@/app/_components/creation-section";
import { WritingSection } from "@/app/_components/writing-section";
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
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-base border-separate border-spacing-y-0 whitespace-nowrap">
              <thead>
                <tr className="text-left text-neutral-500 border-b">
                  <th className="pb-2 pr-1 sticky left-0 z-10 bg-white font-semibold md:hidden w-6 align-middle">
                    <PiBriefcaseBold className="w-4 h-4 inline-block align-middle" style={{ position: 'relative', top: '-1px' }} />
                  </th>
                  <th className="pb-2 pr-5 font-semibold md:sticky md:left-0 md:z-10 md:bg-white align-middle">
                    <span className="hidden md:flex items-center gap-1.5">
                      <PiBriefcaseBold className="w-4 h-4" />
                      {isEn ? "Name" : "名称"}
                    </span>
                    <span className="md:hidden">{isEn ? "Name" : "名称"}</span>
                  </th>
                  <th className="pb-2 pr-5 font-semibold">{isEn ? "Time Range" : "时间"}</th>
                  <th className="pb-2 pr-5 font-semibold">{isEn ? "Location" : "地点"}</th>
                  <th className="pb-2 pr-5 font-semibold">{isEn ? "Type" : "类型"}</th>
                  <th className="pb-2 pr-2 font-semibold">{isEn ? "Area" : "领域"}</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((exp) => (
                  <ClickableRow key={exp.slug} href={`/${params.lang}/experience/${exp.slug}`} className="group hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors duration-300">
                    <td className="py-2 pr-1 align-middle border-b border-neutral-100 group-hover:border-transparent sticky left-0 bg-white group-hover:!bg-neutral-100 z-10 transition-colors duration-300 md:hidden w-6">
                      {exp.favicon && (
                        <img src={exp.favicon} alt="" className="w-4 h-4 flex-shrink-0" />
                      )}
                    </td>
                    <td className="py-2 pr-5 font-semibold align-middle border-b border-neutral-100 group-hover:border-transparent md:sticky md:left-0 md:bg-white md:group-hover:!bg-neutral-100 md:z-10 transition-colors duration-300">
                      <span className="hidden md:flex items-center gap-1.5">
                        {exp.favicon && (
                          <img src={exp.favicon} alt="" className="w-4 h-4 flex-shrink-0" />
                        )}
                        {exp.title}
                      </span>
                      <span className="md:hidden">{exp.title}</span>
                    </td>
                    <td className="py-2 pr-5 align-top text-neutral-600 border-b border-neutral-100 group-hover:border-transparent">
                      {exp.dateRange || exp.date}
                    </td>
                    <td className="py-2 pr-5 align-top text-neutral-600 border-b border-neutral-100 group-hover:border-transparent">
                      {exp.location}
                    </td>
                    <td className="py-2 pr-5 align-top text-neutral-600 border-b border-neutral-100 group-hover:border-transparent">
                      {exp.type}
                    </td>
                    <td className="py-2 pr-2 align-top border-b border-neutral-100 group-hover:border-transparent">
                      {exp.area && exp.area.length > 0 && (
                        <div className="flex gap-1">
                          {exp.area.map((tag) => {
                            const isHighlighted = tag.startsWith("*");
                            const label = isHighlighted ? tag.slice(1) : tag;
                            return (
                              <span
                                key={tag}
                                className={`inline-block text-sm font-medium px-2 py-0.5 rounded-lg ${
                                  isHighlighted
                                    ? "bg-neutral-800 text-white"
                                    : "bg-neutral-200 text-neutral-600"
                                }`}
                              >
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  </ClickableRow>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((post) => {
              const href = `/${params.lang}/project/${post.slug}`;
              return (
                <Link key={post.slug} href={href} className="group block">
                  <div className="overflow-hidden rounded-lg">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full aspect-[2/1] md:aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full aspect-[2/1] md:aspect-[3/2] bg-neutral-100" />
                    )}
                  </div>
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
