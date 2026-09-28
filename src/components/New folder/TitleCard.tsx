// components/TitleCard.tsx
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const TitleCard = ({ slide }: { slide: any }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hiệu ứng
  const badgeScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 200 },
  });
  const titleX       = interpolate(frame, [15, 25], [-100, 0], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [15, 25], [0, 1],    { extrapolateRight: "clamp" });
  const subY         = interpolate(frame, [30, 40], [30, 0],   { extrapolateRight: "clamp" });
  const subOpacity   = interpolate(frame, [30, 40], [0, 1],    { extrapolateRight: "clamp" });

  // Đọc đúng field từ slides.json
  const badgeText = slide?.badge    || null;
  const mainTitle = slide?.title    || "";
  const subtitle  = slide?.subtitle || null;

  return (
    <AbsoluteFill
      style={{
        /* ĐÃ SỬA: Ép nền trong suốt và thêm một lớp phủ tối 45% để hòa trộn với video nền, giúp chữ không bị lóa */
        //background: "rgba(11, 15, 25, 0.25)", 
        padding:    "100px",
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "center",
        fontFamily: "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', sans-serif",
        color:      "#fff",
        overflow:   "hidden",
      }}
    >
      {/* Biểu đồ nền trang trí (Giữ nguyên nhưng giảm opacity xuống 0.2 để không đá nhau với video) */}
      <svg
        style={{
          position: "absolute",
          right:    0,
          top:      "10%",
          opacity:  0.2, 
          width:    "60%",
        }}
        viewBox="0 0 500 300"
      >
        <polyline
          fill="none"
          stroke="#ef4444"
          strokeWidth="8"
          points="0,50 100,80 150,40 250,150 300,100 400,250 500,200"
        />
      </svg>

      {/* Badge — chỉ hiện nếu có dữ liệu */}
      {badgeText && (
        <div style={{ transform: `scale(${badgeScale})`, transformOrigin: "left center" }}>
          <div
            style={{
              background:   "#dc2626",
              color:        "#fff",
              padding:      "12px 30px",
              fontSize:     36,
              fontWeight:   900,
              borderRadius: 8,
              display:      "inline-block",
              marginBottom: 40,
              boxShadow:    "0 10px 25px rgba(220, 38, 38, 0.4)",
            }}
          >
            {badgeText}
          </div>
        </div>
      )}

      {/* Tiêu đề chính */}
      <div
        style={{
          opacity:   titleOpacity,
          transform: `translateX(${titleX}px)`,
        }}
      >
        <div
          style={{
            fontSize:      110,
            fontWeight:    900,
            letterSpacing: "0.05em",
            lineHeight:    1.2,
            textShadow:    "0 10px 30px rgba(0,0,0,0.6)", // Tăng bóng đổ để nổi bật trên nền video chuyển động
          }}
        >
          {mainTitle}
        </div>
      </div>

      {/* Tiêu đề phụ — chỉ hiện nếu có dữ liệu */}
      {subtitle && (
        <div
          style={{
            opacity:     subOpacity,
            transform:   `translateY(${subY}px)`,
            marginTop:   60,
            fontSize:    48,
            fontWeight:  700,
            borderLeft:  "8px solid #38bdf8",
            paddingLeft: 24,
            textShadow:  "0 5px 15px rgba(0,0,0,0.6)",
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};