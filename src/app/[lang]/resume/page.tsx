import { getAllResumes } from "@resume/lib/resume-api";
import markdownToHtml from "@/lib/markdownToHtml";
import { ResumeViewer } from "@resume/components/resume-viewer";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";

  return {
    title: isEn ? "Resume" : "简历",
    description: isEn
      ? "Jiazhao Xu's resume – AI Experience Designer, Product Designer, and Product Manager"
      : "许嘉昭的简历 – AI 体验设计师、产品设计师与产品经理",
  };
}

async function getProcessedResumes(lang: string) {
  const resumes = getAllResumes(lang);
  return Promise.all(
    resumes.map(async (r) => ({
      ...r,
      htmlContent: await markdownToHtml(r.content),
    }))
  );
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const currentResumes = await getProcessedResumes(lang);

  return (
    <main className="resume-page" data-page-language={lang}>
      <ResumeViewer
        variants={currentResumes}
        lang={lang}
      />
    </main>
  );
}
