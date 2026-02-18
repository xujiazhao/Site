"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [opacity, setOpacity] = useState(1);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      // New route — start invisible, then fade in
      setOpacity(0);
      prevPathname.current = pathname;
      // Use rAF to ensure the opacity:0 is painted before transitioning to 1
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setOpacity(1);
        });
      });
    }
  }, [pathname]);

  return (
    <div
      className="min-h-screen pt-14"
      style={{
        transition: opacity === 1 ? "opacity 250ms ease-in-out" : "none",
        opacity,
      }}
    >
      {children}
    </div>
  );
}
