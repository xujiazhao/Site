"use client";

import { useCallback, useEffect, useState } from "react";
import { PiXBold } from "react-icons/pi";

export function Lightbox({ children }: { children: React.ReactNode }) {
  const [src, setSrc] = useState<string | null>(null);

  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG" && target.closest("[data-lightbox]")) {
      const img = target as HTMLImageElement;
      // Skip small images (icons, emojis, favicons)
      if (img.naturalWidth < 100 || img.naturalHeight < 100 || img.width < 100 || img.height < 100) {
        return;
      }
      e.preventDefault();
      setSrc(img.src);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  useEffect(() => {
    if (src) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [src]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSrc(null);
    };
    if (src) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [src]);

  return (
    <>
      <div data-lightbox>{children}</div>

      {src && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-lightbox-in cursor-zoom-out"
          onClick={() => setSrc(null)}
        >
          <button
            onClick={() => setSrc(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <PiXBold size={24} />
          </button>
          <img
            src={src}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
