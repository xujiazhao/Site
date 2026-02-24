"use client";

import { useRouter } from "next/navigation";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ClickableRow({ href, children, className }: Props) {
  const router = useRouter();

  return (
    <div
      className={className}
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(href);
        }
      }}
    >
      {children}
    </div>
  );
}
