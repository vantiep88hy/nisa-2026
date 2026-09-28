// components/Ranking.tsx
// Tầng 2 — Component
// Base layout: ListLayout
// Đặc trưng: số thứ tự + crown/medal icon cho top 3 + tên + mô tả
// Dùng khi: xếp hạng quỹ đầu tư phổ biến, bảng xếp hạng

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as LucideIcons from "lucide-react";
import { ListLayout } from "../layouts/ListLayout";
import { useTheme } from "../themes/ThemeContext";
import { slideIn } from "../shared/animations";
import { ThemeTokens } from "../themes/themes";

// ── Types ─────────────────────────────────────────────────────
export interface RankingItem {
  rank:    number;      // 1, 2, 3, ...
  name:    string;      // vd: "eMAXIS Slim 全世界株式（オルカン）"
  label?:  string;      // vd: "人気No.1"
  start?:  number;      // thời điểm xuất hiện (giây tuyệt đối)
}

export interface RankingSlide {
  type:    "ranking";
  start:   number;
  end:     number;
  title:   string;
  items:   RankingItem[];
  note?:   string;      // vd: "※2024年時点の人気ランキング"
}

interface Props {
  slide:           RankingSlide;
  globalProgress?: number;
  theme?:          ThemeTokens;
}

// ── Medal colors ──────────────────────────────────────────────
const RANK_COLORS = ["#f59e0b", "#94a3b8", "#cd7c2f"] as const;
const RANK_ICONS  = [LucideIcons.Crown, LucideIcons.Medal, LucideIcons.Award];

// ── Component ─────────────────────────────────────────────────
export const Ranking: React.FC<Props> = ({
  slide,
  globalProgress = 0,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideStartFrame = Math.round(slide.start * fps);
  const localFrame      = frame - slideStartFrame;

  const note = slide.note ? (
    <NoteRow text={slide.note} />
  ) : undefined;

  return (
    <ListLayout
      theme={theme}
      globalProgress={globalProgress}
      title={slide.title}
      footer={note}
    >
      {slide.items.map((item, i) => {
        const appearFrame = item.start
          ? Math.max(Math.round((item.start - slide.start) * fps), 8)
          : 15 + i * 22;
        const anim = slideIn(localFrame, appearFrame, fps);

        return (
          <RankRow
            key={i}
            item={item}
            opacity={anim.opacity}
            translateY={anim.translateY}
          />
        );
      })}
    </ListLayout>
  );
};

// ── Sub-components ────────────────────────────────────────────

const RankRow: React.FC<{
  item:       RankingItem;
  opacity:    number;
  translateY: number;
}> = ({ item, opacity, translateY }) => {
  const theme     = useTheme();
  const rankIdx   = Math.min(item.rank - 1, 2);
  const medalColor = RANK_COLORS[rankIdx] ?? theme.textSecondary;
  const MedalIcon  = RANK_ICONS[rankIdx]  ?? LucideIcons.Hash;
  const isTop3    = item.rank <= 3;

  return (
    <div
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          32,
        padding:      "28px 40px",
        background:   isTop3 ? `${medalColor}12` : theme.bgCard,
        border:       `2px solid ${isTop3 ? medalColor + "60" : theme.border}`,
        borderRadius: 20,
        opacity:      opacity > 0 ? 1 : 0,
        transform:    `translateY(${translateY}px)`,
        boxShadow:    isTop3 ? `0 8px 32px ${medalColor}18` : "none",
      }}
    >
      {/* Rank medal */}
      <div
        style={{
          width:          88,
          height:         88,
          borderRadius:   999,
          background:     `${medalColor}20`,
          border:         `2px solid ${medalColor}`,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          flexShrink:     0,
        }}
      >
        {isTop3 ? (
          <MedalIcon size={42} color={medalColor} strokeWidth={2} />
        ) : (
          <span
            style={{
              fontSize:   36,
              fontWeight: 900,
              color:      medalColor,
            }}
          >
            {item.rank}
          </span>
        )}
      </div>

      {/* Name + label */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize:   48,
            fontWeight: 800,
            color:      theme.textPrimary,
            lineHeight: 1.2,
          }}
        >
          {item.name}
        </div>
        {item.label && (
          <div
            style={{
              fontSize:   32,
              fontWeight: 600,
              color:      medalColor,
              marginTop:  6,
            }}
          >
            {item.label}
          </div>
        )}
      </div>

      {/* Rank number badge */}
      <div
        style={{
          fontSize:   56,
          fontWeight: 900,
          color:      `${medalColor}60`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        #{item.rank}
      </div>
    </div>
  );
};

const NoteRow: React.FC<{ text: string }> = ({ text }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        fontSize:  30,
        color:     theme.textSecondary,
        textAlign: "right",
      }}
    >
      {text}
    </div>
  );
};
