type HomeReturnState = {
  homePathname: string;
  targetPathname: string;
};

type HomeViewState = {
  pathname: string;
  scrollY: number;
  expanded: Record<string, boolean>;
};

const RETURN_STATE_KEY = "__siteHomeReturn";
const VIEW_STATE_KEY = "__siteHomeView";
const VIEW_SESSION_PREFIX = "site:home-view:";

let pendingHomeReturn: HomeReturnState | null = null;

export function getHomePathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length === 1 ? `/${segments[0]}` : null;
}

export function markHomeDeparture(
  homePathname: string,
  targetPathname: string,
) {
  captureHomeScrollPosition(homePathname);
  pendingHomeReturn = { homePathname, targetPathname };
}

export function clearPendingHomeDeparture() {
  pendingHomeReturn = null;
}

export function syncHomeReturnHistoryState(currentPathname: string) {
  const currentState = window.history.state ?? {};

  if (pendingHomeReturn?.targetPathname === currentPathname) {
    window.history.replaceState(
      {
        ...currentState,
        [RETURN_STATE_KEY]: pendingHomeReturn,
      },
      "",
    );
    pendingHomeReturn = null;
    return;
  }

  pendingHomeReturn = null;
  const existingMarker = currentState[RETURN_STATE_KEY] as
    | HomeReturnState
    | undefined;
  if (!existingMarker || existingMarker.targetPathname === currentPathname) {
    return;
  }

  const nextState = { ...currentState };
  delete nextState[RETURN_STATE_KEY];
  window.history.replaceState(nextState, "");
}

export function canReturnToHomeHistory(
  currentPathname: string,
  homePathname: string,
) {
  const marker = window.history.state?.[RETURN_STATE_KEY] as
    | HomeReturnState
    | undefined;

  return (
    window.history.length > 1 &&
    marker?.homePathname === homePathname &&
    marker.targetPathname === currentPathname
  );
}

function readHomeViewState(pathname: string): HomeViewState | null {
  if (typeof window === "undefined") return null;

  const viewState = window.history.state?.[VIEW_STATE_KEY] as
    | HomeViewState
    | undefined;
  if (viewState?.pathname === pathname) return viewState;

  try {
    const stored = window.sessionStorage.getItem(
      `${VIEW_SESSION_PREFIX}${pathname}`,
    );
    if (!stored) return null;
    const sessionViewState = JSON.parse(stored) as HomeViewState;
    return sessionViewState.pathname === pathname ? sessionViewState : null;
  } catch {
    return null;
  }
}

function writeHomeViewState(
  pathname: string,
  update: (current: HomeViewState) => HomeViewState,
) {
  const historyState = window.history.state ?? {};
  const current = readHomeViewState(pathname) ?? {
    pathname,
    scrollY: window.scrollY,
    expanded: {},
  };

  const nextViewState = update(current);
  window.history.replaceState(
    {
      ...historyState,
      [VIEW_STATE_KEY]: nextViewState,
    },
    "",
  );
  try {
    window.sessionStorage.setItem(
      `${VIEW_SESSION_PREFIX}${pathname}`,
      JSON.stringify(nextViewState),
    );
  } catch {
    // History state remains the primary source if storage is unavailable.
  }
}

export function captureHomeScrollPosition(pathname: string) {
  writeHomeViewState(pathname, (current) => ({
    ...current,
    scrollY: window.scrollY,
  }));
}

export function readHomeSectionExpanded(
  pathname: string,
  sectionKey: string,
) {
  if (
    typeof document === "undefined" ||
    !document.documentElement.hasAttribute("data-site-hydrated")
  ) {
    return false;
  }

  return readHomeViewState(pathname)?.expanded[sectionKey] ?? false;
}

export function writeHomeSectionExpanded(
  pathname: string,
  sectionKey: string,
  expanded: boolean,
) {
  writeHomeViewState(pathname, (current) => ({
    ...current,
    expanded: {
      ...current.expanded,
      [sectionKey]: expanded,
    },
  }));
}

export function readHomeScrollPosition(pathname: string) {
  if (
    typeof document === "undefined" ||
    !document.documentElement.hasAttribute("data-site-hydrated")
  ) {
    return null;
  }

  return readHomeViewState(pathname)?.scrollY ?? null;
}
