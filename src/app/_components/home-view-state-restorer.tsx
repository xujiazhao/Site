"use client";

import { useLayoutEffect } from "react";
import { readHomeScrollPosition } from "./home-return-history";
import { fadeInAfterHomeReturn } from "./home-return-transition";

type Props = {
  homePathname: string;
};

export function HomeViewStateRestorer({ homePathname }: Props) {
  useLayoutEffect(() => {
    const scrollPosition = readHomeScrollPosition(homePathname);
    fadeInAfterHomeReturn();
    if (scrollPosition === null) return;

    window.scrollTo({ top: scrollPosition, behavior: "auto" });
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: scrollPosition, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [homePathname]);

  return null;
}
