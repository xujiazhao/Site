"use client";

import { useEffect, useRef } from "react";

// Domains that are blocked in mainland China
const BLOCKED_DOMAINS = ["youtube.com", "youtu.be", "github.io", "github.com"];

function isBlockedSrc(src: string): boolean {
  try {
    const url = new URL(src, window.location.origin);
    return BLOCKED_DOMAINS.some(d => url.hostname.endsWith(d));
  } catch {
    return false;
  }
}

/**
 * Wraps a container and adds skeleton loading states to all <img> and <iframe>
 * elements inside it. Works with dangerouslySetInnerHTML content.
 */
export function MediaSkeleton({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ----- iframe blocked-content detection -----
    const iframes = container.querySelectorAll<HTMLIFrameElement>("iframe");
    iframes.forEach((iframe) => {
      const src = iframe.src || iframe.getAttribute("data-src") || "";
      if (!isBlockedSrc(src)) return;

      // Set a timeout: if the iframe hasn't loaded within 8s, show fallback
      const timer = setTimeout(() => {
        if (!iframe.dataset.loaded) {
          showBlockedOverlay(iframe);
        }
      }, 8000);

      iframe.addEventListener("load", () => {
        iframe.dataset.loaded = "1";
        clearTimeout(timer);
      }, { once: true });

      iframe.addEventListener("error", () => {
        clearTimeout(timer);
        showBlockedOverlay(iframe);
      }, { once: true });
    });

    function showBlockedOverlay(iframe: HTMLIFrameElement) {
      // Find the wrapper (media-skeleton-wrapper or direct parent)
      const wrapper = iframe.closest(".media-skeleton-wrapper") || iframe.parentElement;
      if (!wrapper) return;

      // Don't add twice
      if (wrapper.querySelector(".blocked-overlay")) return;

      const overlay = document.createElement("div");
      overlay.className = "blocked-overlay";
      overlay.innerHTML = `
        <div style="
          position: absolute; inset: 0; z-index: 5;
          display: flex; align-items: center; justify-content: center;
          background: rgba(245,245,245,0.95);
          border-radius: 0.5rem;
          padding: 1rem;
        ">
          <p style="
            color: #737373; font-size: 0.875rem; text-align: center;
            line-height: 1.5; max-width: 240px;
          ">您需要科学上网方可浏览此内容</p>
        </div>
      `;
      (wrapper as HTMLElement).style.position = "relative";
      wrapper.appendChild(overlay);
    }

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
