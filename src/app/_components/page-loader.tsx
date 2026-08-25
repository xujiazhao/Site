"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  NAVIGATION_EVENT,
  type NavigationRequest,
} from "./navigation-transition";
import {
  clearPendingHomeDeparture,
  getHomePathname,
  markHomeDeparture,
} from "./home-return-history";

type LoaderPhase = "entering" | "visible" | "exiting";

type PageLoaderProps = {
  overlay?: boolean;
  phase?: LoaderPhase;
};

const MIN_VISIBLE_DURATION = 100;
const EXIT_DURATION = 100;
const PAGE_EXIT_DURATION = 100;
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
  const routeReadyFrameRef = useRef<number | undefined>(undefined);
  const exitTimerRef = useRef<number | undefined>(undefined);
  const removeTimerRef = useRef<number | undefined>(undefined);
  const fallbackTimerRef = useRef<number | undefined>(undefined);
  const isTransitioningRef = useRef(false);
  const isMountedRef = useRef(false);
  const outgoingAnimationRef = useRef<Animation | null>(null);
  const transitionIdRef = useRef(0);

  const clearTransitionTimers = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }
    if (routeReadyFrameRef.current !== undefined) {
      window.cancelAnimationFrame(routeReadyFrameRef.current);
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
    routeReadyFrameRef.current = undefined;
    exitTimerRef.current = undefined;
    removeTimerRef.current = undefined;
    fallbackTimerRef.current = undefined;
  }, []);

  const restorePageContent = useCallback(() => {
    outgoingAnimationRef.current?.cancel();
    outgoingAnimationRef.current = null;
    document
      .querySelector<HTMLElement>("[data-language-transition-layer]")
      ?.style.removeProperty("opacity");
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

  const fadeInCurrentPage = useCallback(() => {
    const layer = document.querySelector<HTMLElement>(
      "[data-language-transition-layer]",
    );
    if (!layer) {
      restorePageContent();
      return;
    }

    restorePageContent();
    layer.style.opacity = "0";
    const animation = layer.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: PAGE_EXIT_DURATION,
      easing: "linear",
      fill: "forwards",
    });
    outgoingAnimationRef.current = animation;

    void animation.finished.then(
      () => {
        if (outgoingAnimationRef.current !== animation) return;
        outgoingAnimationRef.current = null;
        animation.cancel();
        layer.style.removeProperty("opacity");
      },
      () => undefined,
    );
  }, [restorePageContent]);

  const hideLoader = useCallback((transitionId = transitionIdRef.current) => {
    if (transitionId !== transitionIdRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const elapsed = performance.now() - shownAtRef.current;
    const delay = reduceMotion
      ? 0
      : Math.max(0, MIN_VISIBLE_DURATION - elapsed);

    if (fallbackTimerRef.current !== undefined) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = undefined;
    }
    if (exitTimerRef.current !== undefined) {
      window.clearTimeout(exitTimerRef.current);
    }

    exitTimerRef.current = window.setTimeout(() => {
      if (transitionId !== transitionIdRef.current) return;

      if (reduceMotion) {
        restorePageContent();
        setPhase(null);
        targetPathnameRef.current = null;
        isTransitioningRef.current = false;
        document.documentElement.classList.remove(TRANSITIONING_CLASS);
        return;
      }

      fadeInCurrentPage();
      setPhase((current) => (current ? "exiting" : current));
      removeTimerRef.current = window.setTimeout(() => {
        if (transitionId !== transitionIdRef.current) return;
        setPhase(null);
        targetPathnameRef.current = null;
        isTransitioningRef.current = false;
        document.documentElement.classList.remove(TRANSITIONING_CLASS);
      }, EXIT_DURATION);
    }, delay);
  }, [fadeInCurrentPage, restorePageContent]);

  const hideWhenRouteIsReady = useCallback((
    transitionId = transitionIdRef.current,
  ) => {
    if (routeReadyFrameRef.current !== undefined) {
      window.cancelAnimationFrame(routeReadyFrameRef.current);
    }

    let stableFrames = 0;

    const checkRoute = () => {
      if (transitionId !== transitionIdRef.current) return;

      if (document.querySelector(".page-loader-route")) {
        stableFrames = 0;
      } else {
        stableFrames += 1;
      }

      if (stableFrames >= 2) {
        routeReadyFrameRef.current = undefined;
        hideLoader(transitionId);
        return;
      }

      routeReadyFrameRef.current = window.requestAnimationFrame(checkRoute);
    };

    routeReadyFrameRef.current = window.requestAnimationFrame(checkRoute);
  }, [hideLoader]);

  const beginTransition = useCallback(
    (targetPathname: string | null, navigate?: () => void) => {
      if (isTransitioningRef.current) return false;
      isTransitioningRef.current = true;
      const transitionId = ++transitionIdRef.current;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        navigate?.();
        isTransitioningRef.current = false;
        return true;
      }

      clearTransitionTimers();
      document.documentElement.classList.add(TRANSITIONING_CLASS);
      targetPathnameRef.current = targetPathname;
      void fadeOutCurrentPage().then(() => {
        if (
          !isMountedRef.current ||
          !isTransitioningRef.current ||
          transitionId !== transitionIdRef.current
        ) {
          return;
        }

        shownAtRef.current = performance.now();
        flushSync(() => setPhase("entering"));

        animationFrameRef.current = window.requestAnimationFrame(() => {
          if (transitionId !== transitionIdRef.current) return;
          setPhase("visible");
          animationFrameRef.current = window.requestAnimationFrame(() => {
            if (transitionId !== transitionIdRef.current) return;
            navigate?.();
          });
        });

        fallbackTimerRef.current = window.setTimeout(() => {
          hideLoader(transitionId);
        }, ROUTE_TIMEOUT);
      });
      return true;
    },
    [clearTransitionTimers, fadeOutCurrentPage, hideLoader],
  );

  const cancelTransition = useCallback(() => {
    transitionIdRef.current += 1;
    clearTransitionTimers();
    restorePageContent();
    targetPathnameRef.current = null;
    isTransitioningRef.current = false;
    flushSync(() => setPhase(null));
    document.documentElement.classList.remove(TRANSITIONING_CLASS);
  }, [clearTransitionTimers, restorePageContent]);

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
      transitionIdRef.current += 1;
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
        anchor.hasAttribute("data-navigation-controlled") ||
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
      const transitionStarted = beginTransition(url.pathname, () => {
        router.push(href);
      });
      if (transitionStarted) {
        const homePathname = getHomePathname(window.location.pathname);
        if (homePathname) {
          markHomeDeparture(homePathname, url.pathname);
        } else {
          clearPendingHomeDeparture();
        }
      }
    };

    const handleHistoryNavigation = () => {
      // History traversal already restores the cached route and its scroll
      // position. A site loader here would briefly cover content that the
      // browser has already painted, so always cancel any in-flight overlay.
      cancelTransition();
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      cancelTransition();
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
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener(NAVIGATION_EVENT, handleRequestedNavigation);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handleHistoryNavigation);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener(NAVIGATION_EVENT, handleRequestedNavigation);
    };
  }, [
    beginTransition,
    cancelTransition,
    router,
  ]);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;
    if (!isTransitioningRef.current) return;

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
