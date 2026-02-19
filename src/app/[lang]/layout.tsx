import Footer from "@/app/_components/footer";
import { CMS_NAME, SITE_URL, SITE_DESCRIPTION_EN, SITE_DESCRIPTION_ZH, HOME_OG_IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import { SiteHeader } from "@/app/_components/site-header";
import { ScrollReset } from "@/app/_components/scroll-reset";
import { ChatWidget } from "@/app/_components/chat-widget";

import "./globals.css";

const barlow = Barlow({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: "--font-barlow" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${CMS_NAME} – Product Designer`,
    template: `%s | ${CMS_NAME}`,
  },
  description: SITE_DESCRIPTION_EN,
  keywords: ["Product Designer", "UX Designer", "UI Designer", "Jiazhao Xu", "许嘉昭", "Microsoft", "Ant International", "ArtCenter"],
  authors: [{ name: CMS_NAME, url: SITE_URL }],
  creator: CMS_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "zh_CN",
    url: SITE_URL,
    siteName: CMS_NAME,
    title: `${CMS_NAME} – Product Designer`,
    description: SITE_DESCRIPTION_EN,
    images: HOME_OG_IMAGE_URL ? [HOME_OG_IMAGE_URL] : [],
  },
  twitter: {
    card: "summary_large_image",
    title: `${CMS_NAME} – Product Designer`,
    description: SITE_DESCRIPTION_EN,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en": `${SITE_URL}/en`,
      "zh": `${SITE_URL}/zh`,
    },
  },
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <html lang={params.lang}>
      <head>

        <link
          rel="icon"
          type="image/svg+xml"
          href="/favicon/favicon.svg"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body className={`${barlow.variable} ${params.lang === 'en' ? barlow.className : ''} bg-white text-neutral-900`}>
          <SiteHeader lang={params.lang} />
          <ScrollReset />
          {children}
          <Footer lang={params.lang} />
          <ChatWidget lang={params.lang} />
      </body>
    </html>
  );
}
