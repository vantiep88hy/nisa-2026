import React from "react";
import * as LucideIcons from "lucide-react";
import { useCurrentFrame, useVideoConfig } from "remotion";

import { ComparisonSlide } from "../types/slide";
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

interface Props {
  slide: ComparisonSlide;
  globalProgress?: number;
}

export const Comparison: React.FC<Props> = ({
  slide,
  globalProgress = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideStartFrame = Math.round(slide.start * fps);
  const localFrame = frame - slideStartFrame;

  const titleAnim  = slideIn(localFrame, 0, fps);
  const leftAnim   = useSlideFromSide(localFrame, 10, "left");
  const rightAnim  = useSlideFromSide(localFrame, 20, "right");
  const vsAnim     = usePopIn(localFrame, 15);
  const hlAnim     = slideIn(localFrame, 25, fps);

  const left  = slide.left;
  const right = slide.right;

  if (!left || !right) {
    return (
      <div
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          background: "#111827",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 48,
          fontFamily: font.family,
        }}
      >
        comparison requires left / right
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
        background: "transparent", // ← video BG từ layer cha xuyên qua
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
              color: "#fff",
              fontWeight: 900,
              fontSize: 75,
              letterSpacing: "0.02em",
            }}
          >
            {slide.title}
          </div>
          <div
            style={{
              width: 100,
              height: 6,
              borderRadius: 3,
              background: "linear-gradient(90deg,#38bdf8,#0ea5e9)",
              margin: "16px auto 0",
            }}
          />
        </div>

        {/* ── HIGHLIGHT BADGE (slide-level) ── */}
        {slide.highlight && (
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
                background: "rgba(245,158,11,0.12)",
                border: "2px solid #f59e0b",
                borderRadius: 12,
                color: "#f59e0b",
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
            item={left}
            opacity={leftAnim.opacity}
            translateX={leftAnim.translateX}
            accent="#ef4444"
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
                background: "rgba(15,23,42,0.85)",
                border: "4px solid #38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#38bdf8",
                fontWeight: 900,
                fontSize: 46,
                boxShadow: "0 0 40px rgba(56,189,248,0.35)",
              }}
            >
              VS
            </div>
          </div>

          <CompareCard
            item={right}
            opacity={rightAnim.opacity}
            translateX={rightAnim.translateX}
            accent="#38bdf8"
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
    title:      string;
    icon?:      string;
    label?:     string | null;
    value:      string;
    highlight?: string | null;
    points?:    string[];
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
          ? "rgba(56,189,248,0.1)"
          : "rgba(0,0,0,0.35)",
        border: `2px solid ${accent}`,
        borderRadius: 28,
        padding: "40px 44px",
        display: "flex",
        flexDirection: "column",
        boxShadow: highlight
          ? "0 20px 50px rgba(56,189,248,0.15)"
          : "0 20px 50px rgba(0,0,0,0.25)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* HEADER: icon + title */}
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
          <div
            style={{
              color: "#fff",
              fontSize: 52,
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            {item.title}
          </div>
          {item.label && (
            <div
              style={{
                color: accent,
                fontSize: 30,
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              {item.label}
            </div>
          )}
        </div>
      </div>

      {/* VALUE */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 36,
        }}
      >
        <HighlightText
          text={item.value}
          highlight={item.highlight ?? null}
          baseSize={96}
          accent={accent}
        />
      </div>

      {/* POINTS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginTop: "auto",
        }}
      >
        {(item.points ?? []).map((p, idx) => (
          <PointRow key={idx} text={p} accent={accent} />
        ))}
      </div>
    </div>
  );
};

// ── PointRow ──────────────────────────────────────────────────

const PointRow = ({
  text,
  accent,
}: {
  text: string;
  accent: string;
}) => {
  const Icon = LucideIcons.CheckCircle;

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
      }}
    >
      <Icon size={32} color={accent} strokeWidth={2.5} />
      <div
        style={{
          color: "#e2e8f0",
          fontSize: 36,
          lineHeight: 1.35,
          fontWeight: 600,
        }}
      >
        {text}
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
              color:      "#ffffff",
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
// Chỉ giữ grid pattern mờ — KHÔNG có glow/blur che video

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