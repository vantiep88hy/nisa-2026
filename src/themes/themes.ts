// themes/themes.ts
// Tầng 3: Chỉ thay đổi màu sắc — tất cả component dùng chung interface này

export interface ThemeTokens {
  /** Màu nền chính của slide (1920×1080 canvas) */
  bgBase: string;
  /** Màu nền card/panel */
  bgCard: string;
  /** Màu nền card khi active/hover */
  bgCardActive: string;

  /** Màu accent chính (icon, underline, border active) */
  accent: string;
  /** Màu highlight (chữ nổi bật, số lớn, từ khóa) */
  highlight: string;
  /** Màu danger/warning (cột cons, cảnh báo) */
  danger: string;
  /** Màu success (cột pros, checkmark) */
  success: string;

  /** Màu chữ chính */
  textPrimary: string;
  /** Màu chữ phụ */
  textSecondary: string;
  /** Màu border mặc định */
  border: string;
  /** Màu border khi active */
  borderActive: string;

  /** Màu gradient progress bar (dạng CSS linear-gradient string) */
  progressGradient: string;
  /** Box shadow khi active */
  shadowActive: string;
}

// ─────────────────────────────────────────────────────────────
// NISA Theme — Nhật Bản, đầu tư, tin tưởng
// Navy nền + Sky blue accent + Amber highlight
// ─────────────────────────────────────────────────────────────
export const NisaTheme: ThemeTokens = {
  bgBase:        "#0a0f1e",
  bgCard:        "rgba(15, 23, 42, 0.85)",
  bgCardActive:  "rgba(56, 189, 248, 0.08)",

  accent:        "#38bdf8",
  highlight:     "#f59e0b",
  danger:        "#ef4444",
  success:       "#22c55e",

  textPrimary:   "#ffffff",
  textSecondary: "#94a3b8",
  border:        "rgba(255, 255, 255, 0.15)",
  borderActive:  "#38bdf8",

  progressGradient: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
  shadowActive:  "0 20px 40px rgba(56, 189, 248, 0.2)",
};

// ─────────────────────────────────────────────────────────────
// MLB Theme — Thể thao, năng lượng, kịch tính
// Navy nền + Red accent + Gold highlight
// ─────────────────────────────────────────────────────────────
export const MlbTheme: ThemeTokens = {
  bgBase:        "#0d0d1a",
  bgCard:        "rgba(20, 20, 40, 0.9)",
  bgCardActive:  "rgba(230, 57, 70, 0.08)",

  accent:        "#e63946",
  highlight:     "#ffd60a",
  danger:        "#ff6b6b",
  success:       "#06d6a0",

  textPrimary:   "#ffffff",
  textSecondary: "#8892a4",
  border:        "rgba(255, 255, 255, 0.12)",
  borderActive:  "#e63946",

  progressGradient: "linear-gradient(90deg, #e63946, #c1121f)",
  shadowActive:  "0 20px 40px rgba(230, 57, 70, 0.2)",
};

// ─────────────────────────────────────────────────────────────
// News Theme — Báo chí, sạch, đáng tin
// White nền + Red accent + Dark text
// ─────────────────────────────────────────────────────────────
export const NewsTheme: ThemeTokens = {
  bgBase:        "#f8fafc",
  bgCard:        "#ffffff",
  bgCardActive:  "rgba(220, 38, 38, 0.04)",

  accent:        "#dc2626",
  highlight:     "#1e40af",
  danger:        "#dc2626",
  success:       "#16a34a",

  textPrimary:   "#111827",
  textSecondary: "#6b7280",
  border:        "rgba(0, 0, 0, 0.1)",
  borderActive:  "#dc2626",

  progressGradient: "linear-gradient(90deg, #dc2626, #ef4444)",
  shadowActive:  "0 20px 40px rgba(220, 38, 38, 0.15)",
};

// Map tiện lợi
export const THEMES = {
  nisa: NisaTheme,
  mlb:  MlbTheme,
  news: NewsTheme,
} as const;

export type ThemeName = keyof typeof THEMES;
