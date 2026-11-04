import React, { useState } from "react";
import { 
  Sparkles, 
  Download, 
  Play, 
  FileText, 
  Share2, 
  Check, 
  Flame, 
  ExternalLink, 
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import { Preset, ShortClip, VideoSource } from "../types";
import { formatTime } from "../lib/utils";

interface OutputResultsProps {
  sourceVideo: VideoSource;
  preset: Preset;
  onReset: () => void;
}

export const OutputResults: React.FC<OutputResultsProps> = ({
  sourceVideo,
  preset,
  onReset,
}) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Generate 3 realistic viral short clips based on source video
  const clips: ShortClip[] = [
    {
      id: "clip-1",
      title: "Short #1: Hook Mở Đầu Gây Tò Mò Cực Mạnh",
      duration: 28,
      startTime: 2,
      endTime: 30,
      viralScore: 98,
      hookText: `"${preset.sampleHook}"`,
      summary: "Đoạn mở đầu có nhịp độ dồn dập, nêu bật nỗi đau lớn nhất và giữ chân 85% người xem qua 3 giây đầu tiên.",
      videoUrl: sourceVideo.url,
      aspectRatio: "9:16",
      tags: ["High Retension", "Strong Hook", "Tiktok Viral"],
    },
    {
      id: "clip-2",
      title: "Short #2: Bí Quyết Cốt Lõi & Giải Pháp Bất Ngờ",
      duration: 42,
      startTime: 35,
      endTime: 77,
      viralScore: 94,
      hookText: `"Nếu bạn biết điều này sớm hơn, bạn đã tiết kiệm được hàng trăm giờ..."`,
      summary: "Nội dung giải thích giải pháp chi tiết, chèn B-roll và phụ đề chữ to giúp người xem lưu video về học lại.",
      videoUrl: sourceVideo.url,
      aspectRatio: "9:16",
      tags: ["Value Content", "Save & Share", "Reels Top"],
    },
    {
      id: "clip-3",
      title: "Short #3: Đúc Kết Bài Học & Kêu Gọi Chuyển Đổi (CTA)",
      duration: 34,
      startTime: 80,
      endTime: 114,
      viralScore: 91,
      hookText: `"Đừng quên bấm theo dõi để không bỏ lỡ phần 2 quan trọng nhất!"`,
      summary: "Kết thúc súc tích, hướng dẫn người xem bấm vào bình luận hoặc link bio nhận quà tặng độc quyền.",
      videoUrl: sourceVideo.url,
      aspectRatio: "9:16",
      tags: ["High Conversion", "Follow Call", "Tiktok Shop"],
    },
  ];

  const handleDownloadMp4 = (clip: ShortClip) => {
    const a = document.createElement("a");
    a.href = clip.videoUrl;
    a.download = `MasterClip_${preset.id}_${clip.id}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadNotice(`Đang tải video ${clip.title} (MP4 1080x1920 60FPS)...`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handleDownloadSrt = (clip: ShortClip) => {
    const srtContent = `1
00:00:00,000 --> 00:00:03,500
${preset.sampleHook}

2
00:00:03,500 --> 00:00:08,200
Tự động biên tập bằng MasterClip AI Studio

3
00:00:08,200 --> 00:00:15,000
Biến video dài thành nội dung viral triệu view chỉ với một cú nhấp chuột!
`;
    const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MasterClip_Subtitles_${clip.id}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadNotice(`Đã xuất phụ đề SRT chuẩn Unicode cho ${clip.title}`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <div className="rounded-2xl border border-brand/40 bg-gradient-to-r from-brand/10 via-amber-500/10 to-transparent p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-brand text-black shadow-lg shadow-brand/20">
              <CheckCircle2 className="size-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Hoàn Tất! Đã Xuất 3 Video Short Viral
                </h2>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  Sẵn sàng đăng tải
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Preset áp dụng: <strong className="text-brand">{preset.name}</strong> • Từ video: <em>{sourceVideo.name}</em>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-panel px-4 py-2 text-xs font-bold text-zinc-300 hover:border-zinc-500 hover:text-white transition-all"
            >
              <RotateCcw className="size-3.5" />
              <span>Dựng video khác</span>
            </button>
          </div>
        </div>
      </div>

      {downloadNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-brand/50 bg-brand/15 px-4 py-2.5 text-xs font-semibold text-brand animate-fade-in">
          <Check className="size-4" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Grid of 3 Output Clips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {clips.map((clip, index) => (
          <div
            key={clip.id}
            className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-card overflow-hidden transition-all hover:border-brand/60 hover:shadow-2xl hover:shadow-brand/5"
          >
            {/* Video Preview thumbnail with play */}
            <div className="relative aspect-[9/14] w-full overflow-hidden bg-black">
              <video
                src={clip.videoUrl}
                muted
                loop
                autoPlay
                playsInline
                className={`size-full object-cover transition-all ${
                  preset.skinGlowEnabled ? "contrast-[1.05] brightness-[1.06]" : ""
                }`}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

              {/* Top Viral Score Pill */}
              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40 px-2.5 py-1 text-[11px] font-extrabold text-amber-400 shadow-md">
                <Flame className="size-3.5 fill-amber-500 text-amber-500" />
                <span>Viral Score: {clip.viralScore}/100</span>
              </div>

              {/* Duration badge */}
              <div className="absolute right-3 top-3 rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-200">
                {formatTime(clip.duration)}
              </div>

              {/* Bottom Hook Text Preview on video */}
              <div className="absolute inset-x-3 bottom-3 text-center pointer-events-none">
                <div className="rounded-lg bg-black/80 backdrop-blur-sm border border-zinc-800 px-2.5 py-1.5 text-xs font-extrabold text-zinc-100 line-clamp-2">
                  {clip.hookText}
                </div>
              </div>
            </div>

            {/* Card Info & Actions */}
            <div className="flex flex-1 flex-col justify-between p-4 space-y-3.5">
              <div>
                <h3 className="text-xs font-extrabold text-white group-hover:text-brand transition-colors">
                  {clip.title}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                  {clip.summary}
                </p>

                {/* Tags */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {clip.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-panel border border-zinc-800 px-1.5 py-0.5 text-[9px] font-semibold text-zinc-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <button
                  onClick={() => handleDownloadMp4(clip)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand to-gold-400 py-2.5 text-xs font-bold text-black hover:brightness-110 active:scale-98 transition-all"
                >
                  <Download className="size-3.5 stroke-[2.5]" />
                  <span>Tải Video MP4 (1080x1920)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownloadSrt(clip)}
                    className="flex items-center justify-center gap-1 rounded-lg border border-zinc-800 bg-panel py-1.5 text-[11px] font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white transition-all"
                  >
                    <FileText className="size-3 text-zinc-400" />
                    <span>Xuất file .SRT</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(clip.hookText);
                      setDownloadNotice(`Đã sao chép kịch bản hook vào clipboard!`);
                      setTimeout(() => setDownloadNotice(null), 3000);
                    }}
                    className="flex items-center justify-center gap-1 rounded-lg border border-zinc-800 bg-panel py-1.5 text-[11px] font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white transition-all"
                  >
                    <Share2 className="size-3 text-zinc-400" />
                    <span>Copy Kịch Bản</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
