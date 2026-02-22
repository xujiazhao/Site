"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const isDetailPage = segments.length > 2;

  // Check if this is a back/forward navigation (flag set by ScrollReset in layout)
  // Skip fade-in animation to avoid flash on iOS Safari swipe-back gesture
  const isBack = typeof window !== "undefined" && (window as any).__isBackNavigation;
  if (isBack) {
    (window as any).__isBackNavigation = false;
  }

  useEffect(() => {
    if (isDetailPage) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className={`min-h-screen pt-14 ${isBack ? '' : 'animate-page-fade-in'}`}>
      {children}
    </div>
  );
}
