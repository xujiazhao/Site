import { NotFoundContent } from "@/app/_components/not-found-content";
import { getLanguage } from "@/lib/i18n";
import { headers } from "next/headers";

export default async function LocalizedNotFound() {
  const requestHeaders = await headers();
  const lang = getLanguage(requestHeaders.get("x-site-language") || "");

  return <NotFoundContent lang={lang} hasFooter />;
}
