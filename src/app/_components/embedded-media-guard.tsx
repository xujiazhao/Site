"use client";

import { useEffect, useRef } from "react";

const BLOCKED_DOMAINS = ["youtube.com", "youtu.be", "github.io", "github.com"];
const LOAD_TIMEOUT_MS = 15000;

function mayBeBlocked(src: string) {
  try {
    const url = new URL(src, window.location.origin);
    return BLOCKED_DOMAINS.some((domain) => url.hostname.endsWith(domain));
  } catch {
    return false;
  }
}

function showBlockedOverlay(iframe: HTMLIFrameElement) {
  const wrapper = iframe.parentElement;
  if (!wrapper || wrapper.querySelector(".blocked-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "blocked-overlay";

  const message = document.createElement("p");
  message.textContent = document.documentElement.lang === "zh"
    ? "您需要科学上网方可浏览此内容"
    : "This embedded content may require a proxy to view.";

  overlay.appendChild(message);
  (wrapper as HTMLElement).style.position = "relative";
  wrapper.appendChild(overlay);
}

export function EmbeddedMediaGuard({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cleanups: Array<() => void> = [];

    container.querySelectorAll<HTMLIFrameElement>("iframe").forEach((iframe) => {
      const src = iframe.src || iframe.getAttribute("data-src") || "";
      if (!mayBeBlocked(src)) return;

      const timer = window.setTimeout(() => {
        if (!iframe.dataset.loaded) showBlockedOverlay(iframe);
      }, LOAD_TIMEOUT_MS);

      const handleLoad = () => {
        iframe.dataset.loaded = "true";
        window.clearTimeout(timer);
      };
      const handleError = () => {
        window.clearTimeout(timer);
        showBlockedOverlay(iframe);
      };

      iframe.addEventListener("load", handleLoad, { once: true });
      iframe.addEventListener("error", handleError, { once: true });
      cleanups.push(() => {
        window.clearTimeout(timer);
        iframe.removeEventListener("load", handleLoad);
        iframe.removeEventListener("error", handleError);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
