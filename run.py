"""
run.py — NISA Video Pipeline entry point

Usage:
  python run.py                         # Chạy toàn bộ pipeline từ tạo kịch bản đến render video
  python run.py --validate-only          # Chỉ chạy đến bước kiểm tra dữ liệu
  python run.py --preview                # Render thử (thường là vài giây đầu) để check giao diện
"""

import argparse
import os
import sys


def main():
    parser = argparse.ArgumentParser(description="NISA Video Pipeline")
    parser.add_argument("--slides",       default="input/slides.json")
    parser.add_argument("--audio",        default="input/audio.wav")
    parser.add_argument("--output",       default="output/video.mp4")
    parser.add_argument("--srt",          default="input/sub.srt")
    parser.add_argument("--validated",    default="intermediate/validated_slides.json")
    parser.add_argument("--remotion-dir", default="remotion")
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument("--preview",      action="store_true")
    parser.add_argument("--fps",          type=int, default=None)
    args = parser.parse_args()

    print("=" * 55)
    print("  NISA Video Pipeline - AUTOMATION START")
    print("=" * 55)

    # Thêm thư mục gốc vào hệ thống để Python tìm thấy các module trong thư mục pipeline/
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

    # ------------------------------------------------------------------
    # STAGE 1 & STAGE 2: Tạo Outline và sinh file cấu trúc Slide
    # ------------------------------------------------------------------
    try:
        from pipeline.stage1_outline import run as run_stage1
        from pipeline.stage2_slides import run as run_stage2
        
        print("\n>>> Stage 1: Generating Outline...")
        run_stage1() # Hàm sinh kịch bản thô từ AI
        
        print("\n>>> Stage 2: Processing Slides Structuring...")
        run_stage2() # Hàm tính toán mốc thời gian, tạo file input/slides.json
    except ImportError:
        # Nếu bạn chưa viết xong Stage 1 và Stage 2, hệ thống sẽ bỏ qua để test trước Stage 2.5 và 3
        print("\n[Lưu ý] Không tìm thấy hoặc chưa cấu hình Stage 1 & Stage 2. Chạy tiếp với file sẵn có.")

    # ------------------------------------------------------------------
    # STAGE 2.5: Kiểm tra và Validate cấu trúc slide dữ liệu
    # ------------------------------------------------------------------
    print("\n>>> Stage 2.5: Validating Slides...")
    from pipeline.stage2_5_validator import run as validate

    srt = args.srt if os.path.exists(args.srt) else None
    ok = validate(args.slides, args.validated, srt)
    if not ok:
        print("❌ Lỗi dữ liệu kịch bản tại Stage 2.5! Dừng pipeline.")
        sys.exit(1)

    if args.validate_only:
        print("\n--validate-only: Kiểm tra hoàn tất thành công.")
        sys.exit(0)

    # ------------------------------------------------------------------
    # STAGE 3: Kích hoạt Remotion Render đúc ra file MP4
    # ------------------------------------------------------------------
    print("\n>>> Stage 3: Rendering Video via Remotion...")
    from pipeline.stage3_render_video import run as render
    
    render(
        validated_slides_path = args.validated,
        audio_path            = args.audio,
        output_path           = args.output,
        remotion_dir          = args.remotion_dir,
        preview               = args.preview,
        fps_override          = args.fps,
    )
    
    # ------------------------------------------------------------------
    # STAGE 4: Cập nhật Metadata (Tiêu đề, Mô tả YouTube tự động nếu có)
    # ------------------------------------------------------------------
    if not args.preview:
        try:
            print("\n>>> Stage 4: Generating Video Metadata...")
            from pipeline.stage4_metadata import run as run_metadata
            run_metadata()
        except ImportError:
            pass

    print("\n" + "=" * 55)
    print(" 🎉 HOÀN THÀNH: Video đã được xuất tại " + args.output)
    print("=" * 55)


if __name__ == "__main__":
    main()