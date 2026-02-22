"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps a container and adds skeleton loading states to all <img> and <iframe>
 * elements inside it. Works with dangerouslySetInnerHTML content.
 */
export function MediaSkeleton({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const processMedia = (el: HTMLImageElement) => {
      // Skip already loaded images
      if (el instanceof HTMLImageElement && el.complete && el.naturalHeight > 0) {
        return;
      }

      // Skip tiny images (icons, emojis)
      if (el instanceof HTMLImageElement) {
        const style = el.getAttribute("style") || "";
        if (style.includes("width") && parseInt(style) < 80) return;
      }

      // Create wrapper
      const wrapper = document.createElement("div");
      wrapper.className = "media-skeleton-wrapper";

      el.parentNode?.insertBefore(wrapper, el);
      wrapper.appendChild(el);

      // Hide media until loaded
      el.style.opacity = "0";

      const handleLoad = () => {
        wrapper.classList.add("media-skeleton-loaded");
        el.style.opacity = "1";
      };

      const handleError = () => {
        wrapper.classList.add("media-skeleton-loaded");
        el.style.opacity = "1";
      };

      el.addEventListener("load", handleLoad, { once: true });
      el.addEventListener("error", handleError, { once: true });

      // Re-check after attaching listeners: the image may have finished
      // loading between the initial check and addEventListener (race condition
      // common with cached / 304 responses).
      if (el instanceof HTMLImageElement && el.complete) {
        if (el.naturalHeight > 0) {
          handleLoad();
        } else {
          handleError();
        }
      }
    };

    // Process existing media elements
    const images = container.querySelectorAll<HTMLImageElement>("img");
    images.forEach(processMedia);
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
