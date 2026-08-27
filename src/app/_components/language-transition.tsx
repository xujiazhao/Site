"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";

const LAYER_SELECTOR = "[data-language-transition-layer]";
const FLOATING_SELECTOR = "[data-language-transition-floating]";
const TARGET_ATTRIBUTE = "data-language-transition-target";
const PAGE_LANGUAGE_ATTRIBUTE = "data-page-language";
const ACTIVE_LANGUAGE_ATTRIBUTE = "data-language-transition-language";
const RUNNING_ATTRIBUTE = "data-language-transition-running";
const OPACITY_PROPERTY = "--language-transition-opacity";
const ENTER_DURATION = 300;
let activeOpacityAnimation:
  | {
      frame: number;
      finish: (completed: boolean) => void;
    }
  | undefined;

function getTransitionTargets() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      `${LAYER_SELECTOR}, ${FLOATING_SELECTOR}`,
    ),
  );
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function cancelActiveOpacityAnimation() {
  if (!activeOpacityAnimation) return;

  window.cancelAnimationFrame(activeOpacityAnimation.frame);
  activeOpacityAnimation.finish(false);
  activeOpacityAnimation = undefined;
  document.documentElement.removeAttribute(RUNNING_ATTRIBUTE);
}

function animateLanguageOpacity({
  from,
  to,
  duration,
  easeOut = false,
}: {
  from: number;
  to: number;
  duration: number;
  easeOut?: boolean;
}) {
  const root = document.documentElement;
  cancelActiveOpacityAnimation();
  root.setAttribute(RUNNING_ATTRIBUTE, "");
  root.style.setProperty(OPACITY_PROPERTY, String(from));

  return new Promise<boolean>((resolve) => {
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const easedProgress = easeOut
        ? 1 - Math.pow(1 - progress, 3)
        : progress;
      const opacity = from + (to - from) * easedProgress;
      root.style.setProperty(OPACITY_PROPERTY, String(opacity));

      if (progress >= 1) {
        activeOpacityAnimation = undefined;
        root.removeAttribute(RUNNING_ATTRIBUTE);
        resolve(true);
        return;
      }

      const frame = window.requestAnimationFrame(tick);
      if (activeOpacityAnimation) activeOpacityAnimation.frame = frame;
    };

    const frame = window.requestAnimationFrame(tick);
    activeOpacityAnimation = { frame, finish: resolve };
  });
}

async function fadeInCommittedLanguage(language: string) {
  const root = document.documentElement;
  const targets = getTransitionTargets().filter(
    (target) => target.dataset.language === language,
  );

  // The animation state lives on the document rather than individual React
  // nodes. If a streamed route commit replaces a target during the fade, its
  // replacement inherits the exact same opacity on the next style pass.
  cancelActiveOpacityAnimation();
  root.setAttribute(ACTIVE_LANGUAGE_ATTRIBUTE, language);
  root.style.setProperty(OPACITY_PROPERTY, "0");
  targets.forEach((target) => {
    target.getAnimations().forEach((animation) => animation.cancel());
    target.removeAttribute("data-language-transition-managed");
    target.style.removeProperty("opacity");
  });
  root.removeAttribute(TARGET_ATTRIBUTE);

  const completed = await animateLanguageOpacity({
    from: 0,
    to: 1,
    duration: ENTER_DURATION,
    easeOut: true,
  });

  if (
    completed &&
    root.getAttribute(ACTIVE_LANGUAGE_ATTRIBUTE) === language &&
    !root.hasAttribute(TARGET_ATTRIBUTE)
  ) {
    root.removeAttribute(ACTIVE_LANGUAGE_ATTRIBUTE);
    root.style.removeProperty(OPACITY_PROPERTY);
  }
}

export async function fadeOutLanguageContent(targetLanguage: string) {
  if (prefersReducedMotion()) return false;

  const targets = getTransitionTargets();
  if (targets.length === 0) return false;

  // This attribute keeps the incoming language invisible until its actual
  // page content has committed. The outgoing language is not affected.
  const root = document.documentElement;
  const currentLanguage = root.lang;
  const storedOpacity = Number.parseFloat(
    root.style.getPropertyValue(OPACITY_PROPERTY),
  );
  const layerOpacity = Number.parseFloat(getComputedStyle(targets[0]).opacity);
  const currentOpacity =
    root.getAttribute(ACTIVE_LANGUAGE_ATTRIBUTE) === currentLanguage &&
    Number.isFinite(storedOpacity)
      ? storedOpacity
      : Number.isFinite(layerOpacity)
        ? layerOpacity
        : 1;

  root.setAttribute(TARGET_ATTRIBUTE, targetLanguage);
  root.setAttribute(ACTIVE_LANGUAGE_ATTRIBUTE, currentLanguage);
  root.style.setProperty(OPACITY_PROPERTY, String(currentOpacity));
  targets.forEach((target) => {
    target.getAnimations().forEach((animation) => animation.cancel());
    target.removeAttribute("data-language-transition-managed");
    target.style.removeProperty("opacity");
  });

  return animateLanguageOpacity({
    from: currentOpacity,
    to: 0,
    duration: 200,
  });
}

export function cancelLanguageTransition() {
  const root = document.documentElement;
  cancelActiveOpacityAnimation();
  root.removeAttribute(TARGET_ATTRIBUTE);
  root.removeAttribute(RUNNING_ATTRIBUTE);
  root.removeAttribute(ACTIVE_LANGUAGE_ATTRIBUTE);
  root.style.removeProperty(OPACITY_PROPERTY);
  getTransitionTargets().forEach((target) => {
    target.getAnimations().forEach((animation) => animation.cancel());
    target.removeAttribute("data-language-transition-managed");
    target.style.removeProperty("opacity");
  });
}

export function LanguageTransition({
  children,
  lang,
}: {
  children: ReactNode;
  lang: string;
}) {
  const pathname = usePathname();
  const layerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute(TARGET_ATTRIBUTE) !== lang) return;

    let firstFrame = 0;
    let secondFrame = 0;
    let hasScheduledReveal = false;

    const targetPathIsCommitted =
      pathname === `/${lang}` || pathname.startsWith(`/${lang}/`);

    const revealWhenReady = () => {
      if (hasScheduledReveal) return;

      const targetContent = layerRef.current?.querySelector<HTMLElement>(
        `[${PAGE_LANGUAGE_ATTRIBUTE}="${lang}"]`,
      );
      if (
        !targetPathIsCommitted ||
        document.documentElement.lang !== lang ||
        !targetContent
      ) {
        return;
      }

      hasScheduledReveal = true;
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          if (root.getAttribute(TARGET_ATTRIBUTE) === lang) {
            void fadeInCommittedLanguage(lang);
          }
        });
      });
    };

    const observer = new MutationObserver(revealWhenReady);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["lang", PAGE_LANGUAGE_ATTRIBUTE],
      childList: true,
      subtree: true,
    });
    revealWhenReady();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [lang, pathname]);

  return (
    <div
      key={lang}
      ref={layerRef}
      data-language-transition-layer
      data-language={lang}
      className="animate-language-content-in"
    >
      {children}
    </div>
  );
}
