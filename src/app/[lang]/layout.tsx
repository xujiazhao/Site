import Footer from "@/app/_components/footer";
import {
  CMS_NAME,
  HOME_OG_IMAGE_URL,
  SITE_DESCRIPTION_EN,
  SITE_DESCRIPTION_ZH,
  SITE_NAME_EN,
  SITE_NAME_ZH,
  SITE_URL,
} from "@/lib/constants";
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
  const title = isEn ? SITE_NAME_EN : SITE_NAME_ZH;
  const description = isEn ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION_ZH;
  const keywords = isEn
    ? [
        "Full-stack Designer",
        "Product Designer",
        "UX Designer",
        "UI Designer",
        "AI Product Design",
        "Product Strategy",
        "Front-end Development",
        "Jiazhao Xu",
        "Microsoft",
        "Ant International",
        "ArtCenter College of Design",
      ]
    : [
        "全栈设计师",
        "产品设计师",
        "UX 设计师",
        "UI 设计师",
        "AI 产品设计",
        "产品策略",
        "前端开发",
        "许嘉昭",
        "微软",
        "蚂蚁国际",
        "艺术中心设计学院",
      ];

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: title,
    title: {
      default: title,
      template: `%s | ${CMS_NAME}`,
    },
    description,
    keywords,
    authors: [{ name: CMS_NAME, url: SITE_URL }],
    creator: CMS_NAME,
    category: "design",
    manifest: "/favicon/site.webmanifest",
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "zh_CN",
      alternateLocale: isEn ? "zh_CN" : "en_US",
      url: `${SITE_URL}/${lang}`,
      siteName: title,
      title,
      description,
      images: HOME_OG_IMAGE_URL ? [HOME_OG_IMAGE_URL] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [HOME_OG_IMAGE_URL],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
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
