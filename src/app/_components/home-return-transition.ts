const LAYER_SELECTOR = "[data-language-transition-layer]";
const FADE_DURATION = 100;

let pendingFadeIn = false;
let activeAnimation: Animation | null = null;

function getLayer() {
  return document.querySelector<HTMLElement>(LAYER_SELECTOR);
}

function reduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export async function fadeOutForHomeReturn() {
  if (pendingFadeIn) return false;
  if (reduceMotion()) return true;

  const layer = getLayer();
  if (!layer) return true;

  pendingFadeIn = true;
  activeAnimation?.cancel();
  const currentOpacity = Number.parseFloat(getComputedStyle(layer).opacity);
  const animation = layer.animate(
    [
      { opacity: Number.isFinite(currentOpacity) ? currentOpacity : 1 },
      { opacity: 0 },
    ],
    {
      duration: FADE_DURATION,
      easing: "linear",
      fill: "forwards",
    },
  );
  activeAnimation = animation;

  try {
    await animation.finished;
  } catch {
    return false;
  }

  return true;
}

export function fadeInAfterHomeReturn() {
  if (!pendingFadeIn) return;
  pendingFadeIn = false;

  const layer = getLayer();
  if (!layer || reduceMotion()) {
    activeAnimation?.cancel();
    activeAnimation = null;
    return;
  }

  layer.style.opacity = "0";
  activeAnimation?.cancel();
  const animation = layer.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: FADE_DURATION,
    easing: "linear",
    fill: "forwards",
  });
  activeAnimation = animation;

  void animation.finished.then(
    () => {
      if (activeAnimation !== animation) return;
      activeAnimation = null;
      animation.cancel();
      layer.style.removeProperty("opacity");
    },
    () => undefined,
  );
}
