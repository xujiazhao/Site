"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PiSunBold, PiMoonBold } from "react-icons/pi";

type Props = {
  lang: string;
};

export function SiteHeader({ lang }: Props) {
  const pathname = usePathname();
  const isEn = lang === "en";
  const targetLang = isEn ? "zh" : "en";
  const langLabel = isEn ? "中文" : "EN";

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // Build the target path for language toggle
  const targetPath = pathname.replace(`/${lang}`, `/${targetLang}`) || `/${targetLang}`;

  // Hide language toggle on detail pages (e.g. /en/experience/slug)
  const segments = pathname.split('/').filter(Boolean);
  const isDetailPage = segments.length > 2;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-700/50">
      <div className="container mx-auto px-5 h-14 flex items-center justify-between">
        <Link href={`/${lang}`} className="text-base font-medium tracking-tight hover:opacity-70 transition-opacity">
          许嘉昭 Jiazhao Xu
        </Link>
        <div className="flex items-center gap-3">
          {!isDetailPage && (
            <Link
              href={targetPath}
              className="text-sm px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {langLabel}
            </Link>
          )}
          <button
            onClick={toggleDark}
            className="text-sm px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <PiSunBold /> : <PiMoonBold />}
          </button>
        </div>
      </div>
    </header>
  );
}
