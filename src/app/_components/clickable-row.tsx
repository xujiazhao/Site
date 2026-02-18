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
    <tr
      className={className}
      onClick={() => router.push(href)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(href);
        }
      }}
    >
      {children}
    </tr>
  );
}
