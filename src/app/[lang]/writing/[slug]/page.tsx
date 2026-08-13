import { ContentDetailPage } from "@/app/_components/content-detail-page";
import { getContentMetadata, getContentStaticParams } from "@/lib/content-page";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export default async function WritingPage({ params }: Props) {
  const { lang, slug } = await params;
  return <ContentDetailPage collection="writing" lang={lang} slug={slug} />;
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  return getContentMetadata("writing", slug, lang);
}

export function generateStaticParams() {
  return getContentStaticParams("writing");
}
