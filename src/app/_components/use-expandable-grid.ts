"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  readHomeSectionExpanded,
  writeHomeSectionExpanded,
} from "./home-return-history";

export const EXPANDABLE_GRID_DURATION_MS = 400;

type ViewStateOptions = {
  homePathname: string;
  sectionKey: string;
};

export function useExpandableGrid<T extends HTMLElement>(
  viewState?: ViewStateOptions,
) {
  const readInitialExpanded = () =>
    viewState
      ? readHomeSectionExpanded(
          viewState.homePathname,
          viewState.sectionKey,
        )
      : false;
  const [expanded, setExpanded] = useState(readInitialExpanded);
  const [contentVisible, setContentVisible] = useState(readInitialExpanded);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<T>(null);
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFramesRef = useRef<number[]>([]);

  const storeExpanded = useCallback((nextExpanded: boolean) => {
    if (!viewState) return;
    writeHomeSectionExpanded(
      viewState.homePathname,
      viewState.sectionKey,
      nextExpanded,
    );
  }, [viewState]);

  useEffect(() => () => {
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    animationFramesRef.current.forEach(cancelAnimationFrame);
  }, []);

  const afterTwoFrames = useCallback((callback: () => void) => {
    const firstFrame = requestAnimationFrame(() => {
      const secondFrame = requestAnimationFrame(callback);
      animationFramesRef.current.push(secondFrame);
    });
    animationFramesRef.current.push(firstFrame);
  }, []);

  const resetHeight = useCallback((container: T) => {
    container.style.transition = "none";
    container.style.maxHeight = "";
    container.style.overflow = "";
  }, []);

  const lockHeight = useCallback((container: T) => {
    container.style.transition = "none";
    container.style.maxHeight = `${container.scrollHeight}px`;
    container.style.overflow = "hidden";
    void container.offsetHeight;
  }, []);

  const animateHeight = useCallback((container: T, height: number) => {
    container.style.transition = `max-height ${EXPANDABLE_GRID_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    container.style.maxHeight = `${height}px`;
  }, []);

  const getCollapsedHeight = useCallback((container: T) => {
    const containerTop = container.getBoundingClientRect().top;

    return Array.from(
      container.querySelectorAll<HTMLElement>(":scope > [data-collapse-base]"),
    ).reduce(
      (height, item) =>
        Math.max(height, item.getBoundingClientRect().bottom - containerTop),
      0,
    );
  }, []);

  const toggle = useCallback(() => {
    if (isAnimating) return;

    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resetHeight(container);
      storeExpanded(!expanded);
      setExpanded(!expanded);
      setContentVisible(!expanded);
      return;
    }

    setIsAnimating(true);
    lockHeight(container);

    if (expanded) {
      storeExpanded(false);
      setContentVisible(false);
      afterTwoFrames(() => {
        animateHeight(container, getCollapsedHeight(container));
        animationTimerRef.current = setTimeout(() => {
          setExpanded(false);
          const resetFrame = requestAnimationFrame(() => {
            resetHeight(container);
            setIsAnimating(false);
          });
          animationFramesRef.current.push(resetFrame);
        }, EXPANDABLE_GRID_DURATION_MS);
      });
      return;
    }
    storeExpanded(true);
    setExpanded(true);
    afterTwoFrames(() => {
      setContentVisible(true);
      animateHeight(container, container.scrollHeight);
      animationTimerRef.current = setTimeout(() => {
        resetHeight(container);
        setIsAnimating(false);
      }, EXPANDABLE_GRID_DURATION_MS);
    });
  }, [
    afterTwoFrames,
    animateHeight,
    expanded,
    getCollapsedHeight,
    isAnimating,
    lockHeight,
    resetHeight,
    storeExpanded,
  ]);

  return {
    containerRef,
    contentVisible,
    expanded,
    isAnimating,
    toggle,
  };
}
