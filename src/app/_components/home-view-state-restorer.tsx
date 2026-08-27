"use client";

import { useLayoutEffect } from "react";
import { readHomeScrollPosition } from "./home-return-history";

type Props = {
  homePathname: string;
};

export function HomeViewStateRestorer({ homePathname }: Props) {
  useLayoutEffect(() => {
    const scrollPosition = readHomeScrollPosition(homePathname);
    if (scrollPosition === null) return;

    window.scrollTo({ top: scrollPosition, behavior: "auto" });
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: scrollPosition, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [homePathname]);

  return null;
}
