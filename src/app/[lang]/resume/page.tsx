import { getAllResumes } from "@resume/lib/resume-api";
import markdownToHtml from "@/lib/markdownToHtml";
import { ResumeViewer } from "@resume/components/resume-viewer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: "Jiazhao Xu's Resume – Product Designer & Product Manager",
};

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
  params: { lang: string };
}) {
  const [enResumes, zhResumes] = await Promise.all([
    getProcessedResumes("en"),
    getProcessedResumes("zh"),
  ]);

  const currentResumes = params.lang === "en" ? enResumes : zhResumes;

  return (
    <main className="resume-page">
      <ResumeViewer
        variants={currentResumes}
        lang={params.lang}
        allVariants={{ en: enResumes, zh: zhResumes }}
      />
    </main>
  );
}
