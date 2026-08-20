"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  cancelLanguageTransition,
  fadeOutLanguageContent,
} from "./language-transition";
import { navigateWithPageLoader } from "./navigation-transition";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  lang: string;
};

export function SiteHeader({ lang }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const isEn = lang === "en";
  const targetLang = isEn ? "zh" : "en";

  // Build the target path for language toggle
  const targetPath = pathname.replace(`/${lang}`, `/${targetLang}`) || `/${targetLang}`;

  const languageSwitchingRef = useRef(false);
  const [sliderLanguage, setSliderLanguage] = useState(lang);

  useEffect(() => {
    router.prefetch(targetPath);
  }, [router, targetPath]);

  useEffect(() => {
    languageSwitchingRef.current = false;
    setSliderLanguage(lang);
  }, [lang]);

  const handleLanguageSwitch = async (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    if (languageSwitchingRef.current) return;
    languageSwitchingRef.current = true;
    setSliderLanguage(targetLang);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) await fadeOutLanguageContent(targetLang);
    router.replace(targetPath, { scroll: false });

    window.setTimeout(() => {
      const targetContent = document.querySelector(
        `[data-page-language="${targetLang}"]`,
      );
      if (
        document.documentElement.lang !== targetLang ||
        !targetContent
      ) {
        cancelLanguageTransition();
        languageSwitchingRef.current = false;
        setSliderLanguage(lang);
      }
    }, 2500);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex h-full max-w-[1024px] items-center justify-between px-5">
        <Link
          href={`/${lang}`}
          onClick={(event) => {
            if (
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            ) {
              return;
            }

            event.preventDefault();
            if (pathname === `/${lang}` || pathname === `/${lang}/`) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              return;
            }

            navigateWithPageLoader({
              targetPathname: `/${lang}`,
              navigate: () => router.push(`/${lang}`),
            });
          }}
          className="flex items-center gap-2 text-base font-medium tracking-tight hover:opacity-70 font-barlow cursor-pointer"
          aria-label={isEn ? "Go to homepage" : "返回首页"}
          style={{
            transition: "opacity 300ms cubic-bezier(0.4,0,0.2,1), color 300ms cubic-bezier(0.4,0,0.2,1)",
            opacity: 1, // Always visible
          }}
        >
          <img
            src="/favicon/favicon.svg"
            alt=""
            className="h-5 w-5 transition-[filter] duration-300 ease-out dark:invert"
          />
          许嘉昭 Jiazhao Xu
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Link
              href={targetPath}
              onClick={handleLanguageSwitch}
              className="relative flex h-9 w-[88px] cursor-pointer select-none items-center rounded-xl border border-neutral-200 bg-neutral-100 p-[3px] font-barlow dark:border-neutral-700 dark:bg-neutral-900"
              role="switch"
              aria-checked={isEn}
              aria-label={isEn ? "切换到中文" : "Switch to English"}
            >
              <span
                className="absolute left-[3px] h-[28px] w-[40px] rounded-[8px] bg-white shadow-sm dark:bg-neutral-700"
                style={{ top: 'calc(50% - 14px)', transition: 'transform 200ms ease-in-out', transform: sliderLanguage === 'en' ? 'translateX(0)' : 'translateX(40px)' }}
              />
              <span className={`relative z-10 flex-1 text-center text-sm font-medium ${sliderLanguage === 'en' ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-500"}`} style={{ transition: 'color 200ms ease-in-out' }}>
                EN
              </span>
              <span className={`relative z-10 flex-1 text-center text-sm font-medium ${sliderLanguage !== 'en' ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-500"}`} style={{ transition: 'color 200ms ease-in-out' }}>
                中
              </span>
            </Link>
          </div>
          <ThemeToggle lang={lang} />
        </div>
      </div>
    </header>
  );
}
