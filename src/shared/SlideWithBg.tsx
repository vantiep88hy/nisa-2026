// shared/SlideWithBg.tsx
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useState } from "react";

// ── Kho BG pools (Đã cập nhật đầy đủ cho cả 5 định dạng mới của bạn) ──────────────
const BG_POOLS: Record<string, string[]> = {
  title_card:     ["bg-title-1", "bg-title-2", "bg-title-3"],
  bullet_summary: ["bg-content-1", "bg-content-2"],
  comparison:     ["bg-compare-1", "bg-compare-2"],
  big_number:     ["bg-number-1"],
  timeline:       ["bg-timeline-1", "bg-timeline-2"],
  
  // ── THÊM MỚI TẦNG 2: Gán bộ ảnh nền sequence cho các định dạng mới ──
  question:       ["bg-content-1", "bg-content-2"], // Hoặc đổi thành folder riêng của bạn ví dụ ["bg-question"]
  quote:          ["bg-title-3"], 
  warning:        ["bg-compare-2"],
  ranking:        ["bg-timeline-1"],
  summary:        ["bg-content-2"],

  Default:        ["bg-time"],
};

// ── Frame count của mỗi BG (đọc từ bg-meta.json do stage0 tạo ra) ───────
const BG_META: Record<string, { frameCount: number; fps: number }> =
  (() => {
    try {
      return require("../../public/bg-meta.json");
    } catch {
      return {};
    }
  })();

interface SlideWithBgProps {
  slideType?:  string;
  typeIndex?:  number;
  slideIndex?: number;
  children:    React.ReactNode;
}

export const SlideWithBg: React.FC<SlideWithBgProps> = ({
  slideType  = "Default",
  typeIndex  = 0,
  slideIndex = 0,
  children,
}) => {
  const frame       = useCurrentFrame();
  const { fps }     = useVideoConfig();
  const [hasError, setHasError] = useState(false);

  // ── Chọn BG folder ──────────────────────────────────────────
  const pool        = BG_POOLS[slideType] ?? BG_POOLS.Default;
  const chosenBg    = pool[typeIndex % pool.length];
  const finalBg     = hasError ? "bg-time" : chosenBg;

  // ── Tính frame index trong JPEG sequence ────────────────────
  const bgMeta      = BG_META[finalBg];
  const bgFps       = bgMeta?.fps    ?? fps;          
  const bgFrameCount = bgMeta?.frameCount ?? 300;     

  const bgFrameRaw  = Math.round(frame * (bgFps / fps));
  const bgFrameIdx  = bgFrameRaw % bgFrameCount;
  
  const frameFile   = `frame_${String(bgFrameIdx + 1).padStart(4, "0")}.jpg`;
  const imgSrc      = staticFile(`${finalBg}/${frameFile}`);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* LỚP BG: JPEG frame tương ứng với frame hiện tại */}
      <AbsoluteFill style={{ opacity: 0.35 }}>
        <Img
          src={imgSrc}
          onError={() => {
            console.warn(`[BG] Lỗi load ${imgSrc}, chuyển về fallback`);
            setHasError(true);
          }}
          style={{
            width:      "100%",
            height:     "100%",
            objectFit:  "cover",
          }}
        />
      </AbsoluteFill>

      {/* LỚP NỘI DUNG SLIDE */}
      <AbsoluteFill>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};