"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollReset() {
  const pathname = usePathname();

  // Disable browser's native scroll restoration to prevent conflicts
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Flag back/forward navigations so template.tsx can skip fade-in animation
  // (prevents flash on iOS Safari swipe-back gesture)
  useEffect(() => {
    const onPopState = () => {
      (window as any).__isBackNavigation = true;
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // On homepage: continuously persist scroll position to sessionStorage (debounced)
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const isHomePage = segments.length <= 1;

    if (!isHomePage) return;

    let timer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        sessionStorage.setItem('homeScrollY', String(window.scrollY));
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  // On detail page: scroll to top. On homepage: restore saved position.
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const isDetailPage = segments.length > 2;
    const isHomePage = segments.length <= 1;

    if (isDetailPage) {
      window.scrollTo(0, 0);
    } else if (isHomePage) {
      const savedY = sessionStorage.getItem('homeScrollY');
      if (savedY) {
        const y = parseInt(savedY, 10);
        // Retry until page content is tall enough to scroll to the saved position
        let attempts = 0;
        const tryRestore = () => {
          window.scrollTo(0, y);
          attempts++;
          if (window.scrollY !== y && attempts < 10) {
            requestAnimationFrame(tryRestore);
          }
        };
        requestAnimationFrame(tryRestore);
      }
    }
  }, [pathname]);

  return null;
}
