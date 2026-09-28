import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as LucideIcons from "lucide-react";

import { BigNumberSlide } from "../types/slide";
import { Theme, BaseLayout, useTheme, SlideTitle, Pill } from "../shared/BaseLayout";
import {
  slideIn,
  useFadeIn,
  useCountUp,
  splitHighlight,
} from "../shared/animations";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface Props {
  slide:           BigNumberSlide;
  globalProgress?: number;
  theme?:          Theme;
}

// ─────────────────────────────────────────────────────────────
// BigNumber
// ─────────────────────────────────────────────────────────────

export const BigNumber: React.FC<Props> = ({
  slide,
  globalProgress = 0,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - Math.round(slide.start * fps);

  // ── Animations ──────────────────────────────────────────────
  const titleAnim      = slideIn(localFrame, 0, fps);
  const contextOpacity = useFadeIn(localFrame, 32);
  const descOpacity    = useFadeIn(localFrame, 48);
  const footerOpacity  = useFadeIn(localFrame, 60);

  // ── Number parsing ──────────────────────────────────────────
  // prefix  = phần không phải số ở đầu, vd "約" hoặc "¥"
  // rawNumber = chỉ chữ số và dấu chấm để countUp animate
  const rawNumber  = String(slide.number ?? "").replace(/[^0-9.]/g, "");
  const prefix     = String(slide.number ?? "").match(/^[^0-9]*/)?.[0] ?? "";
  const numberText = useCountUp(rawNumber, 12, localFrame, 45);

  // ── Icon ────────────────────────────────────────────────────
  const Icon =
    slide.icon && (LucideIcons as Record<string, any>)[slide.icon]
      ? (LucideIcons as Record<string, any>)[slide.icon]
      : LucideIcons.BarChart3;

  // ── Title highlight parts ───────────────────────────────────
  const titleParts = splitHighlight(slide.title, slide.highlight ?? null);

  return (
    <BaseLayout globalProgress={globalProgress} theme={theme}>
      {/*
       * BigNumber dùng HeroLayout pattern:
       * flexDirection column, center + center, toàn bộ nội dung giữa màn hình
       */}
      <div
        style={{
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "center",
          alignItems:     "center",
          height:         "100%",
        }}
      >
        <IconBlock Icon={Icon} anim={titleAnim} />
        <TitleBlock titleParts={titleParts} anim={titleAnim} />
        <NumberBlock
          prefix={prefix}
          numberText={numberText}
          unit={slide.unit}
        />

        {/* Date badge — ưu tiên hơn context (legacy) */}
        {slide.date && (
          <Pill opacity={contextOpacity} mt={16}>{slide.date}</Pill>
        )}
        {!slide.date && slide.context && (
          <Pill opacity={contextOpacity} mt={24}>{slide.context}</Pill>
        )}

        {slide.description && (
          <DescriptionBox text={slide.description} opacity={descOpacity} />
        )}

        {(slide.footer1 || slide.footer2) && (
          <FooterRow
            footer1={slide.footer1}
            footer2={slide.footer2}
            opacity={footerOpacity}
          />
        )}
      </div>
    </BaseLayout>
  );
};

// ─────────────────────────────────────────────────────────────
// Sub-components — mỗi cái gọi useTheme() để đọc màu
// ─────────────────────────────────────────────────────────────

const IconBlock: React.FC<{
  Icon:  React.ElementType;
  anim:  { opacity: number; translateY: number };
}> = ({ Icon, anim }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        marginBottom: 30,
        opacity:      anim.opacity,
        transform:    `translateY(${anim.translateY}px)`,
      }}
    >
      <div
        style={{
          width:          110,
          height:         110,
          borderRadius:   24,
          background:     `${theme.accent}1e`, // 12% opacity hex
          display:        "flex",
          justifyContent: "center",
          alignItems:     "center",
        }}
      >
        <Icon size={58} color={theme.accent} strokeWidth={2.5} />
      </div>
    </div>
  );
};

const TitleBlock: React.FC<{
  titleParts: { text: string; hl: boolean }[];
  anim:       { opacity: number; translateY: number };
}> = ({ titleParts, anim }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        opacity:      anim.opacity,
        transform:    `translateY(${anim.translateY}px)`,
        textAlign:    "center",
        marginBottom: 36,
      }}
    >
      <div style={{ fontSize: 68, fontWeight: 900, color: "#fff" }}>
        {titleParts.map((p, i) =>
          p.hl ? (
            <span key={i} style={{ color: theme.highlight }}>{p.text}</span>
          ) : (
            <span key={i}>{p.text}</span>
          )
        )}
      </div>
    </div>
  );
};

const NumberBlock: React.FC<{
  prefix:     string;
  numberText: string;
  unit?:      string;
}> = ({ prefix, numberText, unit }) => {
  const theme = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
      <div
        style={{
          fontSize:   180,
          fontWeight: 900,
          color:      theme.highlight,
          lineHeight: 1,
          // textShadow は一意のビジュアル効果 — テーマに関係なく保持
          textShadow: `0 20px 60px ${theme.highlight}40`,
        }}
      >
        {prefix}{numberText}
      </div>

      {unit && (
        <div
          style={{
            fontSize:     72,
            fontWeight:   700,
            color:        "#fff",
            marginBottom: 18,
          }}
        >
          {unit}
        </div>
      )}
    </div>
  );
};

const DescriptionBox: React.FC<{
  text:    string;
  opacity: number;
}> = ({ text, opacity }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        marginTop: 50,
        opacity,
        maxWidth:  1300,
      }}
    >
      <div
        style={{
          padding:      "30px 40px",
          borderRadius: 22,
          background:   theme.bgCard,
          borderLeft:   `6px solid ${theme.highlight}`,
          textAlign:    "center",
          color:        theme.textSecondary,
          fontSize:     42,
          fontWeight:   600,
          lineHeight:   1.5,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const FooterRow: React.FC<{
  footer1?: string;
  footer2?: string;
  opacity:  number;
}> = ({ footer1, footer2, opacity }) => (
  <div
    style={{
      marginTop:      28,
      opacity,
      display:        "flex",
      gap:            40,
      justifyContent: "center",
      alignItems:     "center",
      flexWrap:       "wrap",
    }}
  >
    {footer1 && <FooterChip text={footer1} />}
    {footer2 && <FooterChip text={footer2} />}
  </div>
);

const FooterChip: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      display:      "flex",
      alignItems:   "center",
      gap:          10,
      padding:      "10px 24px",
      borderRadius: 999,
      background:   "rgba(0,0,0,0.3)",
      border:       "1px solid rgba(255,255,255,0.1)",
      color:        "#94a3b8",
      fontSize:     28,
      fontWeight:   600,
    }}
  >
    {/* Users icon — không đổi theo theme vì là icon thông tin trung tính */}
    <LucideIcons.Users size={28} color="#64748b" strokeWidth={2} />
    {text}
  </div>
);