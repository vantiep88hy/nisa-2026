// shared/tokens.ts
// Design tokens — single source of truth
// Mirror of assets/css/tokens.css (kept for reference)

export const colors = {
  // Background
  bgPrimary:   "#0D1B2A",
  bgCard:      "#1A2D42",
  bgCardAlt:   "#0F2336",

  // Text
  textPrimary:   "#FFFFFF",
  textSecondary: "#A8B8C8",
  textMuted:     "#5A7A8A",

  // Accent
  accentGold:  "#F5A623",
  accentGreen: "#00C48C",
  accentBlue:  "#4A9EFF",

  // UI
  border:        "#1E3A52",
  progressBg:    "#1A2D42",
  progressFill:  "#4A9EFF",
} as const;

export const font = {
  family: "'Noto Sans JP', sans-serif",
  sizeBadge:    18,
  sizeSubtitle: 22,
  sizeBody:     28,
  sizeTitle:    42,
  sizeNumber:   96,
  sizeNumberMin: 64,
} as const;

export const spacing = {
  safeTop:    80,
  safeLeft:   120,
  safeRight:  120,
  safeBottom: 140,
  progressH:  8,
  radius:     12,
  radiusSm:   6,
} as const;

export const shadow = {
  soft: "0 8px 24px rgba(0,0,0,0.25)",
} as const;

export const zIndex = {
  background:  0,
  decoration:  10,
  card:        20,
  text:        30,
  cta:         40,
  progress:    50,
} as const;

// Canvas
export const CANVAS_W = 1920;
export const CANVAS_H = 1080;
export const FPS      = 30;

// Safe zone derived
export const SAFE_W = CANVAS_W - spacing.safeLeft - spacing.safeRight; // 1680
export const SAFE_H = CANVAS_H - spacing.safeTop  - spacing.safeBottom; // 860
