import type { ReactNode } from "react";

type TooltipProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function Tooltip({ id, children, className = "" }: TooltipProps) {
  return (
    <span
      id={id}
      role="tooltip"
      className={`pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-normal text-white opacity-0 shadow-lg transition-[opacity,transform] duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 dark:bg-neutral-100 dark:text-neutral-900 ${className}`}
    >
      {children}
    </span>
  );
}
