import Footer from "@/app/_components/footer";
import { CMS_NAME, SITE_URL, SITE_DESCRIPTION_EN, SITE_DESCRIPTION_ZH, HOME_OG_IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import { SiteHeader } from "@/app/_components/site-header";
import { ChatWidget } from "@/app/_components/chat-widget";
import { DocumentLanguage } from "@/app/_components/document-language";
import { LanguageTransition } from "@/app/_components/language-transition";
import { NavigationTransitionController } from "@/app/_components/page-loader";
import { getLanguage, LANGUAGES } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: requestedLanguage } = await params;
  const lang = getLanguage(requestedLanguage);
  const isEn = lang === "en";
  const title = isEn
    ? `${CMS_NAME} – Senior AI Experience Design Architect`
    : "许嘉昭 – 高级 AI 体验设计架构师";
  const description = isEn ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION_ZH;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${CMS_NAME}`,
    },
    description,
    keywords: ["Product Designer", "UX Designer", "AI Experience Design", "Jiazhao Xu", "许嘉昭", "NetEase Games", "网易互娱", "Microsoft", "Ant International", "ArtCenter"],
    authors: [{ name: CMS_NAME, url: SITE_URL }],
    creator: CMS_NAME,
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "zh_CN",
      alternateLocale: isEn ? "zh_CN" : "en_US",
      url: `${SITE_URL}/${lang}`,
      siteName: CMS_NAME,
      title,
      description,
      images: HOME_OG_IMAGE_URL ? [HOME_OG_IMAGE_URL] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        en: `${SITE_URL}/en`,
        zh: `${SITE_URL}/zh`,
      },
    },
  };
}

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang: requestedLanguage } = await params;
  const lang = getLanguage(requestedLanguage);

  return (
    <>
      <DocumentLanguage lang={lang} />
      <SiteHeader lang={lang} />
      <NavigationTransitionController />
      <LanguageTransition lang={lang}>
        <div className="min-h-screen pt-14">
          {children}
        </div>
        <Footer lang={lang} />
        <ChatWidget lang={lang} />
      </LanguageTransition>
    </>
  );
}
