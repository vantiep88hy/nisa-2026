// components/Checklist.tsx
// Tầng 2 — Component
// Base layout: ListLayout
// Đặc trưng: checkbox icon + checked/unchecked state + animate từng dòng
// Dùng khi: danh sách điều kiện cần kiểm tra trước khi bắt đầu

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as LucideIcons from "lucide-react";
import { ListLayout } from "../layouts/ListLayout";
import { useTheme } from "../themes/ThemeContext";
import { slideIn, useFadeIn } from "../shared/animations";
import { ThemeTokens } from "../themes/themes";

// ── Types ─────────────────────────────────────────────────────
export interface ChecklistItem {
  text:       string;
  checked?:   boolean;   // mặc định true
  /** Thời điểm item này xuất hiện (giây tuyệt đối trong video) */
  start?:     number;
}

export interface ChecklistSlide {
  type:    "checklist";
  start:   number;
  end:     number;
  title:   string;
  items:   ChecklistItem[];
  cta?:    string;
}

interface Props {
  slide:           ChecklistSlide;
  globalProgress?: number;
  theme?:          ThemeTokens;
}

// ── Component ─────────────────────────────────────────────────
export const Checklist: React.FC<Props> = ({
  slide,
  globalProgress = 0,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideStartFrame = Math.round(slide.start * fps);
  const localFrame      = frame - slideStartFrame;
  const ctaOp           = useFadeIn(localFrame, Math.round((slide.end - slide.start) * fps * 0.8));

  const cta = slide.cta ? (
    <CtaRow text={slide.cta} opacity={ctaOp} />
  ) : undefined;

  return (
    <ListLayout
      theme={theme}
      globalProgress={globalProgress}
      title={slide.title}
      footer={cta}
    >
      {slide.items.map((item, i) => {
        const appearFrame = item.start
          ? Math.max(Math.round((item.start - slide.start) * fps), 8)
          : 15 + i * 20;
        const anim = slideIn(localFrame, appearFrame, fps);

        return (
          <CheckItem
            key={i}
            text={item.text}
            checked={item.checked !== false}
            opacity={anim.opacity}
            translateY={anim.translateY}
          />
        );
      })}
    </ListLayout>
  );
};

// ── Sub-components ────────────────────────────────────────────

const CheckItem: React.FC<{
  text:       string;
  checked:    boolean;
  opacity:    number;
  translateY: number;
}> = ({ text, checked, opacity, translateY }) => {
  const theme = useTheme();
  const Icon  = checked ? LucideIcons.CheckSquare : LucideIcons.Square;
  const color = checked ? theme.success : theme.textSecondary;

  return (
    <div
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          32,
        padding:      "28px 40px",
        background:   theme.bgCard,
        border:       `2px solid ${checked ? theme.success + "50" : theme.border}`,
        borderRadius: 20,
        opacity:      opacity > 0 ? 1 : 0,
        transform:    `translateY(${translateY}px)`,
        boxShadow:    checked ? `0 8px 24px ${theme.success}15` : "none",
      }}
    >
      <Icon size={52} color={color} strokeWidth={2} />
      <div
        style={{
          fontSize:   52,
          fontWeight: 700,
          color:      checked ? theme.textPrimary : theme.textSecondary,
          lineHeight: 1.2,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const CtaRow: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        opacity,
        display:      "flex",
        alignItems:   "center",
        gap:          14,
        padding:      "20px 36px",
        background:   theme.bgCard,
        border:       `2px solid ${theme.highlight}`,
        borderRadius: 16,
        color:        theme.highlight,
        fontSize:     44,
        fontWeight:   700,
      }}
    >
      <span style={{ fontSize: 40, marginRight: 6 }}>★</span>
      {text}
    </div>
  );
};
