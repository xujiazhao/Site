import type { Language } from "@/lib/i18n";
import Link from "next/link";

export function NotFoundContent({
  lang,
  hasFooter = false,
}: {
  lang: Language;
  hasFooter?: boolean;
}) {
  const isEn = lang === "en";

  return (
    <main data-page-language={lang}>
      <div
        className={`mx-auto flex max-w-[1024px] items-center justify-center px-5 py-16 ${
          hasFooter
            ? "min-h-[calc(100vh-7rem)]"
            : "min-h-[calc(100vh-3.5rem)]"
        }`}
      >
        <section className="max-w-xl text-center" aria-labelledby="not-found-title">
          <p className="mb-4 text-7xl font-semibold tracking-tight text-neutral-200 dark:text-neutral-800 md:text-8xl">
            404
          </p>
          <h1 id="not-found-title" className="text-3xl font-semibold tracking-tight md:text-4xl">
            {isEn ? "Page not found" : "页面未找到"}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-neutral-500 dark:text-neutral-400 md:text-lg">
            {isEn
              ? "The page you requested does not exist or may have moved."
              : "你访问的页面不存在，或已被移动到其他位置。"}
          </p>
          <Link
            href={`/${lang}`}
            className="liquid-glass-control liquid-glass-control--strong mt-8 inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-medium text-neutral-900 transition-[background-color,box-shadow,transform] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-neutral-100 dark:focus-visible:ring-offset-neutral-950"
          >
            {isEn ? "Go to homepage" : "前往首页"}
          </Link>
        </section>
      </div>
    </main>
  );
}
