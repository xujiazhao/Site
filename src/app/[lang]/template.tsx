"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const isDetailPage = segments.length > 2;

  useEffect(() => {
    if (isDetailPage) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen pt-14 animate-page-fade-in">
      {children}
    </div>
  );
}
