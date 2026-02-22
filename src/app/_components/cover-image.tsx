"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
};

export function CoverImage({ src, alt }: Props) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if the image is already complete (cached / 304) when mounted
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalHeight > 0) {
      setLoaded(true);
    }
  }, []);

  const handleLoaded = useCallback(() => setLoaded(true), []);

  return (
    <div
      className={`overflow-hidden rounded-lg border border-black/10 aspect-[2/1] md:aspect-[3/2] cover-skeleton${loaded ? " cover-loaded" : ""}`}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
        onLoad={handleLoaded}
        onError={handleLoaded}
      />
    </div>
  );
}
