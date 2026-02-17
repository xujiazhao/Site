import Container from "@/app/_components/container";
import { getAllItems } from "@/lib/api";
import { SelfIntro } from "@/app/_components/self-intro";
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
        <section className="mb-20">
          <h2 className="mb-6 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
            {isEn ? "Experience" : "经历"}
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-base border-separate border-spacing-y-0">
              <thead>
                <tr className="text-left text-neutral-500 font-normal border-b">
                  <th className="pb-2 pr-3 pl-2">{isEn ? "Name" : "名称"}</th>
                  <th className="pb-2 pr-3">{isEn ? "Date Range" : "时间"}</th>
                  <th className="pb-2 pr-3">{isEn ? "Location" : "地点"}</th>
                  <th className="pb-2 pr-3">{isEn ? "Type" : "类型"}</th>
                  <th className="pb-2 pr-2">{isEn ? "Area" : "领域"}</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((exp) => (
                  <tr key={exp.slug} className="group hover:bg-neutral-50 transition-colors rounded-lg">
                    <td className="py-2 pr-3 pl-2 font-semibold align-top border-b border-neutral-100 group-hover:border-transparent">
                      <Link href={`/${params.lang}/experience/${exp.slug}`} className="hover:underline flex items-center gap-1.5">
                        {exp.favicon && (
                          <img src={exp.favicon} alt="" className="w-4 h-4 inline-block flex-shrink-0" />
                        )}
                        {exp.title}
                      </Link>
                    </td>
                    <td className="py-2 pr-3 align-top text-neutral-600 border-b border-neutral-100 group-hover:border-transparent whitespace-nowrap">
                      {exp.dateRange || exp.date}
                    </td>
                    <td className="py-2 pr-3 align-top text-neutral-600 border-b border-neutral-100 group-hover:border-transparent">
                      {exp.location}
                    </td>
                    <td className="py-2 pr-3 align-top text-neutral-600 border-b border-neutral-100 group-hover:border-transparent">
                      {exp.type}
                    </td>
                    <td className="py-2 pr-2 align-top border-b border-neutral-100 group-hover:border-transparent">
                      {exp.area && exp.area.length > 0 && (
                        <div className="flex flex-wrap gap-1">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.map((post) => {
              const href = `/${params.lang}/project/${post.slug}`;
              return (
                <Link key={post.slug} href={href} className="group block">
                  <div className="overflow-hidden rounded-lg">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full aspect-[3/2] bg-neutral-100" />
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
        <section className="mb-20">
          <h2 className="mb-6 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
             {isEn ? "Writing" : "写作"}
          </h2>
          <div className="flex flex-col">
            {writings.map((post) => (
              <div key={post.slug} className="group flex flex-col md:flex-row md:items-baseline justify-between border-b border-neutral-100 py-2 hover:bg-neutral-50 transition-colors px-2 rounded-lg">
                <div className="md:w-3/4">
                  <h3 className="text-base font-semibold">
                    <Link href={`/${params.lang}/writing/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                </div>
                <div className="md:w-1/4 flex items-baseline gap-2 md:justify-end mt-1 md:mt-0">
                  {post.type && (
                    <span className="inline-block text-sm font-medium px-2 py-0.5 rounded-lg bg-neutral-200 text-neutral-600">{post.type}</span>
                  )}
                  <span className="text-neutral-600 text-base whitespace-nowrap">
                    <DateFormatter dateString={post.date} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Creation Section */}
        <section className="mb-32">
          <h2 className="mb-8 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
             {isEn ? "Creation" : "创作"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {creations.map((post) => {
              const href = `/${params.lang}/creation/${post.slug}`;
              return (
                <Link key={post.slug} href={href} className="group block">
                  {(post.coverImage || post.firstImage) && (
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={post.coverImage || post.firstImage}
                        alt={post.title}
                        className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h3 className="mt-2 text-base font-semibold group-hover:underline">{post.title}</h3>
                </Link>
              );
            })}
          </div>
        </section>
      </Container>
    </main>
  );
}
