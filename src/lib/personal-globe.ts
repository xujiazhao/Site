import fs from "fs";
import path from "path";
import matter from "gray-matter";

type LocalizedValue = string | {
  en?: string;
  zh?: string;
};

type PersonalGlobeDocumentPlace = {
  coordinates?: unknown;
  location?: LocalizedValue;
  time?: LocalizedValue;
  title?: LocalizedValue;
  bubble?: LocalizedValue;
  image?: unknown;
  content?: LocalizedValue;
  href?: LocalizedValue;
  instagram?: unknown;
};

type PersonalGlobeDocumentRouteEndpoint = {
  coordinates?: unknown;
  location?: LocalizedValue;
};

type PersonalGlobeDocumentRoute = {
  from?: PersonalGlobeDocumentRouteEndpoint;
  to?: PersonalGlobeDocumentRouteEndpoint;
};

export type PersonalGlobePlace = {
  id: string;
  coordinates: [latitude: number, longitude: number];
  location: string;
  time: string;
  title: string;
  bubble?: string;
  image?: string;
  content: string;
  href?: string;
  instagram?: string;
};

export type PersonalGlobeRoute = {
  id: string;
  from: [latitude: number, longitude: number];
  to: [latitude: number, longitude: number];
  fromLocation: string;
  toLocation: string;
};

export type PersonalGlobeData = {
  places: PersonalGlobePlace[];
  routes: PersonalGlobeRoute[];
};

const PERSONAL_GLOBE_PATH = path.join(process.cwd(), "content/personal-globe.md");

function localize(value: LocalizedValue | undefined, lang: string) {
  if (typeof value === "string") return value;
  if (!value) return "";
  return lang === "en" ? (value.en ?? value.zh ?? "") : (value.zh ?? value.en ?? "");
}

function isCoordinates(value: unknown): value is [number, number] {
  return Array.isArray(value)
    && value.length === 2
    && value.every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate));
}

function getInstagramUrl(value: unknown) {
  if (typeof value !== "string" || !value) return undefined;

  try {
    const url = new URL(value);
    const isInstagramHost = url.hostname === "instagram.com"
      || url.hostname === "www.instagram.com";
    const isPost = /^\/(?:p|reel|tv)\/[^/]+\/?/.test(url.pathname);
    return url.protocol === "https:" && isInstagramHost && isPost
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export function getPersonalGlobeData(lang: string): PersonalGlobeData {
  const source = fs.readFileSync(PERSONAL_GLOBE_PATH, "utf8");
  const { data } = matter(source);
  const places = Array.isArray(data.places) ? data.places as PersonalGlobeDocumentPlace[] : [];
  const routes = Array.isArray(data.routes) ? data.routes as PersonalGlobeDocumentRoute[] : [];

  const localizedPlaces = places.flatMap((place, index) => {
    if (!isCoordinates(place.coordinates)) return [];

    const location = localize(place.location, lang);
    const time = localize(place.time, lang);
    const title = localize(place.title, lang);
    const content = localize(place.content, lang);
    const rawHref = localize(place.href, lang);
    if (!location || !time || !title || !content) return [];

    return [{
      id: `place-${index + 1}`,
      coordinates: place.coordinates,
      location,
      time,
      title,
      bubble: localize(place.bubble, lang) || undefined,
      image: typeof place.image === "string" && place.image ? place.image : undefined,
      content,
      href: rawHref ? rawHref.replaceAll("{lang}", lang) : undefined,
      instagram: getInstagramUrl(place.instagram),
    }];
  });

  const localizedRoutes = routes.flatMap((route, index) => {
    if (!isCoordinates(route.from?.coordinates) || !isCoordinates(route.to?.coordinates)) {
      return [];
    }

    const fromLocation = localize(route.from.location, lang);
    const toLocation = localize(route.to.location, lang);
    if (!fromLocation || !toLocation) return [];

    return [{
      id: `route-${index + 1}`,
      from: route.from.coordinates,
      to: route.to.coordinates,
      fromLocation,
      toLocation,
    }];
  });

  return {
    places: localizedPlaces,
    routes: localizedRoutes,
  };
}
