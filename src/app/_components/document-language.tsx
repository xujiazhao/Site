"use client";

import { useLayoutEffect } from "react";

export function DocumentLanguage({ lang }: { lang: string }) {
  useLayoutEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
