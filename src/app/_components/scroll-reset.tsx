"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function ScrollReset() {
  const pathname = usePathname();
  // Store the popstate status in a ref so it persists across renders but not reload
  const isPopState = useRef(false);

  useEffect(() => {
    // Handler for popstate event (triggered by Back/Forward buttons)
    const handlePopState = () => {
      isPopState.current = true;
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    // If navigation was triggered by popstate (Back/Forward), do nothing.
    // This allows the browser's native scroll restoration to work.
    if (isPopState.current) {
      isPopState.current = false; // Reset for next navigation
      return;
    }

    // Checking if we are on a detail page or just any page?
    // User requirement: "Entering a secondary page always starts from the top"
    // This implies any NEW navigation (pushState) should scroll to top.
    
    // Check if the pathname looks like a post page (has > 2 segments like /en/project/slug)
    const segments = pathname.split('/').filter(Boolean);
    const isDetailPage = segments.length > 2;

    if (isDetailPage) {
      // Force scroll to top for detail pages on new navigation
      // Use requestAnimationFrame to ensure DOM is ready after template remount
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
  }, [pathname]);

  return null;
}
