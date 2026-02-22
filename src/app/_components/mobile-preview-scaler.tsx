"use client";

import { useEffect } from "react";

export function MobilePreviewScaler() {
  useEffect(() => {
    const containers = document.querySelectorAll<HTMLElement>(".mobile-preview");

    const observers: ResizeObserver[] = [];

    containers.forEach((container) => {
      // Skip if already initialized
      if (container.dataset.initialized) return;
      container.dataset.initialized = "true";

      const iframe = container.querySelector("iframe") as HTMLIFrameElement | null;
      if (!iframe) return;

      const nativeW = 390;
      const nativeH = 844;
      const autoplay = container.dataset.autoplay === "true";

      const applyScale = () => {
        const containerH = container.clientHeight;
        const scale = containerH / nativeH;
        iframe.style.width = `${nativeW}px`;
        iframe.style.height = `${nativeH}px`;
        iframe.style.transformOrigin = "top left";
        iframe.style.transform = `scale(${scale})`;
        iframe.style.position = "absolute";
        iframe.style.top = "0";
        iframe.style.left = "50%";
        iframe.style.marginLeft = `${(-nativeW * scale) / 2}px`;
      };

      if (autoplay) {
        // No play button — show iframe directly
        iframe.style.display = "block";
        applyScale();
      } else {
        // Store original src and remove it to prevent loading
        const originalSrc = iframe.src || iframe.getAttribute("data-src") || "";
        iframe.removeAttribute("src");
        iframe.style.display = "none";

        // Create play overlay
        const overlay = document.createElement("div");
        overlay.style.cssText = `
          position: absolute; inset: 0; display: flex; align-items: center;
          justify-content: center; cursor: pointer; background: rgba(0,0,0,0.03);
          border-radius: inherit; z-index: 5; transition: background 0.2s;
        `;
        overlay.innerHTML = `
          <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(0,0,0,0.7);
            display: flex; align-items: center; justify-content: center; transition: transform 0.2s;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        `;
        overlay.addEventListener("mouseenter", () => {
          overlay.style.background = "rgba(0,0,0,0.06)";
          const btn = overlay.querySelector("div") as HTMLElement;
          if (btn) btn.style.transform = "scale(1.1)";
        });
        overlay.addEventListener("mouseleave", () => {
          overlay.style.background = "rgba(0,0,0,0.03)";
          const btn = overlay.querySelector("div") as HTMLElement;
          if (btn) btn.style.transform = "scale(1)";
        });

        container.appendChild(overlay);

        overlay.addEventListener("click", () => {
          overlay.remove();
          iframe.src = originalSrc;
          iframe.style.display = "block";
          applyScale();
        });
      }

      const observer = new ResizeObserver(() => {
        if (iframe.style.display !== "none") {
          applyScale();
        }
      });
      observer.observe(container);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return null;
}
