"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { RiMoonLine, RiSunLine } from "react-icons/ri";

type Theme = "light" | "dark";

type Props = {
  lang: string;
};

const STORAGE_KEY = "site-theme";
const SWITCHING_CLASS = "theme-switching";

type ThemeViewTransition = {
  finished: Promise<void>;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => ThemeViewTransition;
};

function applyTheme(theme: Theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", isDark ? "#0a0a0a" : "#ffffff");
}

function getSavedTheme(): Theme {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  } catch {}

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function usesWebKitRenderingEngine() {
  const userAgent = navigator.userAgent;
  return (
    /AppleWebKit/i.test(userAgent) &&
    !/(Chrome|Chromium|Edg|OPR|Android)/i.test(userAgent)
  );
}

function finishRotatingTitleAnimation() {
  document
    .querySelectorAll<HTMLElement>("[data-rotating-title-letter]")
    .forEach((letter) => {
      letter.getAnimations().forEach((animation) => {
        try {
          animation.finish();
        } catch {}
      });
    });
}

async function fadeBetweenThemes(nextTheme: Theme, commitTheme: () => void) {
  const root = document.documentElement;
  const body = document.body;
  const previousBackground = root.classList.contains("dark") ? "#0a0a0a" : "#ffffff";
  const nextBackground = nextTheme === "dark" ? "#0a0a0a" : "#ffffff";
  root.style.backgroundColor = previousBackground;

  let outgoing: Animation | undefined;
  let incoming: Animation | undefined;
  try {
    outgoing = body.animate(
      [{ opacity: 1 }, { opacity: 0.72 }],
      { duration: 100, easing: "ease-out", fill: "forwards" },
    );
    await outgoing.finished;

    commitTheme();
    root.style.backgroundColor = nextBackground;

    incoming = body.animate(
      [{ opacity: 0.72 }, { opacity: 1 }],
      { duration: 160, easing: "ease-out", fill: "forwards" },
    );
    outgoing.cancel();
    await incoming.finished;
  } finally {
    outgoing?.cancel();
    incoming?.cancel();
    root.style.removeProperty("background-color");
  }
}

export function ThemeToggle({ lang }: Props) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [animateIcons, setAnimateIcons] = useState(false);
  const isSwitchingRef = useRef(false);
  const isEn = lang === "en";

  useLayoutEffect(() => {
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);
    setTheme(savedTheme);
  }, [lang]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimateIcons(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const nextTheme: Theme = event.newValue === "dark" ? "dark" : "light";
      applyTheme(nextTheme);
      setTheme(nextTheme);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = () => {
    const currentTheme = theme ?? (document.documentElement.classList.contains("dark") ? "dark" : "light");
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";
    if (isSwitchingRef.current) return;

    const commitTheme = () => {
      applyTheme(nextTheme);
      try {
        localStorage.setItem(STORAGE_KEY, nextTheme);
      } catch {}
      flushSync(() => setTheme(nextTheme));
    };

    const root = document.documentElement;
    const finishSwitch = () => {
      root.classList.remove(SWITCHING_CLASS);
      isSwitchingRef.current = false;
    };
    const viewTransitionDocument = document as ViewTransitionDocument;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const usesWebKit = usesWebKitRenderingEngine();
    finishRotatingTitleAnimation();
    isSwitchingRef.current = true;

    // Animating the whole body forces WebKit to repaint every translucent and
    // backdrop-filtered surface on each frame. Commit the palette directly in
    // Safari/iOS instead; the toggle icon keeps its lightweight CSS motion.
    if (usesWebKit && !reduceMotion) {
      commitTheme();
      isSwitchingRef.current = false;
      return;
    }

    root.classList.add(SWITCHING_CLASS);

    if (reduceMotion) {
      commitTheme();
      requestAnimationFrame(() => requestAnimationFrame(finishSwitch));
      return;
    }

    if (viewTransitionDocument.startViewTransition) {
      const transition = viewTransitionDocument.startViewTransition(commitTheme);
      void transition.finished.finally(finishSwitch);
    } else {
      void fadeBetweenThemes(nextTheme, commitTheme).finally(finishSwitch);
    }
  };

  const isDark = theme === "dark";
  const iconTransition = animateIcons
    ? "transition-all duration-300"
    : "transition-none";
  const label = isEn
    ? `Switch to ${isDark ? "light" : "dark"} mode`
    : `切换到${isDark ? "浅色" : "深色"}模式`;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="liquid-glass-control relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl text-neutral-900 transition-[color,background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-neutral-100 dark:focus-visible:ring-offset-neutral-950"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
    >
      <RiSunLine
        aria-hidden="true"
        className={`absolute h-[18px] w-[18px] ${iconTransition} ${
          theme === null
            ? "rotate-0 scale-100 opacity-100 dark:rotate-90 dark:scale-50 dark:opacity-0"
            : isDark
              ? "rotate-90 scale-50 opacity-0"
              : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <RiMoonLine
        aria-hidden="true"
        className={`absolute h-[17px] w-[17px] ${iconTransition} ${
          theme === null
            ? "-rotate-90 scale-50 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100"
            : isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-50 opacity-0"
        }`}
      />
    </button>
  );
}
