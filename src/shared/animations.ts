// src/shared/animations.ts
import { interpolate, spring } from "remotion";

export const OPACITY = {
  HIDDEN: 0,
  DIMMED: 0.6,
  ACTIVE: 1.0,
} as const;

export function getElementFrames(
  slideStartFrame: number,
  slideDuration: number,
  index: number,
  total: number,
  weights: number[] = [],
  startPercent = 0.15,
  endPercent   = 0.60
) {
  const totalElements = total > 0 ? total : 1;
  const slot          = (endPercent - startPercent) / totalElements;
  const revealPercent = startPercent + slot * index;
  const activeFrame   = slideStartFrame + slideDuration * revealPercent;

  let dimmedFrame: number | null = null;
  const validWeights = Array.isArray(weights) && weights.length === total && typeof weights[0] === 'number' 
    ? weights 
    : Array(total).fill(1);

  if (index < total - 1) {
    const maxWeight        = Math.max(...validWeights, 1);
    const weight           = validWeights[index] ?? 1;
    const nextReveal       = startPercent + slot * (index + 1);
    const gap              = nextReveal - revealPercent;
    const holdFrac         = weight / maxWeight;
    const dimmedPercent    = revealPercent + gap * holdFrac;
    dimmedFrame            = slideStartFrame + slideDuration * dimmedPercent;
  }
  return { activeFrame, dimmedFrame };
}

export function elementOpacity(frame: number, activeFrame: number, dimmedFrame: number | null): number {
  if (frame < activeFrame) return OPACITY.HIDDEN;
  if (dimmedFrame !== null && frame >= dimmedFrame) return OPACITY.DIMMED;
  return OPACITY.ACTIVE;
}

export function slideIn(frame: number, activeFrame: number, fps: number = 30, distance = 24) {
  const f = Math.max(0, frame - activeFrame);
  const progress = spring({
    frame: f,
    fps: typeof fps === "number" ? fps : 30,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    translateY: interpolate(progress, [0, 1], [distance, 0]),
  };
}

export function useFadeIn(frame: number, activeFrame: number, durationFrames = 12): number {
  return interpolate(frame, [activeFrame, activeFrame + durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function usePopIn(frame: number, activeFrame: number, fps: number = 30) {
  const f = Math.max(0, frame - activeFrame);
  const progress = spring({
    frame: f,
    fps: typeof fps === "number" ? fps : 30,
    config: { damping: 10, stiffness: 200, mass: 0.6 },
  });
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    scale:   interpolate(progress, [0, 1], [0.6, 1]),
  };
}

// ✅ ĐÃ SỬA: Đổi vị trí tham số direction lên trước fps để tương thích 100% với file Comparison.tsx cũ của bạn!
export function useSlideFromSide(
  frame: number,
  activeFrame: number,
  direction: "left" | "right" = "left",
  fps: any = 30,
  distance = 30
) {
  const f = Math.max(0, frame - activeFrame);
  
  // Tránh việc file cũ truyền nhầm chuỗi hướng vào biến fps
  const dynamicFps = typeof fps === "number" ? fps : 30;

  const progress = spring({
    frame: f,
    fps: dynamicFps,
    config: { damping: 14, stiffness: 100, mass: 0.9 },
  });

  const sign = direction === "left" ? -1 : 1;

  return {
    opacity:    interpolate(progress, [0, 1], [0, 1]),
    translateX: interpolate(progress, [0, 1], [sign * distance, 0]),
  };
}

export function useDrawLine(frame: number, activeFrame: number, durationFrames = 12): number {
  return interpolate(frame, [activeFrame, activeFrame + durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function useCountUp(targetStr: string, activeFrame: number, frame: number, durationFrames: number): string {
  if (!targetStr) return "";
  const clean = String(targetStr).replace(/,/g, "");
  const match = clean.match(/^([\d.]+)(.*)/);
  if (!match) return String(targetStr);
  const targetNum = parseFloat(match[1]);
  const suffix    = match[2];
  const progress = interpolate(frame, [activeFrame, activeFrame + durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased   = 1 - Math.pow(1 - progress, 3);
  const current = targetNum * eased;
  const formatted = targetNum >= 1000 ? Math.round(current).toLocaleString("ja-JP") : targetNum >= 10 ? String(Math.round(current)) : current.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  return formatted + suffix;
}

export function splitHighlight(text: string, highlight: string | null): Array<{ text: string; hl: boolean }> {
  if (!text) return [];
  if (!highlight || !text.includes(highlight)) return [{ text, hl: false }];
  const idx = text.indexOf(highlight);
  return [
    { text: text.slice(0, idx),                 hl: false },
    { text: highlight,                          hl: true  },
    { text: text.slice(idx + highlight.length), hl: false },
  ];
}