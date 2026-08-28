"use client";

import { useEffect, useRef, useState } from "react";
import { PiCaretDownBold } from "react-icons/pi";

type Props = {
  expanded: boolean;
  disabled: boolean;
  label: string;
  onClick: () => void;
};

export function ExpandableToggleButton({
  expanded,
  disabled,
  label,
  onClick,
}: Props) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const [labelWidth, setLabelWidth] = useState<number | null>(null);

  useEffect(() => {
    const labelElement = labelRef.current;
    if (!labelElement) return;

    const nextWidth = Math.ceil(labelElement.scrollWidth);
    setLabelWidth((currentWidth) =>
      currentWidth === nextWidth ? currentWidth : nextWidth,
    );
  }, [label]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-expanded={expanded}
      className="liquid-glass-control flex items-center gap-1.5 rounded-full px-4 py-2 text-base text-neutral-500 transition-[color,background-color,box-shadow] duration-300 hover:text-neutral-800 disabled:cursor-default dark:text-neutral-300 dark:hover:text-neutral-100"
    >
      <span
        className="block overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={labelWidth === null ? undefined : { width: `${labelWidth}px` }}
      >
        <span
          key={label}
          ref={labelRef}
          className="expandable-toggle-label inline-block whitespace-nowrap"
        >
          {label}
        </span>
      </span>
      <PiCaretDownBold
        aria-hidden="true"
        className={`relative top-px h-4 w-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
          expanded ? "rotate-180" : "rotate-0"
        }`}
      />
    </button>
  );
}
