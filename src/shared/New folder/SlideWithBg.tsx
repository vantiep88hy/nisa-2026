// shared/SlideWithBg.tsx
import { AbsoluteFill, Video, staticFile } from "remotion";
import React, { useState } from "react";

// Kho video nền đa nguồn
const BG_POOLS: Record<string, string[]> = {
  title_card:     ["bg-title-1.mp4", "bg-title-2.mp4", "bg-title-3.mp4"],
  bullet_summary: ["bg-content-1.mp4", "bg-content-2.mp4"],
  comparison:     ["bg-compare-1.mp4", "bg-compare-2.mp4"],
  big_number:     ["bg-number-1.mp4"],
  timeline:       ["bg-timeline-1.mp4", "bg-timeline-2.mp4"],
  Default:        ["bg-time.mp4"],
};

interface SlideWithBgProps {
  slideType?:   string;
  typeIndex?:   number;
  slideIndex?:  number;
  children:     React.ReactNode;
}

export const SlideWithBg: React.FC<SlideWithBgProps> = ({
  slideType  = "Default",
  typeIndex  = 0,
  slideIndex = 0,
  children,
}) => {
  const [hasError, setHasError] = useState(false);

  console.log(
    `[DEBUG BG] Slide #${slideIndex} | type: "${slideType}" | typeIndex: ${typeIndex}`
  );

  const pool        = BG_POOLS[slideType] ?? BG_POOLS.Default;
  const chosenVideo = pool[typeIndex % pool.length];
  const finalVideo  = chosenVideo && !hasError ? chosenVideo : "bg-time.mp4";

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* LỚP VIDEO NỀN */}
      <AbsoluteFill style={{ opacity: 0.25 }}>
        <Video
          src={staticFile(finalVideo)}
          startFrom={0}
          loop
          muted
          onError={(error) => {
            console.warn(
              `[Remotion BG] Lỗi file "${finalVideo}", chuyển về dự phòng:`,
              error
            );
            setHasError(true);
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* LỚP NỘI DUNG SLIDE */}
      <AbsoluteFill>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};