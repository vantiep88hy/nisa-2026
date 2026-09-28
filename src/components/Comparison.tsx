import React from "react";
import * as LucideIcons from "lucide-react";
import { useCurrentFrame, useVideoConfig } from "remotion";

import {
  CANVAS_W,
  CANVAS_H,
  SAFE_W,
  SAFE_H,
  spacing,
  font,
  zIndex,
} from "../shared/tokens";

import {
  slideIn,
  usePopIn,
  useSlideFromSide,
  splitHighlight,
} from "../shared/animations";

import { ProgressBar } from "../shared/ProgressBar";
import { useTheme } from "../themes/ThemeContext";

interface Props {
  slide: any; 
  globalProgress?: number;
}

export const Comparison: React.FC<Props> = ({
  slide,
  globalProgress = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const slideStartFrame = Math.round((slide.start || 0) * fps);
  const localFrame = frame - slideStartFrame;

  const titleAnim  = slideIn(localFrame, 0, fps);
  const leftAnim   = useSlideFromSide(localFrame, 10, "left", fps);
  const rightAnim  = useSlideFromSide(localFrame, 20, "right", fps);
  const vsAnim     = usePopIn(localFrame, 15, fps);
  const hlAnim     = slideIn(localFrame, 25, fps);

  // ── 🛠️ Đọc dữ liệu mảng từ JSON ──
  const items = slide?.items || [];
  const leftData = items[0] || null;
  const rightData = items[1] || null;

  if (!leftData || !rightData) {
    return (
      <div style={{ width: CANVAS_W, height: CANVAS_H, background: "#111827", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 40, fontFamily: font.family }}>
        [Comparison Error] JSON items missing.
      </div>
    );
  }

  return (
    <div
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        position: "relative",
        overflow: "hidden",
        background: "transparent", 
        fontFamily: font.family,
      }}
    >
      <BackgroundDecoration />

      <div
        style={{
          position: "absolute",
          top: spacing.safeTop,
          left: spacing.safeLeft,
          width: SAFE_W,
          height: SAFE_H,
          display: "flex",
          flexDirection: "column",
          zIndex: zIndex.text,
        }}
      >
        {/* ── TITLE ── */}
        <div
          style={{
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.translateY}px)`,
            textAlign: "center",
            marginBottom: 32,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              color: theme.textPrimary,
              fontWeight: 900,
              fontSize: 75,
              letterSpacing: "0.02em",
            }}
          >
            {slide.title || "比較"}
          </div>
          <div
            style={{
              width: 100,
              height: 6,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${theme.accent}, #0ea5e9)`,
              margin: "16px auto 0",
            }}
          />
        </div>

        {/* ── HIGHLIGHT BADGE (slide-level) ── */}
        {slide.highlight && typeof slide.highlight === "string" && (
          <div
            style={{
              opacity: hlAnim.opacity,
              transform: `translateY(${hlAnim.translateY}px)`,
              textAlign: "center",
              marginBottom: 28,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: `${theme.highlight}20`,
                border: `2px solid ${theme.highlight}`,
                borderRadius: 12,
                color: theme.highlight,
                fontWeight: 900,
                fontSize: 48,
                padding: "6px 36px",
              }}
            >
              {slide.highlight}
            </span>
          </div>
        )}

        {/* ── CARDS ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: 40,
            alignItems: "stretch",
            position: "relative",
            minHeight: 0,
          }}
        >
          <CompareCard
            item={leftData}
            opacity={leftAnim.opacity}
            translateX={leftAnim.translateX}
            accent={theme.danger} 
          />

          {/* VS bubble */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%,-50%) scale(${vsAnim.scale})`,
              opacity: vsAnim.opacity,
              zIndex: 50,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 999,
                background: "rgba(15,23,42,0.9)",
                border: `4px solid ${theme.accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.accent,
                fontWeight: 900,
                fontSize: 46,
                boxShadow: `0 0 40px ${theme.accent}55`,
              }}
            >
              VS
            </div>
          </div>

          <CompareCard
            item={rightData}
            opacity={rightAnim.opacity}
            translateX={rightAnim.translateX}
            accent={theme.accent} 
            highlight
          />
        </div>
      </div>

      <ProgressBar progress={globalProgress} />
    </div>
  );
};

// ── CompareCard ───────────────────────────────────────────────

interface CardProps {
  item: {
    label:     string;
    icon?:      string;
    value:      string;
    highlight?: string | null;
    points?:    Array<{ text: string; highlight?: string | null }>; // ✅ Thêm nhận diện highlight riêng của tầng point nếu có
  };
  opacity:    number;
  translateX: number;
  accent:     string;
  highlight?: boolean;
}

const CompareCard: React.FC<CardProps> = ({
  item,
  opacity,
  translateX,
  accent,
  highlight = false,
}) => {
  const theme = useTheme();
  const cardTitle = item.label || "未設定";

  const Icon =
    (LucideIcons as Record<string, any>)[item.icon ?? "Scale"] ??
    LucideIcons.Scale;

  return (
    <div
      style={{
        flex: 1,
        opacity,
        transform: `translateX(${translateX}px)`,
        background: highlight
          ? `${theme.accent}15`
          : "rgba(0,0,0,0.35)",
        border: `2px solid ${accent}`,
        borderRadius: 28,
        padding: "40px 44px",
        display: "flex",
        flexDirection: "column",
        boxShadow: highlight
          ? `0 20px 50px ${theme.accent}25`
          : "0 20px 50px rgba(0,0,0,0.25)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          gap: 18,
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: `${accent}22`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={44} color={accent} strokeWidth={2.5} />
        </div>

        <div>
          <div style={{ color: "#fff", fontSize: 52, fontWeight: 900, lineHeight: 1.1 }}>
            {cardTitle}
          </div>
        </div>
      </div>

      {/* VALUE */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <HighlightText
          text={item.value || ""}
          highlight={item.highlight ?? null}
          baseSize={96}
          accent={accent}
        />
      </div>

      {/* POINTS (ĐÃ SỬA: Ép tính năng tách text highlight cho từng dòng point) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginTop: "auto",
        }}
      >
        {(item.points ?? []).map((p, idx) => (
          <PointRow 
            key={idx} 
            text={p.text || ""} 
            // Ưu tiên highlight của chính dòng point đó, nếu không có thì lấy từ khóa highlight chung của Card cha để quét tìm từ trùng
            highlight={p.highlight ?? item.highlight ?? null} 
            accent={accent} 
          />
        ))}
      </div>
    </div>
  );
};

// ── PointRow (ĐÃ CẬP NHẬT: Hỗ trợ render chữ Highlight đổi màu) ──────────────────

const PointRow = ({
  text,
  highlight,
  accent,
}: {
  text: string;
  highlight: string | null;
  accent: string;
}) => {
  const theme = useTheme();
  const Icon = LucideIcons.CheckCircle;
  
  // Tách chuỗi text thành các cụm thường và cụm được highlight màu
  const parts = splitHighlight(text, highlight);

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
      }}
    >
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
        <Icon size={32} color={accent} strokeWidth={2.5} />
      </div>
      
      <div
        style={{
          color: theme.textSecondary,
          fontSize: 36,
          lineHeight: 1.35,
          fontWeight: 600,
        }}
      >
        {parts.map((p, i) =>
          p.hl ? (
            <span key={i} style={{ color: accent, fontWeight: 900 }}>
              {p.text}
            </span>
          ) : (
            <span key={i}>{p.text}</span>
          )
        )}
      </div>
    </div>
  );
};

// ── HighlightText ─────────────────────────────────────────────

const HighlightText = ({
  text,
  highlight,
  baseSize,
  accent,
}: {
  text:      string;
  highlight: string | null;
  baseSize:  number;
  accent:    string;
}) => {
  const parts = splitHighlight(text, highlight);
  const theme = useTheme();

  return (
    <>
      {parts.map((p, i) =>
        p.hl ? (
          <span
            key={i}
            style={{
              color:      accent,
              fontWeight: 900,
              fontSize:   baseSize * 1.05,
            }}
          >
            {p.text}
          </span>
        ) : (
          <span
            key={i}
            style={{
              color:      theme.textPrimary,
              fontWeight: 900,
              fontSize:   baseSize,
            }}
          >
            {p.text}
          </span>
        )
      )}
    </>
  );
};

// ── BackgroundDecoration ──────────────────────────────────────
const BackgroundDecoration = () => (
  <div
    style={{
      position:        "absolute",
      inset:           0,
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
      `,
      backgroundSize:  "90px 90px",
      opacity:         0.4,
    }}
  />
);