"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  NAVIGATION_EVENT,
  type NavigationRequest,
} from "./navigation-transition";

type LoaderPhase = "entering" | "visible" | "exiting";

type PageLoaderProps = {
  overlay?: boolean;
  phase?: LoaderPhase;
};

const MIN_VISIBLE_DURATION = 180;
const EXIT_DURATION = 280;
const PAGE_EXIT_DURATION = 180;
const ROUTE_TIMEOUT = 6000;
const HYDRATED_ATTRIBUTE = "data-site-hydrated";
const TRANSITIONING_CLASS = "page-route-transitioning";

export function PageLoader({
  overlay = false,
  phase = "visible",
}: PageLoaderProps) {
  return (
    <div
      className={overlay ? "page-loader-overlay" : "page-loader-route"}
      data-page-loader-phase={overlay ? phase : undefined}
      role="status"
      aria-label="Loading"
    >
      <span className="page-loader-spinner" aria-hidden="true" />
    </div>
  );
}

export function InitialPageLoader() {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<LoaderPhase | null>(() => {
    if (typeof document === "undefined") return "visible";
    return document.documentElement.hasAttribute(HYDRATED_ATTRIBUTE)
      ? null
      : "visible";
  });
  const previousPathnameRef = useRef(pathname);
  const hasInitialLoaderRef = useRef(phase !== null);
  const targetPathnameRef = useRef<string | null>(null);
  const shownAtRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const exitTimerRef = useRef<number | undefined>(undefined);
  const removeTimerRef = useRef<number | undefined>(undefined);
  const fallbackTimerRef = useRef<number | undefined>(undefined);
  const isTransitioningRef = useRef(false);
  const isMountedRef = useRef(false);
  const outgoingAnimationRef = useRef<Animation | null>(null);

  const clearTransitionTimers = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }
    if (exitTimerRef.current !== undefined) {
      window.clearTimeout(exitTimerRef.current);
    }
    if (removeTimerRef.current !== undefined) {
      window.clearTimeout(removeTimerRef.current);
    }
    if (fallbackTimerRef.current !== undefined) {
      window.clearTimeout(fallbackTimerRef.current);
    }

    animationFrameRef.current = undefined;
    exitTimerRef.current = undefined;
    removeTimerRef.current = undefined;
    fallbackTimerRef.current = undefined;
  }, []);

  const restorePageContent = useCallback(() => {
    outgoingAnimationRef.current?.cancel();
    outgoingAnimationRef.current = null;
  }, []);

  const fadeOutCurrentPage = useCallback(async () => {
    restorePageContent();
    const layer = document.querySelector<HTMLElement>(
      "[data-language-transition-layer]",
    );
    if (!layer) return;

    const animation = layer.animate(
      [
        { opacity: getComputedStyle(layer).opacity },
        { opacity: 0 },
      ],
      {
        duration: PAGE_EXIT_DURATION,
        easing: "cubic-bezier(0.4, 0, 1, 1)",
        fill: "forwards",
      },
    );
    outgoingAnimationRef.current = animation;

    try {
      await animation.finished;
    } catch {
      // A canceled animation means another navigation took ownership.
    }
  }, [restorePageContent]);

  const hideLoader = useCallback(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const elapsed = performance.now() - shownAtRef.current;
    const delay = reduceMotion
      ? 0
      : Math.max(0, MIN_VISIBLE_DURATION - elapsed);

    // The loader is still fully opaque here, so the new page can safely be
    // restored before the overlay starts revealing it.
    restorePageContent();

    if (fallbackTimerRef.current !== undefined) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = undefined;
    }
    if (exitTimerRef.current !== undefined) {
      window.clearTimeout(exitTimerRef.current);
    }

    exitTimerRef.current = window.setTimeout(() => {
      if (reduceMotion) {
        setPhase(null);
        targetPathnameRef.current = null;
        isTransitioningRef.current = false;
        document.documentElement.classList.remove(TRANSITIONING_CLASS);
        return;
      }

      setPhase((current) => (current ? "exiting" : current));
      removeTimerRef.current = window.setTimeout(() => {
        setPhase(null);
        targetPathnameRef.current = null;
        isTransitioningRef.current = false;
        document.documentElement.classList.remove(TRANSITIONING_CLASS);
      }, EXIT_DURATION);
    }, delay);
  }, [restorePageContent]);

  const hideWhenRouteIsReady = useCallback(() => {
    let stableFrames = 0;

    const checkRoute = () => {
      if (document.querySelector(".page-loader-route")) {
        stableFrames = 0;
      } else {
        stableFrames += 1;
      }

      if (stableFrames >= 2) {
        hideLoader();
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(checkRoute);
    };

    animationFrameRef.current = window.requestAnimationFrame(checkRoute);
  }, [hideLoader]);

  const beginTransition = useCallback(
    (targetPathname: string | null, navigate?: () => void) => {
      if (isTransitioningRef.current) return false;
      isTransitioningRef.current = true;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        navigate?.();
        isTransitioningRef.current = false;
        return true;
      }

      clearTransitionTimers();
      document.documentElement.classList.add(TRANSITIONING_CLASS);
      targetPathnameRef.current = targetPathname;
      void fadeOutCurrentPage().then(() => {
        if (!isMountedRef.current || !isTransitioningRef.current) return;

        shownAtRef.current = performance.now();
        flushSync(() => setPhase("entering"));

        animationFrameRef.current = window.requestAnimationFrame(() => {
          setPhase("visible");
          animationFrameRef.current = window.requestAnimationFrame(() => {
            navigate?.();
          });
        });

        fallbackTimerRef.current = window.setTimeout(
          hideLoader,
          ROUTE_TIMEOUT,
        );
      });
      return true;
    },
    [clearTransitionTimers, fadeOutCurrentPage, hideLoader],
  );

  useEffect(() => {
    isMountedRef.current = true;
    document.documentElement.setAttribute(HYDRATED_ATTRIBUTE, "");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    shownAtRef.current = performance.now();

    if (!hasInitialLoaderRef.current || reduceMotion) {
      setPhase(null);
    } else {
      document.documentElement.classList.add(TRANSITIONING_CLASS);
      hideWhenRouteIsReady();
    }

    return () => {
      isMountedRef.current = false;
      isTransitioningRef.current = false;
      clearTransitionTimers();
      restorePageContent();
      document.documentElement.classList.remove(TRANSITIONING_CLASS);
    };
  }, [clearTransitionTimers, hideWhenRouteIsReady, restorePageContent]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("role") === "switch"
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname === window.location.pathname
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const href = `${url.pathname}${url.search}${url.hash}`;
      beginTransition(url.pathname, () => router.push(href));
    };

    const handleHistoryNavigation = () => {
      if (!isTransitioningRef.current) beginTransition(null);
    };

    const handleRequestedNavigation = (event: Event) => {
      const { navigate, targetPathname = null } = (
        event as CustomEvent<NavigationRequest>
      ).detail;
      beginTransition(targetPathname, navigate);
    };

    // Own regular internal navigation in capture phase: cover the current page
    // first, then invoke the router ourselves on the following painted frame.
    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handleHistoryNavigation);
    window.addEventListener(NAVIGATION_EVENT, handleRequestedNavigation);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handleHistoryNavigation);
      window.removeEventListener(NAVIGATION_EVENT, handleRequestedNavigation);
    };
  }, [beginTransition, router]);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;

    if (
      targetPathnameRef.current === null ||
      targetPathnameRef.current === pathname
    ) {
      hideWhenRouteIsReady();
    }
  }, [hideWhenRouteIsReady, pathname]);

  if (!phase) return null;

  return <PageLoader overlay phase={phase} />;
}
