"use client";

import { DocumentLanguage } from "@/app/_components/document-language";
import { NotFoundContent } from "@/app/_components/not-found-content";
import { SiteHeader } from "@/app/_components/site-header";
import { getLanguage } from "@/lib/i18n";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const lang = getLanguage(pathname.split("/")[1]);

  return (
    <>
      <DocumentLanguage lang={lang} />
      <SiteHeader lang={lang} />
      <div className="min-h-screen pt-14">
        <NotFoundContent lang={lang} />
      </div>
    </>
  );
}
