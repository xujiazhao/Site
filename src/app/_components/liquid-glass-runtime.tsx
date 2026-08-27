"use client";

import { useEffect } from "react";

const SVG_NS = "http://www.w3.org/2000/svg";
const GLASS_SELECTOR = ".liquid-glass-control";

type GlassRecord = {
  filter: SVGFilterElement;
  signature: string;
};

function roundedRectDistance(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const qx = Math.abs(x - width / 2) - (width / 2 - radius);
  const qy = Math.abs(y - height / 2) - (height / 2 - radius);
  return (
    Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
    Math.min(Math.max(qx, qy), 0) -
    radius
  );
}

function makeDisplacementMap(
  width: number,
  height: number,
  radius: number,
) {
  const displacementCanvas = document.createElement("canvas");
  displacementCanvas.width = width;
  displacementCanvas.height = height;

  const displacementContext = displacementCanvas.getContext("2d");
  if (!displacementContext) return null;

  const displacement = displacementContext.createImageData(width, height);
  // Refraction belongs at the physical rim. The flat center stays neutral.
  const rim = Math.min(8, Math.max(4, Math.min(width, height) * 0.18));

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const px = x + 0.5;
      const py = y + 0.5;
      const distance = roundedRectDistance(px, py, width, height, radius);

      let red = 128;
      let green = 128;

      if (distance <= 0 && -distance < rim) {
        const gradientX =
          roundedRectDistance(px + 0.75, py, width, height, radius) -
          roundedRectDistance(px - 0.75, py, width, height, radius);
        const gradientY =
          roundedRectDistance(px, py + 0.75, width, height, radius) -
          roundedRectDistance(px, py - 0.75, width, height, radius);
        const gradientLength = Math.hypot(gradientX, gradientY) || 1;
        const normalX = gradientX / gradientLength;
        const normalY = gradientY / gradientLength;
        const progress = 1 - -distance / rim;
        const bend = progress * progress * (3 - 2 * progress);

        red = 128 + Math.round(127 * normalX * bend);
        green = 128 + Math.round(127 * normalY * bend);
      }

      displacement.data[index] = red;
      displacement.data[index + 1] = green;
      displacement.data[index + 2] = 128;
      displacement.data[index + 3] = 255;
    }
  }

  displacementContext.putImageData(displacement, 0, 0);
  return displacementCanvas.toDataURL("image/png");
}

function svgElement<K extends keyof SVGElementTagNameMap>(
  name: K,
  attributes: Record<string, string>,
) {
  const element = document.createElementNS(SVG_NS, name);
  for (const [attribute, value] of Object.entries(attributes)) {
    element.setAttribute(attribute, value);
  }
  return element;
}

function makeFilter(
  id: string,
  width: number,
  height: number,
  displacementMap: NonNullable<ReturnType<typeof makeDisplacementMap>>,
) {
  const filter = svgElement("filter", {
    id,
    x: "-18%",
    y: "-35%",
    width: "136%",
    height: "170%",
    "color-interpolation-filters": "sRGB",
  });

  filter.append(
    svgElement("feGaussianBlur", {
      in: "SourceGraphic",
      stdDeviation: "0.2",
      result: "blurred_source",
    }),
    svgElement("feImage", {
      href: displacementMap,
      x: "0",
      y: "0",
      width: String(width),
      height: String(height),
      preserveAspectRatio: "none",
      result: "displacement_map",
    }),
    svgElement("feDisplacementMap", {
      in: "blurred_source",
      in2: "displacement_map",
      scale: String(-Math.min(14, Math.max(7, height * 0.28))),
      xChannelSelector: "R",
      yChannelSelector: "G",
      result: "displaced",
    }),
    svgElement("feColorMatrix", {
      in: "displaced",
      type: "saturate",
      values: "1.7",
      result: "displaced_saturated",
    }),
  );

  return filter;
}

export function LiquidGlassRuntime() {
  useEffect(() => {
    const supportsRefraction =
      "chrome" in window &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !window.matchMedia("(prefers-reduced-transparency: reduce)").matches;

    if (!supportsRefraction) return;

    document
      .querySelectorAll('[data-liquid-glass-filter-host="true"]')
      .forEach((staleHost) => staleHost.remove());

    const host = svgElement("svg", {
      "aria-hidden": "true",
      "data-liquid-glass-filter-host": "true",
      width: "0",
      height: "0",
    });
    host.style.cssText =
      "position:fixed;width:0;height:0;overflow:hidden;pointer-events:none";
    const definitions = svgElement("defs", {});
    host.append(definitions);
    document.body.append(host);

    const records = new Map<HTMLElement, GlassRecord>();
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) applyGlass(entry.target as HTMLElement);
    });
    let sequence = 0;
    let scanTimer: number | undefined;

    const applyGlass = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width < 8 || height < 8 || width > 520 || height > 180) return;

      const radius = Math.min(
        Math.min(width, height) / 2,
        Number.parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0,
      );
      const signature = `${width}:${height}:${Math.round(radius)}`;
      const current = records.get(element);
      if (current?.signature === signature) return;

      const displacementMap = makeDisplacementMap(width, height, radius);
      if (!displacementMap) return;

      current?.filter.remove();
      const id = `site-liquid-glass-${sequence++}`;
      const filter = makeFilter(id, width, height, displacementMap);
      definitions.append(filter);
      records.set(element, { filter, signature });
      element.style.setProperty(
        "--liquid-glass-filter",
        `url("#${id}") blur(var(--liquid-glass-blur, 6px)) saturate(1.45)`,
      );
    };

    const scan = () => {
      const liveElements = new Set(
        document.querySelectorAll<HTMLElement>(GLASS_SELECTOR),
      );

      for (const [element, record] of records) {
        if (liveElements.has(element)) continue;
        resizeObserver.unobserve(element);
        record.filter.remove();
        records.delete(element);
      }

      liveElements.forEach((element) => {
        if (!records.has(element)) resizeObserver.observe(element);
        applyGlass(element);
      });
    };

    const scheduleScan = () => {
      if (scanTimer !== undefined) window.clearTimeout(scanTimer);
      // Route segments can enter the DOM before React has hydrated them.
      // Waiting here prevents our inline filter style from changing the
      // server markup while React is still comparing it with the client tree.
      scanTimer = window.setTimeout(() => {
        scanTimer = undefined;
        scan();
      }, 500);
    };

    const mutationObserver = new MutationObserver(scheduleScan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    scan();

    return () => {
      if (scanTimer !== undefined) window.clearTimeout(scanTimer);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      for (const element of records.keys()) {
        element.style.removeProperty("--liquid-glass-filter");
      }
      records.clear();
      host.remove();
    };
  }, []);

  return null;
}
