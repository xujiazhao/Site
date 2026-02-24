"use client";

import { useRouter } from "next/navigation";

type Props = {
  href: string;
  rowIndex: number;
  children: React.ReactNode;
};

export function PinnedRow({ href, rowIndex, children }: Props) {
  const router = useRouter();

  return (
    <div
      className="exp-pinned-row py-2 pr-3 font-semibold border-b border-neutral-100 transition-colors duration-300 bg-white flex items-center gap-1.5 cursor-pointer"
      data-row-index={rowIndex}
      onClick={() => router.push(href)}
      onMouseEnter={() => {
        document.querySelectorAll(`[data-row-index="${rowIndex}"].exp-scroll-cell`).forEach(el => el.classList.add('bg-neutral-100'));
      }}
      onMouseLeave={() => {
        document.querySelectorAll(`[data-row-index="${rowIndex}"].exp-scroll-cell`).forEach(el => el.classList.remove('bg-neutral-100'));
      }}
    >
      {children}
    </div>
  );
}
