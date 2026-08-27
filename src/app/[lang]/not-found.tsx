"use client";

import { NotFoundContent } from "@/app/_components/not-found-content";
import { getLanguage } from "@/lib/i18n";
import { usePathname } from "next/navigation";

export default function LocalizedNotFound() {
  const pathname = usePathname();
  const lang = getLanguage(pathname.split("/")[1]);

  return <NotFoundContent lang={lang} hasFooter />;
}
