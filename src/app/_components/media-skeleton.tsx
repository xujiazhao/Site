"use client";

import { useEffect, useRef } from "react";

export function MediaSkeleton({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cleanups: Array<() => void> = [];

    container
      .querySelectorAll<HTMLImageElement>(".media-skeleton-wrapper img")
      .forEach((image) => {
        const wrapper = image.closest<HTMLElement>(".media-skeleton-wrapper");
        if (!wrapper) return;

        let disposed = false;
        const reveal = async () => {
          try {
            await image.decode();
          } catch {}
          if (!disposed) wrapper.classList.add("media-skeleton-loaded");
        };
        const handleLoad = () => void reveal();
        const handleError = () => {
          if (!disposed) wrapper.classList.add("media-skeleton-loaded");
        };

        image.addEventListener("load", handleLoad, { once: true });
        image.addEventListener("error", handleError, { once: true });

        if (image.complete) {
          if (image.naturalHeight > 0) void reveal();
          else handleError();
        }

        cleanups.push(() => {
          disposed = true;
          image.removeEventListener("load", handleLoad);
          image.removeEventListener("error", handleError);
        });
      });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
