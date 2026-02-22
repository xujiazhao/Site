"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
};

export function CoverImage({ src, alt }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-lg border border-black/10 aspect-[2/1] md:aspect-[3/2] cover-skeleton${loaded ? " cover-loaded" : ""}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}
