"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiMapPin2Fill,
} from "react-icons/ri";
import type { COBEOptions, Globe } from "cobe";
import type { PersonalGlobePlace, PersonalGlobeRoute } from "@/lib/personal-globe";
import { Tooltip } from "./tooltip";

type Props = {
  lang: string;
  places: PersonalGlobePlace[];
  routes: PersonalGlobeRoute[];
};

type GlobeView = {
  phi: number;
  theta: number;
  scale: number;
  opacity: number;
};

type Vector3 = [number, number, number];

type DragState = {
  pointerId: number;
  x: number;
  y: number;
  phi: number;
  theta: number;
};

type StoryRailDragState = {
  pointerId: number;
  startX: number;
  scrollLeft: number;
  startIndex: number;
  distance: number;
};

type PlaceGroup = {
  id: string;
  coordinates: PersonalGlobePlace["coordinates"];
  location: string;
  isExperience: boolean;
  places: PersonalGlobePlace[];
};

type MarkerStyle = CSSProperties & {
  positionAnchor: string;
  "--marker-visibility": string;
  "--surface-angle": string;
  "--surface-scale": string;
  "--pin-hover-height": string;
};

const ORANGE: [number, number, number] = [0.933, 0.6, 0.2];
const ROUTE_LIGHT_BLUE: [number, number, number] = [0.42, 0.78, 1];
const ARC_APEX_HEIGHT = 0.16;
const ARC_PARTICLE_INTERVAL = 3000;
const ARC_PARTICLE_DURATION = 2400;
const THEME_STORAGE_KEY = "site-theme";
const ATLAS_LANGUAGE_SWITCH_ATTRIBUTE = "data-atlas-language-switching";
const RESPONSIVE_GLOBE_MAX_WIDTH = 1100;
const GLOBE_DIAMETER_RATIO = 0.8;
const GLOBE_EDGE_OVERFLOW = 1.06;
const INITIAL_VIEW: GlobeView = {
  phi: -3.45,
  theta: 0.26,
  scale: 0.78,
  opacity: 0,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutQuint(value: number) {
  return 1 - (1 - value) ** 5;
}

function shortestAngle(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

function globeScaleForViewport(width: number, height: number) {
  if (width > RESPONSIVE_GLOBE_MAX_WIDTH) return 1;

  const widthFitScale = width * GLOBE_EDGE_OVERFLOW
    / Math.max(1, height * GLOBE_DIAMETER_RATIO);
  const deviceCap = width < 600 ? 0.74 : 0.9;
  return clamp(Math.min(widthFitScale, deviceCap), 0.54, deviceCap);
}

function focusedGlobeScale(baseScale: number, responsive: boolean) {
  return responsive ? Math.min(baseScale * 1.08, baseScale + 0.08) : 1.24;
}

function locationToVector([latitude, longitude]: PersonalGlobePlace["coordinates"]): Vector3 {
  const latitudeRadians = latitude * Math.PI / 180;
  const longitudeRadians = longitude * Math.PI / 180 - Math.PI;
  const latitudeCosine = Math.cos(latitudeRadians);
  return [
    -latitudeCosine * Math.cos(longitudeRadians),
    Math.sin(latitudeRadians),
    latitudeCosine * Math.sin(longitudeRadians),
  ];
}

function pointAlongArc(
  from: PersonalGlobePlace["coordinates"],
  to: PersonalGlobePlace["coordinates"],
  progress: number,
  height: number,
): Vector3 {
  const start = locationToVector(from);
  const end = locationToVector(to);
  const dot = clamp(
    start[0] * end[0] + start[1] * end[1] + start[2] * end[2],
    -1,
    1,
  );
  const angle = Math.acos(dot);
  const sine = Math.sin(angle);
  const inverseProgress = 1 - progress;
  const vector = Math.abs(sine) < 0.001
    ? start.map((value, index) => value * inverseProgress + end[index] * progress) as Vector3
    : start.map((value, index) => (
      Math.sin(inverseProgress * angle) / sine * value
      + Math.sin(progress * angle) / sine * end[index]
    )) as Vector3;
  const length = Math.hypot(...vector) || 1;
  const radius = 0.8 * (1 + height * Math.sin(Math.PI * progress));
  return vector.map((value) => value / length * radius) as Vector3;
}

function projectGlobePoint(
  [x, y, z]: Vector3,
  view: GlobeView,
  width: number,
  height: number,
) {
  const thetaCosine = Math.cos(view.theta);
  const phiCosine = Math.cos(view.phi);
  const thetaSine = Math.sin(view.theta);
  const phiSine = Math.sin(view.phi);
  const projectedX = phiCosine * x + phiSine * z;
  const projectedY = phiSine * thetaSine * x
    + thetaCosine * y
    - phiCosine * thetaSine * z;
  const projectedZ = -phiSine * thetaCosine * x
    + thetaSine * y
    + phiCosine * thetaCosine * z;
  const aspect = width / Math.max(1, height);
  const normalizedX = (projectedX / aspect * view.scale + 1) / 2;
  const normalizedY = (-projectedY * view.scale + 1) / 2;
  return {
    x: normalizedX * width,
    y: normalizedY * height,
    visible: (projectedZ >= 0 || projectedX ** 2 + projectedY ** 2 >= 0.64)
      && normalizedX > -0.05
      && normalizedX < 1.05
      && normalizedY > -0.05
      && normalizedY < 1.05,
  };
}

function targetViewFor(
  place: PersonalGlobePlace,
  baseScale: number,
  responsive: boolean,
): GlobeView {
  const [latitude, longitude] = place.coordinates;
  return {
    // COBE's front-facing meridian is offset by 90° from its phi origin.
    phi: -(longitude * Math.PI) / 180 - Math.PI / 2,
    theta: (latitude * Math.PI) / 180,
    scale: focusedGlobeScale(baseScale, responsive),
    opacity: 1,
  };
}

function shortLocation(location: string) {
  return location.split(/[,，]/)[0]?.trim() || location;
}

function coordinateKey([latitude, longitude]: PersonalGlobePlace["coordinates"]) {
  return `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
}

function getClosestStoryIndex(rail: HTMLElement) {
  const cards = Array.from(
    rail.querySelectorAll<HTMLElement>("[data-story-id]"),
  );
  const railCenter = rail.getBoundingClientRect().left + rail.clientWidth / 2;

  return cards.reduce((closestIndex, card, index) => {
    const bounds = card.getBoundingClientRect();
    const distance = Math.abs(bounds.left + bounds.width / 2 - railCenter);
    const closestBounds = cards[closestIndex]?.getBoundingClientRect();
    const closestDistance = closestBounds
      ? Math.abs(closestBounds.left + closestBounds.width / 2 - railCenter)
      : Number.POSITIVE_INFINITY;
    return distance < closestDistance ? index : closestIndex;
  }, 0);
}

export function PersonalGlobeOverlay({ lang, places, routes }: Props) {
  const isEn = lang === "en";
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<Globe | null>(null);
  const frameRef = useRef<number | null>(null);
  const resizeFrameRef = useRef<number | null>(null);
  const pinFrameRef = useRef<number | null>(null);
  const arcParticleFrameRef = useRef<number | null>(null);
  const arcParticleRef = useRef<HTMLSpanElement>(null);
  const storyRailRef = useRef<HTMLElement>(null);
  const storyRailDragRef = useRef<StoryRailDragState | null>(null);
  const storyRailDidDragRef = useRef(false);
  const storyRailScrollTimerRef = useRef<number | undefined>(undefined);
  const storyRailProgrammaticTimerRef = useRef<number | undefined>(undefined);
  const storyRailProgrammaticRef = useRef(false);
  const storyRailProgrammaticTargetRef = useRef<string | null>(null);
  const viewRef = useRef<GlobeView>(INITIAL_VIEW);
  const baseScaleRef = useRef(1);
  const dragRef = useRef<DragState | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  const reducedMotionRef = useRef(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [storyRailDragging, setStoryRailDragging] = useState(false);
  const [visibleBubbleId, setVisibleBubbleId] = useState<string | null>(null);
  const placeGroups = useMemo(() => {
    const groups = new Map<string, PlaceGroup>();

    places.forEach((place) => {
      const key = coordinateKey(place.coordinates);
      const group = groups.get(key);
      if (group) {
        group.places.push(place);
        group.isExperience ||= Boolean(place.href);
        return;
      }
      groups.set(key, {
        id: place.id,
        coordinates: place.coordinates,
        location: place.location,
        isExperience: Boolean(place.href),
        places: [place],
      });
    });

    return Array.from(groups.values());
  }, [places]);
  const groupIdByPlaceId = useMemo(() => new Map(
    placeGroups.flatMap((group) => group.places.map((place) => [place.id, group.id])),
  ), [placeGroups]);
  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedId) ?? null,
    [places, selectedId],
  );
  const selectedGroup = selectedPlace
    ? placeGroups.find((group) => group.id === groupIdByPlaceId.get(selectedPlace.id)) ?? null
    : null;
  const bubblePlaces = useMemo(
    () => places.filter((place) => place.bubble),
    [places],
  );
  const visibleBubblePlace = bubblePlaces.find(
    (place) => place.id === visibleBubbleId,
  ) ?? null;
  const journeyArcs = useMemo(
    () => routes.map((route) => ({
      id: route.id,
      from: route.from,
      to: route.to,
      color: ROUTE_LIGHT_BLUE,
      height: ARC_APEX_HEIGHT,
    })),
    [routes],
  );

  useLayoutEffect(() => {
    const root = document.documentElement;
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

    const forceDarkTheme = () => {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      themeColor?.setAttribute("content", "#0a0a0a");
      try {
        if (localStorage.getItem(THEME_STORAGE_KEY) !== "dark") {
          localStorage.setItem(THEME_STORAGE_KEY, "dark");
        }
      } catch {}
    };

    forceDarkTheme();

    const classObserver = new MutationObserver(() => {
      if (!root.classList.contains("dark")) forceDarkTheme();
    });
    classObserver.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY && event.newValue !== "dark") {
        forceDarkTheme();
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      classObserver.disconnect();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const schedulePinGeometry = useCallback(() => {
    if (pinFrameRef.current !== null) cancelAnimationFrame(pinFrameRef.current);
    pinFrameRef.current = requestAnimationFrame(() => {
      pinFrameRef.current = null;
      const canvas = canvasRef.current;
      const root = rootRef.current;
      if (!canvas || !root) return;

      const canvasBounds = canvas.getBoundingClientRect();
      const centerX = canvasBounds.left + canvasBounds.width / 2;
      const centerY = canvasBounds.top + canvasBounds.height / 2;
      const globeRadius = canvasBounds.height * 0.4 * viewRef.current.scale;
      const markers = Array.from(
        root.querySelectorAll<HTMLElement>("[data-globe-marker]"),
      );
      const geometry = markers.map((marker) => {
        const bounds = marker.getBoundingClientRect();
        const x = bounds.left + bounds.width / 2;
        const y = bounds.top + bounds.height / 2;
        const distanceFromCenter = Math.hypot(x - centerX, y - centerY);
        const normalizedDistance = clamp(distanceFromCenter / globeRadius, 0, 1);
        return {
          angle: Math.atan2(y - centerY, x - centerX) + Math.PI / 2,
          surfaceScale: Math.max(0.14, Math.sqrt(1 - normalizedDistance ** 2)),
          pinHoverHeight: 62 * normalizedDistance,
        };
      });

      markers.forEach((marker, index) => {
        marker.style.setProperty("--surface-angle", `${geometry[index].angle}rad`);
        marker.style.setProperty("--surface-scale", `${geometry[index].surfaceScale}`);
        marker.style.setProperty("--pin-hover-height", `${geometry[index].pinHoverHeight}px`);
      });
    });
  }, []);

  const renderView = useCallback((view: GlobeView) => {
    viewRef.current = view;
    globeRef.current?.update(view);
    schedulePinGeometry();
  }, [schedulePinGeometry]);

  const cancelViewAnimation = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const animateView = useCallback(
    (target: GlobeView, duration = 850) => {
      cancelViewAnimation();
      const from = { ...viewRef.current };
      const phiDistance = shortestAngle(from.phi, target.phi);

      if (reducedMotionRef.current || document.visibilityState !== "visible") {
        renderView(target);
        return;
      }

      const startedAt = performance.now();
      const tick = (now: number) => {
        const progress = clamp((now - startedAt) / duration, 0, 1);
        const eased = easeOutQuint(progress);
        renderView({
          phi: from.phi + phiDistance * eased,
          theta: from.theta + (target.theta - from.theta) * eased,
          scale: from.scale + (target.scale - from.scale) * eased,
          opacity: from.opacity + (target.opacity - from.opacity) * eased,
        });

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          frameRef.current = null;
          renderView(target);
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    },
    [cancelViewAnimation, renderView],
  );

  const focusPlace = useCallback(
    (place: PersonalGlobePlace, scrollToStory = true) => {
      selectedIdRef.current = place.id;
      setSelectedId(place.id);
      animateView(targetViewFor(
        place,
        baseScaleRef.current,
        window.innerWidth <= RESPONSIVE_GLOBE_MAX_WIDTH,
      ));

      if (scrollToStory) {
        requestAnimationFrame(() => {
          const rail = storyRailRef.current;
          const card = rail?.querySelector<HTMLElement>(
            `[data-story-id="${CSS.escape(place.id)}"]`,
          );
          if (!rail || !card) return;
          const railBounds = rail.getBoundingClientRect();
          const cardBounds = card.getBoundingClientRect();
          storyRailProgrammaticRef.current = true;
          storyRailProgrammaticTargetRef.current = place.id;
          window.clearTimeout(storyRailProgrammaticTimerRef.current);
          const mobile = window.innerWidth < 768;
          const targetLeft = rail.scrollLeft
            + cardBounds.left
            - railBounds.left
            - (rail.clientWidth - cardBounds.width) / 2;

          if (mobile) {
            rail.classList.add("is-positioning");
            rail.scrollLeft = targetLeft;
            requestAnimationFrame(() => {
              if (storyRailProgrammaticTargetRef.current !== place.id) return;
              const settledRailBounds = rail.getBoundingClientRect();
              const settledCardBounds = card.getBoundingClientRect();
              rail.scrollLeft += settledCardBounds.left
                + settledCardBounds.width / 2
                - (settledRailBounds.left + settledRailBounds.width / 2);
              requestAnimationFrame(() => {
                if (storyRailProgrammaticTargetRef.current !== place.id) return;
                rail.classList.remove("is-positioning");
                storyRailProgrammaticRef.current = false;
                storyRailProgrammaticTargetRef.current = null;
                window.clearTimeout(storyRailProgrammaticTimerRef.current);
              });
            });
          } else {
            rail.scrollTo({
              left: targetLeft,
              behavior: reducedMotionRef.current ? "auto" : "smooth",
            });
          }
          storyRailProgrammaticTimerRef.current = window.setTimeout(() => {
            if (storyRailProgrammaticTargetRef.current !== place.id) return;
            rail.classList.remove("is-positioning");
            storyRailProgrammaticRef.current = false;
            storyRailProgrammaticTargetRef.current = null;
          }, mobile ? 1000 : reducedMotionRef.current ? 0 : 2200);
        });
      }
    },
    [animateView],
  );

  const snapToStoryIndex = useCallback(
    (index: number) => {
      const rail = storyRailRef.current;
      if (!rail) return;
      const cards = Array.from(
        rail.querySelectorAll<HTMLElement>("[data-story-id]"),
      );
      const card = cards[clamp(index, 0, cards.length - 1)];
      const story = places.find((place) => place.id === card?.dataset.storyId);
      if (!card || !story) return;

      const railBounds = rail.getBoundingClientRect();
      const cardBounds = card.getBoundingClientRect();
      const targetLeft = rail.scrollLeft
        + cardBounds.left
        - railBounds.left
        - (rail.clientWidth - cardBounds.width) / 2;
      if (Math.abs(rail.scrollLeft - targetLeft) > 1) {
        rail.scrollTo({
          left: targetLeft,
          behavior: reducedMotionRef.current ? "auto" : "smooth",
        });
      }
      if (selectedIdRef.current !== story.id) focusPlace(story, false);
    },
    [focusPlace, places],
  );

  const handleStoryRailScroll = useCallback(() => {
    const rail = storyRailRef.current;
    if (storyRailProgrammaticRef.current && rail) return;
    if (
      window.innerWidth >= 768
      || storyRailDragRef.current
    ) return;
    window.clearTimeout(storyRailScrollTimerRef.current);
    storyRailScrollTimerRef.current = window.setTimeout(() => {
      const rail = storyRailRef.current;
      if (!rail) return;
      snapToStoryIndex(getClosestStoryIndex(rail));
    }, 120);
  }, [snapToStoryIndex]);

  useEffect(() => () => {
    window.clearTimeout(storyRailScrollTimerRef.current);
    window.clearTimeout(storyRailProgrammaticTimerRef.current);
  }, []);

  const clearFocus = useCallback(() => {
    setSelectedId(null);
    animateView({ ...viewRef.current, scale: baseScaleRef.current, opacity: 1 }, 520);
  }, [animateView]);

  useEffect(() => {
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedIdRef.current) {
        event.preventDefault();
        clearFocus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = bodyOverflow;
    };
  }, [clearFocus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | undefined;

    const updateSize = () => {
      if (!canvas || !globeRef.current) return;
      const bounds = canvas.getBoundingClientRect();
      const compact = window.innerWidth < 768;
      const nextBaseScale = globeScaleForViewport(bounds.width, bounds.height);
      const dpr = compact ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      globeRef.current.update({
        width: Math.max(1, Math.round(bounds.width * dpr)),
        height: Math.max(1, Math.round(bounds.height * dpr)),
        devicePixelRatio: dpr,
        mapSamples: compact ? 6500 : 9500,
      });
      if (Math.abs(nextBaseScale - baseScaleRef.current) > 0.001) {
        baseScaleRef.current = nextBaseScale;
        const selectedPlaceId = selectedIdRef.current;
        const selected = selectedPlaceId
          ? places.find((place) => place.id === selectedPlaceId)
          : null;
        renderView(selected
          ? targetViewFor(
            selected,
            nextBaseScale,
            window.innerWidth <= RESPONSIVE_GLOBE_MAX_WIDTH,
          )
          : { ...viewRef.current, scale: nextBaseScale });
      }
      schedulePinGeometry();
    };

    const scheduleSizeUpdate = () => {
      if (resizeFrameRef.current !== null) cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = requestAnimationFrame(updateSize);
    };

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setFallback(true);
      setReady(false);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canvasBounds = canvas.getBoundingClientRect();
    const initialBaseScale = globeScaleForViewport(
      canvasBounds.width,
      canvasBounds.height,
    );
    baseScaleRef.current = initialBaseScale;
    const skipEntranceAnimation = document.documentElement.hasAttribute(
      ATLAS_LANGUAGE_SWITCH_ATTRIBUTE,
    );
    const startingView = skipEntranceAnimation
      ? { ...INITIAL_VIEW, scale: initialBaseScale, opacity: 1 }
      : { ...INITIAL_VIEW, scale: initialBaseScale * 0.78 };
    viewRef.current = startingView;

    void import("cobe")
      .then(({ default: createGlobe }) => {
        if (cancelled) return;
        if (skipEntranceAnimation) {
          document.documentElement.removeAttribute(ATLAS_LANGUAGE_SWITCH_ATTRIBUTE);
        }
        const bounds = canvas.getBoundingClientRect();
        const compact = window.innerWidth < 768;
        const dpr = compact ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
        const options: COBEOptions = {
          width: Math.max(1, Math.round(bounds.width * dpr)),
          height: Math.max(1, Math.round(bounds.height * dpr)),
          devicePixelRatio: dpr,
          phi: startingView.phi,
          theta: startingView.theta,
          scale: startingView.scale,
          opacity: startingView.opacity,
          dark: 1,
          diffuse: 1.6,
          mapSamples: compact ? 6500 : 9500,
          mapBrightness: 9,
          mapBaseBrightness: 0.012,
          baseColor: [0.07, 0.07, 0.075],
          glowColor: [0.12, 0.08, 0.035],
          markerColor: ORANGE,
          markerElevation: 0,
          markers: placeGroups.map((group) => ({
            id: group.id,
            location: group.coordinates,
            size: 0,
            color: ORANGE,
          })),
          arcs: journeyArcs,
          arcColor: ROUTE_LIGHT_BLUE,
          arcWidth: compact ? 0.9 : 0.16,
          arcHeight: 0.1,
          context: {
            alpha: true,
            antialias: !compact,
            powerPreference: "low-power",
          },
        };

        globeRef.current = createGlobe(canvas, options);
        resizeObserver = new ResizeObserver(scheduleSizeUpdate);
        resizeObserver.observe(canvas);
        setReady(true);
        if (skipEntranceAnimation) {
          schedulePinGeometry();
        } else {
          animateView({ ...INITIAL_VIEW, scale: initialBaseScale, opacity: 1 }, 900);
        }
      })
      .catch((error) => {
        console.error("[personal-globe] Failed to initialize COBE", error);
        if (!cancelled) {
          document.documentElement.removeAttribute(ATLAS_LANGUAGE_SWITCH_ATTRIBUTE);
          setFallback(true);
        }
      });

    return () => {
      cancelled = true;
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      resizeObserver?.disconnect();
      if (resizeFrameRef.current !== null) cancelAnimationFrame(resizeFrameRef.current);
      if (pinFrameRef.current !== null) cancelAnimationFrame(pinFrameRef.current);
      cancelViewAnimation();
      globeRef.current?.destroy();
      globeRef.current = null;
    };
  }, [animateView, cancelViewAnimation, journeyArcs, placeGroups, places, renderView, schedulePinGeometry]);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.update({
      markers: placeGroups.map((group) => ({
        id: group.id,
        location: group.coordinates,
        size: 0,
        color: ORANGE,
      })),
      arcs: journeyArcs,
    });
    schedulePinGeometry();
  }, [journeyArcs, placeGroups, ready, schedulePinGeometry, selectedId]);

  useEffect(() => {
    if (!ready) return;
    globeRef.current?.update({
      dark: 1,
      diffuse: 1.6,
      mapBrightness: 9,
      mapBaseBrightness: 0.012,
      baseColor: [0.07, 0.07, 0.075],
      glowColor: [0.12, 0.08, 0.035],
    });
  }, [ready]);

  useEffect(() => {
    const particle = arcParticleRef.current;
    const canvas = canvasRef.current;
    if (!ready || !particle || !canvas || journeyArcs.length === 0) return;
    if (reducedMotionRef.current) {
      particle.style.opacity = "0";
      return;
    }

    const startedAt = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.max(0, now - startedAt);
      const launchElapsed = elapsed % ARC_PARTICLE_INTERVAL;

      if (
        document.visibilityState !== "visible"
        || launchElapsed > ARC_PARTICLE_DURATION
      ) {
        particle.style.opacity = "0";
      } else {
        const launchIndex = Math.floor(elapsed / ARC_PARTICLE_INTERVAL);
        const arc = journeyArcs[launchIndex % journeyArcs.length];
        const progress = clamp(launchElapsed / ARC_PARTICLE_DURATION, 0, 1);
        const point = pointAlongArc(arc.from, arc.to, progress, arc.height);
        const projected = projectGlobePoint(
          point,
          viewRef.current,
          canvas.clientWidth,
          canvas.clientHeight,
        );
        const fade = Math.min(1, progress / 0.08, (1 - progress) / 0.08);
        const scale = 0.86 + Math.sin(Math.PI * progress) * 0.22;
        particle.style.opacity = projected.visible ? `${fade}` : "0";
        particle.style.transform = `translate3d(${projected.x}px, ${projected.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }

      arcParticleFrameRef.current = requestAnimationFrame(tick);
    };

    arcParticleFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (arcParticleFrameRef.current !== null) {
        cancelAnimationFrame(arcParticleFrameRef.current);
        arcParticleFrameRef.current = null;
      }
      particle.style.opacity = "0";
    };
  }, [journeyArcs, ready]);

  useEffect(() => {
    if (selectedId || dragging || bubblePlaces.length === 0) {
      setVisibleBubbleId(null);
      return;
    }

    let cancelled = false;
    let showTimer: number | undefined;
    let hideTimer: number | undefined;
    let lastId: string | null = null;

    const scheduleBubble = () => {
      showTimer = window.setTimeout(() => {
        if (cancelled) return;
        if (document.visibilityState !== "visible") {
          scheduleBubble();
          return;
        }

        const candidates = bubblePlaces.filter((place) => {
          const markerId = groupIdByPlaceId.get(place.id) ?? place.id;
          const marker = rootRef.current?.querySelector<HTMLElement>(
            `[data-globe-marker="${markerId}"]`,
          );
          return marker && Number.parseFloat(getComputedStyle(marker).opacity) > 0.55;
        });
        if (candidates.length === 0) {
          scheduleBubble();
          return;
        }

        const freshCandidates = candidates.filter((place) => place.id !== lastId);
        const pool = freshCandidates.length > 0 ? freshCandidates : candidates;
        const place = pool[Math.floor(Math.random() * pool.length)];
        lastId = place.id;
        setVisibleBubbleId(place.id);

        hideTimer = window.setTimeout(() => {
          setVisibleBubbleId(null);
          scheduleBubble();
        }, 2800);
      }, 1700 + Math.random() * 2200);
    };

    scheduleBubble();
    return () => {
      cancelled = true;
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [bubblePlaces, dragging, groupIdByPlaceId, selectedId]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (fallback || event.button !== 0) return;
    cancelViewAnimation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      phi: viewRef.current.phi,
      theta: viewRef.current.theta,
    };
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const nextView = {
      ...viewRef.current,
      phi: drag.phi + (event.clientX - drag.x) / 180,
      theta: clamp(drag.theta + (event.clientY - drag.y) / 240, -1.25, 1.25),
    };
    renderView(nextView);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
  };

  const handleStoryRailPointerDown = (
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    if (event.button !== 0) return;
    storyRailProgrammaticRef.current = false;
    storyRailProgrammaticTargetRef.current = null;
    window.clearTimeout(storyRailProgrammaticTimerRef.current);
    event.currentTarget.classList.remove("is-positioning");
    storyRailDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
      startIndex: getClosestStoryIndex(event.currentTarget),
      distance: 0,
    };
    storyRailDidDragRef.current = false;
  };

  const handleStoryRailPointerMove = (
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    const drag = storyRailDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const distance = event.clientX - drag.startX;
    drag.distance = distance;
    if (Math.abs(distance) > 3) {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      storyRailDidDragRef.current = true;
      setStoryRailDragging(true);
    }
    event.currentTarget.scrollLeft = drag.scrollLeft - distance;
  };

  const finishStoryRailDrag = (
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    const drag = storyRailDragRef.current;
    if (drag?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    storyRailDragRef.current = null;
    setStoryRailDragging(false);
    if (window.innerWidth < 768 && storyRailDidDragRef.current) {
      const direction = drag.distance < -18 ? 1 : drag.distance > 18 ? -1 : 0;
      requestAnimationFrame(() => snapToStoryIndex(drag.startIndex + direction));
    }
    requestAnimationFrame(() => {
      storyRailDidDragRef.current = false;
    });
  };

  return (
    <div ref={rootRef} className="personal-globe-page">
      <div
        className="ambient-backdrop ambient-backdrop--atlas"
        aria-hidden="true"
      />
      <div className="personal-globe-overlay__wash" aria-hidden="true" />
      <main
        className={`personal-globe-experience ${selectedPlace ? "is-focused" : ""} ${fallback ? "is-fallback" : ""}`}
        aria-label={isEn ? "My Atlas" : "我的地图集"}
      >
        <div
          className={`personal-globe-visual ${dragging ? "is-dragging" : ""}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
        >
          <canvas ref={canvasRef} className="personal-globe-canvas" aria-hidden="true" />
          <span
            ref={arcParticleRef}
            className="personal-globe-arc-particle"
            aria-hidden="true"
          />

          {!ready && !fallback ? (
            <div className="personal-globe-loading" role="status">
              <span />
              {isEn ? "Preparing the globe…" : "正在准备地球…"}
            </div>
          ) : null}

          {!fallback
            ? placeGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className={`personal-globe-marker group ${group.isExperience ? "is-experience" : ""} ${selectedGroup?.id === group.id ? "is-selected" : ""}`}
                  data-globe-marker={group.id}
                  data-cursor="arrow"
                  style={
                    {
                      positionAnchor: `--cobe-${group.id}`,
                      "--marker-visibility": `var(--cobe-visible-${group.id}, 0)`,
                      "--surface-angle": "0rad",
                      "--surface-scale": "1",
                      "--pin-hover-height": "0px",
                    } as MarkerStyle
                  }
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    focusPlace(group.places[0]);
                  }}
                  aria-label={group.location}
                  aria-describedby={`globe-marker-tooltip-${group.id}`}
                  aria-pressed={selectedGroup?.id === group.id}
                >
                  <span className="personal-globe-marker__foot" aria-hidden="true" />
                  <span className="personal-globe-marker__pin" aria-hidden="true" />
                  <Tooltip
                    id={`globe-marker-tooltip-${group.id}`}
                    className="personal-globe-marker__tooltip"
                  >
                    {shortLocation(group.location)}
                  </Tooltip>
                </button>
              ))
            : null}

          {visibleBubblePlace?.bubble ? (
            <button
              type="button"
              className="personal-globe-bubble"
              style={
                {
                  positionAnchor: `--cobe-${groupIdByPlaceId.get(visibleBubblePlace.id) ?? visibleBubblePlace.id}`,
                  "--marker-visibility": `var(--cobe-visible-${groupIdByPlaceId.get(visibleBubblePlace.id) ?? visibleBubblePlace.id}, 0)`,
                  "--surface-angle": "0rad",
                  "--surface-scale": "1",
                  "--pin-hover-height": "0px",
                } as MarkerStyle
              }
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                focusPlace(visibleBubblePlace);
              }}
              aria-label={`${visibleBubblePlace.location}: ${visibleBubblePlace.bubble}`}
            >
              {visibleBubblePlace.bubble}
            </button>
          ) : null}

          {fallback ? (
            <div className="personal-globe-fallback">
              <RiMapPin2Fill aria-hidden="true" />
              <p>
                {isEn
                  ? "The 3D globe is unavailable, but every place is still here to explore."
                  : "当前设备无法显示 3D 地球，但你仍然可以探索所有地点。"}
              </p>
            </div>
          ) : null}
        </div>

        <div className="personal-globe-point-hint" aria-hidden="true">
          <RiMapPin2Fill />
          <span>{isEn ? "Click a point to explore" : "点击点位，探索故事"}</span>
        </div>

        <nav
          ref={storyRailRef}
          className={`personal-globe-story-rail ${storyRailDragging ? "is-dragging" : ""}`}
          aria-label={isEn ? "Stories" : "故事卡片"}
          onPointerDown={handleStoryRailPointerDown}
          onPointerMove={handleStoryRailPointerMove}
          onPointerUp={finishStoryRailDrag}
          onPointerCancel={finishStoryRailDrag}
          onScroll={handleStoryRailScroll}
        >
          <div className="personal-globe-story-rail__track">
            {places.map((story) => {
              const isSelected = selectedId === story.id;
              return (
                <article
                  key={story.id}
                  className={`personal-globe-story-card liquid-glass-panel ${isSelected ? "is-selected" : ""} ${story.href || story.instagram ? "has-actions" : ""} ${story.image ? "has-media" : ""}`}
                  data-story-id={story.id}
                  aria-label={story.title}
                >
                  <button
                    type="button"
                    className="personal-globe-story-card__focus"
                    onClick={() => {
                      if (!storyRailDidDragRef.current) {
                        focusPlace(story, false);
                      }
                    }}
                    aria-label={isEn
                      ? `Focus ${story.title} on the globe`
                      : `在地球上聚焦${story.title}`}
                    aria-pressed={isSelected}
                  >
                    {story.image ? (
                      <span className="personal-globe-story-card__media">
                        <img
                          src={story.image}
                          alt=""
                          loading="eager"
                          decoding="async"
                        />
                      </span>
                    ) : null}
                    <span className="personal-globe-story-card__body">
                      <span className="personal-globe-story-card__title">
                        {story.title}
                      </span>
                      <span className="personal-globe-story-card__copy">
                        {story.content}
                      </span>
                    </span>
                  </button>
                  <div
                    className="personal-globe-story-card__divider"
                    aria-hidden="true"
                  />
                  <div className="personal-globe-story-card__footer">
                    <span className="personal-globe-story-card__location">
                      {story.location}
                    </span>
                    <span className="personal-globe-story-card__time">
                      {story.time}
                    </span>
                    {story.href || story.instagram ? (
                      <span className="personal-globe-story-card__actions">
                        {story.href ? (
                          <Link
                            href={story.href}
                            className="personal-globe-story-card__link"
                          >
                            {isEn ? "View details" : "查看详情"}
                            <RiArrowRightLine aria-hidden="true" />
                          </Link>
                        ) : null}
                        {story.instagram ? (
                          <a
                            href={story.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="personal-globe-story-card__link"
                            aria-label={isEn
                              ? `View ${story.title} on Instagram`
                              : `在 Instagram 查看${story.title}`}
                          >
                            Instagram
                            <RiArrowRightUpLine aria-hidden="true" />
                          </a>
                        ) : null}
                      </span>
                    ) : (
                      <span aria-hidden="true" />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </nav>

        <div className="personal-globe-selection-bar" aria-live="polite">
          {selectedPlace ? (
            <>
              <span>{selectedPlace.location}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedPlace.time}</span>
            </>
          ) : null}
        </div>

      </main>
    </div>
  );
}
