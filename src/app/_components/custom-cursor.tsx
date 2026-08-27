"use client";

import { useEffect, useRef } from "react";

const ARROW_SOURCE = "/assets/cursor/cursor-arrow.svg";
const DOT_SOURCE = "/assets/cursor/cursor-dot.svg";
const OUTLINE_POINTS = 24;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

type CursorPoint = { x: number; y: number };

function toPolygon(points: CursorPoint[]) {
  return `polygon(${points
    .map(({ x, y }) => `${x.toFixed(3)}px ${y.toFixed(3)}px`)
    .join(",")})`;
}

function signedArea(points: CursorPoint[]) {
  return points.reduce((area, point, index) => {
    const next = points[(index + 1) % points.length];
    return area + point.x * next.y - next.x * point.y;
  }, 0);
}

function samplePath(pathData: string) {
  const path = document.createElementNS(SVG_NAMESPACE, "path");
  path.setAttribute("d", pathData);
  const length = path.getTotalLength();
  if (!Number.isFinite(length) || length <= 0) {
    throw new Error("Cursor SVG path has no measurable outline");
  }

  return Array.from({ length: OUTLINE_POINTS }, (_, index) => {
    const point = path.getPointAtLength((length * index) / OUTLINE_POINTS);
    return { x: point.x, y: point.y };
  });
}

function alignOutline(reference: CursorPoint[], outline: CursorPoint[]) {
  const matchingDirection = signedArea(reference) * signedArea(outline) >= 0
    ? outline
    : [...outline].reverse();
  let bestOffset = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let offset = 0; offset < matchingDirection.length; offset += 1) {
    const distance = reference.reduce((total, point, index) => {
      const candidate = matchingDirection[(index + offset) % matchingDirection.length];
      return total
        + (point.x - candidate.x) ** 2
        + (point.y - candidate.y) ** 2;
    }, 0);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestOffset = offset;
    }
  }

  return reference.map(
    (_, index) => matchingDirection[(index + bestOffset) % matchingDirection.length],
  );
}

async function loadCursorOutline(source: string, signal: AbortSignal) {
  const response = await fetch(source, { signal });
  if (!response.ok) throw new Error("Unable to load cursor SVG");

  const svg = await response.text();
  const svgDocument = new DOMParser().parseFromString(svg, "image/svg+xml");
  const pathData = svgDocument
    .querySelector("#cursor-shape, path")
    ?.getAttribute("d");
  if (!pathData) throw new Error("Cursor SVG does not contain a path");

  return samplePath(pathData);
}

async function loadCursorPolygons(signal: AbortSignal) {
  const [arrow, dot] = await Promise.all([
    loadCursorOutline(ARROW_SOURCE, signal),
    loadCursorOutline(DOT_SOURCE, signal),
  ]);

  return {
    arrow: toPolygon(arrow),
    dot: toPolygon(alignOutline(arrow, dot)),
  };
}

const ACTION_SELECTOR = [
  "a",
  "button:not(:disabled)",
  "summary",
  '[role="button"]',
  "label[for]",
  "select:not(:disabled)",
  'input[type="button"]:not(:disabled)',
  'input[type="submit"]:not(:disabled)',
  'input[type="reset"]:not(:disabled)',
  'input[type="checkbox"]:not(:disabled)',
  'input[type="radio"]:not(:disabled)',
  'input[type="file"]:not(:disabled)',
  ".cursor-pointer",
  ".markdown img",
  '[data-cursor="action"]',
].join(",");

const TEXT_SELECTOR = [
  "textarea",
  '[contenteditable="true"]',
  "input:not([type])",
  'input[type="text"]',
  'input[type="email"]',
  'input[type="search"]',
  'input[type="password"]',
  'input[type="url"]',
  'input[type="tel"]',
  'input[type="number"]',
].join(",");

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const shape = shapeRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!cursor || !shape || !finePointer.matches) return;

    const root = document.documentElement;
    const controller = new AbortController();
    const isSafari = /^((?!chrome|chromium|crios|android|edg|opr).)*safari/i.test(
      navigator.userAgent,
    );
    let pulseTimer: number | undefined;
    let arrowPolygon: string | null = null;
    let dotPolygon: string | null = null;
    let actionState = false;
    let hiddenState = false;
    cursor.dataset.safari = String(isSafari);
    root.classList.add("custom-cursor-enabled");
    root.classList.toggle("safari-engine", isSafari);

    void loadCursorPolygons(controller.signal)
      .then((polygons) => {
        arrowPolygon = polygons.arrow;
        dotPolygon = polygons.dot;
        shape.style.setProperty(
          "--custom-cursor-clip",
          cursor.dataset.action === "true" ? dotPolygon : arrowPolygon,
        );
      })
      .catch(() => {
        // Keep the CSS fallback if the editable source is temporarily invalid.
      });

    const updateTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return;
      const isAction = Boolean(target.closest(ACTION_SELECTOR));
      const isHidden = Boolean(target.closest(TEXT_SELECTOR));

      if (hiddenState !== isHidden) {
        hiddenState = isHidden;
        cursor.dataset.hidden = String(isHidden);
      }

      if (actionState === isAction) return;
      actionState = isAction;
      cursor.dataset.action = String(isAction);
      const nextPolygon = isAction ? dotPolygon : arrowPolygon;
      if (nextPolygon) {
        shape.style.setProperty("--custom-cursor-clip", nextPolygon);
      }
    };

    const hideCursor = () => {
      cursor.dataset.visible = "false";
      cursor.dataset.pressed = "false";
    };
    const handleMove = (event: PointerEvent) => {
      // Safari can omit pointerleave when the pointer crosses from the page
      // into browser chrome. Its last pointermove lands exactly on a viewport
      // edge, so do not leave the custom cursor parked at that coordinate.
      const isAtViewportEdge =
        event.clientX <= 0 ||
        event.clientY <= 0 ||
        event.clientX >= window.innerWidth - 1 ||
        event.clientY >= window.innerHeight - 1;
      if (isAtViewportEdge) {
        hideCursor();
        return;
      }

      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.dataset.visible = "true";
      updateTarget(event.target);
    };
    const handleOver = (event: PointerEvent) => updateTarget(event.target);
    const handleViewportExit = (event: PointerEvent | MouseEvent) => {
      if (event.relatedTarget === null) hideCursor();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") hideCursor();
    };
    const handleDown = (event: PointerEvent) => {
      cursor.dataset.pressed = "true";
      const target = event.target;
      if (!(target instanceof Element) || !target.closest(ACTION_SELECTOR)) return;

      window.clearTimeout(pulseTimer);
      cursor.classList.remove("custom-cursor--pulsing");
      void cursor.offsetWidth;
      cursor.classList.add("custom-cursor--pulsing");
      pulseTimer = window.setTimeout(() => {
        cursor.classList.remove("custom-cursor--pulsing");
      }, 420);
    };
    const handleUp = () => {
      cursor.dataset.pressed = "false";
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerover", handleOver, { passive: true });
    document.addEventListener("pointerleave", hideCursor);
    document.addEventListener("pointerout", handleViewportExit);
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    window.addEventListener("blur", hideCursor);
    window.addEventListener("pagehide", hideCursor);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      controller.abort();
      window.clearTimeout(pulseTimer);
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerover", handleOver);
      document.removeEventListener("pointerleave", hideCursor);
      document.removeEventListener("pointerout", handleViewportExit);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("blur", hideCursor);
      window.removeEventListener("pagehide", hideCursor);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      root.classList.remove("safari-engine");
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      data-action="false"
      data-hidden="false"
      data-pressed="false"
      data-safari="false"
      data-visible="false"
      aria-hidden="true"
    >
      <span ref={shapeRef} className="custom-cursor__shape">
        <span className="custom-cursor__rim" />
        <span className="custom-cursor__face" />
      </span>
    </div>
  );
}
