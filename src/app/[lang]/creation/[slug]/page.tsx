import { ContentDetailPage } from "@/app/_components/content-detail-page";
import { getContentMetadata, getContentStaticParams } from "@/lib/content-page";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export default async function CreationPage({ params }: Props) {
  const { lang, slug } = await params;
  return <ContentDetailPage collection="creation" lang={lang} slug={slug} />;
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  return getContentMetadata("creation", slug, lang);
}

export function generateStaticParams() {
  return getContentStaticParams("creation");
}
