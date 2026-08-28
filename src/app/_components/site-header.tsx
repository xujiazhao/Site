"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import {
  cancelLanguageTransition,
  fadeOutLanguageContent,
} from "./language-transition";
import {
  canReturnToHomeHistory,
  syncHomeReturnHistoryState,
} from "./home-return-history";
import { navigateWithPageLoader } from "./navigation-transition";
import { ThemeToggle } from "./theme-toggle";
import { PersonalGlobeButton } from "./personal-globe-button";

type Props = {
  lang: string;
};

type HeaderMode = "default" | "atlas";

const ATLAS_LANGUAGE_SWITCH_ATTRIBUTE = "data-atlas-language-switching";

export function SiteHeader({ lang }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const isEn = lang === "en";
  const targetLang = isEn ? "zh" : "en";
  const homePath = `/${lang}`;
  const atlasPath = `/${lang}/atlas`;
  const isAtlas = pathname === atlasPath || pathname === `${atlasPath}/`;
  const [headerMode, setHeaderMode] = useState<HeaderMode>(
    isAtlas ? "atlas" : "default",
  );
  const [headerModeVisible, setHeaderModeVisible] = useState(true);
  const displayAtlas = headerMode === "atlas";

  // Build the target path for language toggle
  const targetPath = pathname.replace(
    /^\/(?:en|zh)(?=\/|$)/,
    `/${targetLang}`,
  ) || `/${targetLang}`;

  const languageSwitchingRef = useRef(false);
  const pendingLanguageRef = useRef<string | null>(null);
  const fallbackTimerRef = useRef<number | undefined>(undefined);
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
  const displayedLanguage = pendingLanguage ?? lang;

  useEffect(() => {
    router.prefetch(targetPath);
  }, [router, targetPath]);

  useEffect(() => {
    const nextMode: HeaderMode = isAtlas ? "atlas" : "default";
    if (nextMode === headerMode) return;

    setHeaderModeVisible(false);
    const swapTimer = window.setTimeout(() => {
      setHeaderMode(nextMode);
      requestAnimationFrame(() => setHeaderModeVisible(true));
    }, 140);

    return () => window.clearTimeout(swapTimer);
  }, [headerMode, isAtlas]);

  useEffect(() => {
    if (pendingLanguageRef.current !== lang) return;

    if (fallbackTimerRef.current !== undefined) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = undefined;
    }
    pendingLanguageRef.current = null;
    languageSwitchingRef.current = false;
    setPendingLanguage(null);
  }, [lang]);

  useEffect(() => () => {
    if (fallbackTimerRef.current !== undefined) {
      window.clearTimeout(fallbackTimerRef.current);
    }
  }, []);

  useEffect(() => {
    syncHomeReturnHistoryState(pathname);
  }, [pathname]);

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
    pendingLanguageRef.current = targetLang;
    setPendingLanguage(targetLang);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Fading the entire Atlas layer forces its WebGL canvas, animated backdrop,
    // and every glass surface into one large offscreen composition. Keep the
    // lightweight header animation, but switch the route directly.
    if (!reduceMotion && !isAtlas) await fadeOutLanguageContent(targetLang);
    if (isAtlas) {
      document.documentElement.setAttribute(ATLAS_LANGUAGE_SWITCH_ATTRIBUTE, "");
    }
    router.replace(targetPath, { scroll: false });

    if (fallbackTimerRef.current !== undefined) {
      window.clearTimeout(fallbackTimerRef.current);
    }
    fallbackTimerRef.current = window.setTimeout(() => {
      const routeLanguage = window.location.pathname.split("/")[1];
      const navigationCommitted =
        routeLanguage === targetLang ||
        document.documentElement.lang === targetLang;
      if (navigationCommitted) return;

      cancelLanguageTransition();
      document.documentElement.removeAttribute(ATLAS_LANGUAGE_SWITCH_ATTRIBUTE);
      pendingLanguageRef.current = null;
      languageSwitchingRef.current = false;
      setPendingLanguage(null);
      fallbackTimerRef.current = undefined;
    }, 8000);
  };

  const languageSwitchControl = (
    <div className="flex items-center">
      <Link
        href={targetPath}
        onClick={handleLanguageSwitch}
        className="language-switch-control liquid-glass-control relative flex h-9 w-[72px] cursor-pointer select-none items-center rounded-xl p-[3px]"
        role="switch"
        aria-checked={displayedLanguage === "en"}
        aria-label={isEn ? "切换到中文" : "Switch to English"}
      >
        <span
          className="absolute left-[3px] h-[28px] w-[32px] rounded-[8px] bg-neutral-200 dark:bg-neutral-600"
          style={{
            top: "calc(50% - 14px)",
            transition: "transform 200ms ease-in-out",
            transform: displayedLanguage === "en" ? "translateX(0)" : "translateX(32px)",
          }}
        />
        <span
          className={`relative z-10 flex-1 text-center text-sm font-medium ${
            displayedLanguage === "en"
              ? "text-neutral-900 dark:text-white"
              : "text-neutral-400 dark:text-neutral-500"
          }`}
          style={{ transition: "color 200ms ease-in-out" }}
        >
          EN
        </span>
        <span
          className={`relative z-10 flex-1 text-center text-sm font-medium ${
            displayedLanguage !== "en"
              ? "text-neutral-900 dark:text-white"
              : "text-neutral-400 dark:text-neutral-500"
          }`}
          style={{ transition: "color 200ms ease-in-out" }}
        >
          中
        </span>
      </Link>
    </div>
  );

  return (
    <header className="liquid-glass-header fixed top-0 left-0 right-0 z-50 h-14 border-b">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-5">
        <Link
          href={homePath}
          data-navigation-controlled="true"
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
            if (pathname === homePath || pathname === `${homePath}/`) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              return;
            }

            const returnThroughHistory = canReturnToHomeHistory(
              pathname,
              homePath,
            );
            navigateWithPageLoader({
              targetPathname: homePath,
              navigate: () => {
                if (returnThroughHistory) {
                  window.history.back();
                } else {
                  router.push(homePath);
                }
              },
            });
          }}
          className="flex cursor-pointer items-center gap-2 text-base font-medium tracking-tight hover:opacity-70"
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
          <span
            className={`transition-[opacity,transform] duration-[140ms] ease-out ${
              headerModeVisible ? "translate-y-0 opacity-100" : "-translate-y-0.5 opacity-0"
            }`}
          >
            {displayAtlas ? "My Atlas" : "许嘉昭 Jiazhao Xu"}
          </span>
        </Link>
        <div
          className={`flex items-center gap-2 transition-[opacity,transform] duration-[140ms] ease-out ${
            headerModeVisible ? "translate-y-0 opacity-100" : "translate-y-0.5 opacity-0"
          }`}
        >
          {displayAtlas ? (
            <>
              {languageSwitchControl}
              <Link
                href={homePath}
                scroll={false}
                className="personal-globe-close liquid-glass-control"
                aria-label={isEn ? "Close My Atlas" : "关闭 My Atlas"}
                title={isEn ? "Close" : "关闭"}
              >
                <RiCloseLine aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <PersonalGlobeButton lang={lang} />
              {languageSwitchControl}
              <ThemeToggle lang={lang} />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
