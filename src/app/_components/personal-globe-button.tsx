"use client";

import Link from "next/link";
import { RiGlobeLine } from "react-icons/ri";

type Props = {
  lang: string;
};

export function PersonalGlobeButton({ lang }: Props) {
  const isEn = lang === "en";
  const label = isEn ? "Explore my world" : "探索我的世界";

  return (
    <Link
      href={`/${lang}/atlas`}
      scroll={false}
      className="personal-globe-launcher liquid-glass-control relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl text-neutral-900 transition-[color,background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-neutral-100 dark:focus-visible:ring-offset-neutral-950"
      aria-label={label}
      title={label}
    >
      <RiGlobeLine aria-hidden="true" className="h-[18px] w-[18px]" />
    </Link>
  );
}
