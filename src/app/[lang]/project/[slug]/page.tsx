import { ContentDetailPage } from "@/app/_components/content-detail-page";
import { getContentMetadata, getContentStaticParams } from "@/lib/content-page";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;
  return <ContentDetailPage collection="project" lang={lang} slug={slug} />;
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  return getContentMetadata("project", slug, lang);
}

export function generateStaticParams() {
  return getContentStaticParams("project");
}
