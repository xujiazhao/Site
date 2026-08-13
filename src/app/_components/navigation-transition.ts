export const NAVIGATION_EVENT = "site:navigate-with-loader";

export type NavigationRequest = {
  navigate: () => void;
  targetPathname?: string | null;
};

export function navigateWithPageLoader({
  navigate,
  targetPathname = null,
}: NavigationRequest) {
  window.dispatchEvent(
    new CustomEvent<NavigationRequest>(NAVIGATION_EVENT, {
      detail: { navigate, targetPathname },
    }),
  );
}
