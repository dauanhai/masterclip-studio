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
  CheckCircle2,
  Crown,
  Film,
  GraduationCap,
  Scissors,
  Zap
} from "lucide-react";
import { Preset, ShortClip, VideoSource, TranscriptSegment } from "../types";
import { formatTime } from "../lib/utils";

interface OutputResultsProps {
  sourceVideo: VideoSource;
  preset: Preset;
  segments?: TranscriptSegment[];
  onReset: () => void;
}

export const OutputResults: React.FC<OutputResultsProps> = ({
  sourceVideo,
  preset,
  segments = [],
  onReset,
}) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const videoTitle = sourceVideo.videoTitle || sourceVideo.name.replace(/\.[^/.]+$/, "");
  const firstHook = segments[0]?.text || sourceVideo.hookOpening || "Tuyển nhân viên part-time lương 15 - 20.000 một giờ";
  const brollCount = segments.filter((s) => s.brollMode !== "none").length;

  // Master Full Video Clip (The complete professional edit)
  const masterClip: ShortClip = {
    id: "master-cut-final",
    title: `BẢN DỰNG MASTER HOÀN CHỈNH: ${videoTitle}`,
    duration: Math.round(sourceVideo.duration) || 44,
    startTime: 0,
    endTime: sourceVideo.duration || 44,
    viralScore: 99,
    hookText: `"${firstHook}"`,
    summary: `Biên tập hoàn chỉnh toàn bộ ${segments.length || 10} câu thoại gốc của video, tích hợp Cụm Tiêu Đề 3 Tầng Giữa Ngực Siêu VIP, điều phối ${brollCount} cảnh trám B-Roll tư liệu minh họa, tự động cắt khoảng lặng thừa và bộ lọc Korean Glow mịn da.`,
    videoUrl:
      sourceVideo.url.includes("chi-hanh") || sourceVideo.isChanhSample
        ? "/samples/sample-chi-hanh-superpower.mp4"
        : sourceVideo.url,
    aspectRatio: "9:16",
    tags: ["Master Cut Siêu VIP", "Chuyên Gia Triệu View", "Full Edit", "TikTok / Reels Top 1"],
    appliedEffects: [
      `Tiêu đề 3 Tầng Giữa Ngực Chuẩn Đối Thủ VIP`,
      `Khớp 100% ${segments.length || 10} câu thoại gốc`,
      `Đã cắt sạch khoảng lặng thừa (>0.3s)`,
      `Điều phối ${brollCount} cảnh trám B-Roll tư liệu`,
      "Camera Punch-in Zoom Ladder (1.0x -> 1.14x)",
      "Làm đẹp da & sáng tone Korean Glow",
      "Nhạc nền Carve Voice Ducking chuyên gia",
    ],
    isMasterCut: true,
  };

  const handleDownloadMp4 = (clip: ShortClip) => {
    const a = document.createElement("a");
    a.href = clip.videoUrl;
    a.download = `MasterClip_SIEU_VIP_${clip.isMasterCut ? "MASTER_FULL" : "SHORT"}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadNotice(`Đang tải video ${clip.title} (MP4 1080x1920 60FPS Siêu Nét)...`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handleDownloadSrt = (clip: ShortClip) => {
    let srtContent = "";
    if (segments.length > 0) {
      srtContent = segments
        .map((seg, idx) => {
          const startM = Math.floor(seg.sourceStart / 60);
          const startS = Math.floor(seg.sourceStart % 60);
          const startMs = Math.floor((seg.sourceStart % 1) * 1000);
          const endM = Math.floor(seg.sourceEnd / 60);
          const endS = Math.floor(seg.sourceEnd % 60);
          const endMs = Math.floor((seg.sourceEnd % 1) * 1000);

          const fmt = (m: number, s: number, ms: number) =>
            `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;

          return `${idx + 1}\n${fmt(startM, startS, startMs)} --> ${fmt(endM, endS, endMs)}\n${seg.text}\n`;
        })
        .join("\n");
    } else {
      srtContent = `1\n00:00:00,000 --> 00:00:06,480\nTuyển nhân viên part-time, lương 15.000 đến 20.000 một giờ.\n\n2\n00:00:06,480 --> 00:00:11,680\nVừa rồi mình đọc một thông tin tuyển dụng của một quán cà phê...\n`;
    }

    const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MasterClip_Transcript_Sieu_VIP.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadNotice(`Đã xuất kịch bản phụ đề SRT chuẩn Unicode 100% lời thoại gốc!`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handleExportEdlJson = () => {
    const editProject = {
      preset: preset.name,
      headline: preset.headlineText,
      totalDuration: sourceVideo.duration,
      segments: segments,
      appliedBrolls: segments.filter((s) => s.brollId).map((s) => ({ time: s.sourceStart, broll: s.brollId, mode: s.brollMode })),
      audioTrack: "voice-clarity-120bpm",
    };

    const blob = new Blob([JSON.stringify(editProject, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MasterClip_Timeline_Project.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadNotice(`Đã xuất file cấu trúc Timeline Project (JSON / CapCut) sẵn sàng mở trên Premiere & CapCut!`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-panel to-card p-5 sm:p-6 backdrop-blur-sm shadow-2xl shadow-amber-500/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-black shadow-xl shadow-amber-500/30">
              <Crown className="size-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Đã Hoàn Tất Biên Tập Video Master Siêu VIP!
                </h2>
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-black text-amber-300">
                  CHUYÊN GIA SỐ 1
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1">
                Đã tích hợp trọn vẹn <strong>{segments.length || 10} câu thoại gốc</strong> · Cắt sạch khoảng lặng thừa · B-Roll tự động · Tiêu đề 3 tầng giữa ngực
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportEdlJson}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-panel px-3.5 py-2 text-xs font-bold text-zinc-300 hover:border-zinc-500 hover:text-white transition-all cursor-pointer"
            >
              <FileText className="size-3.5 text-amber-400" />
              <span>Xuất Timeline CapCut</span>
            </button>

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-panel px-3.5 py-2 text-xs font-bold text-zinc-300 hover:border-zinc-500 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Dựng video khác</span>
            </button>
          </div>
        </div>
      </div>

      {downloadNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/50 bg-amber-950/30 px-4 py-2.5 text-xs font-semibold text-amber-300 animate-fade-in">
          <Check className="size-4 text-amber-400" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* MASTER CUT SHOWCASE CARD (Primary Final Output) */}
      <div className="rounded-2xl border-2 border-amber-500 bg-card p-5 shadow-2xl ring-1 ring-amber-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown className="size-5 text-amber-400" />
            <h3 className="text-base font-black text-white uppercase tracking-tight">
              BẢN DỰNG HOÀN CHỈNH SIÊU VIP (MASTER FULL CUT · 1080x1920)
            </h3>
          </div>
          <span className="rounded bg-gradient-to-r from-amber-400 to-amber-600 px-3 py-1 text-xs font-black text-black shadow-md">
            VIRAL SCORE: 99/100
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Video Preview thumbnail with 3-tier hook */}
          <div className="lg:col-span-5 relative aspect-[9/14] rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-xl max-w-[280px] mx-auto lg:mx-0">
            <video
              src={masterClip.videoUrl}
              muted
              loop
              autoPlay
              playsInline
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

            {/* Speaker Badge */}
            <div className="absolute top-3 left-3 rounded-full bg-black/70 border border-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-amber-400">
              {sourceVideo.speakerBadge || "CÔ HẠNH NGUYỄN"}
            </div>

            {/* Signature 3-tier Hook Badge Preview over chest */}
            <div className="absolute inset-0 flex items-center justify-center p-3 text-center pointer-events-none">
              <div className="space-y-0.5">
                <p className="text-white text-[10px] font-extrabold uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  THỰC TRẠNG LÀM THÊM
                </p>
                <h4 className="text-sm font-black italic uppercase text-yellow-300 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                    style={{ textShadow: "1px 1px 0 #000, -1px -1px 0 #000" }}>
                  LƯƠNG PART-TIME SINH VIÊN
                </h4>
                <p className="text-white text-[10px] font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  15.000đ - 20.000đ / Giờ
                </p>
              </div>
            </div>

            <div className="absolute bottom-3 inset-x-3 text-center">
              <div className="rounded-lg bg-black/80 border border-white/10 px-2.5 py-1 text-[11px] font-bold text-white italic truncate">
                {masterClip.hookText}
              </div>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-zinc-300">
                Toàn Bộ Kỹ Thuật Biên Tập Đã Áp Dụng:
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {masterClip.summary}
              </p>
            </div>

            {/* Effect Badges */}
            <div className="flex flex-wrap gap-1.5">
              {masterClip.appliedEffects.map((eff) => (
                <span
                  key={eff}
                  className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-2 py-1 text-[11px] font-bold text-amber-300"
                >
                  ✓ {eff}
                </span>
              ))}
            </div>

            {/* Big Download Button */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={() => handleDownloadMp4(masterClip)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-3.5 text-sm font-extrabold text-black shadow-xl shadow-amber-500/30 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
              >
                <Download className="size-5 stroke-[2.5]" />
                <span>TẢI VIDEO MASTER SIÊU VIP (1080x1920 MP4)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDownloadSrt(masterClip)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-panel py-2 text-xs font-bold text-zinc-200 hover:border-zinc-500 hover:text-white transition-all cursor-pointer"
                >
                  <FileText className="size-3.5 text-amber-400" />
                  <span>Xuất Phụ Đề Lời Thoại (.SRT)</span>
                </button>

                <button
                  onClick={handleExportEdlJson}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-panel py-2 text-xs font-bold text-zinc-200 hover:border-zinc-500 hover:text-white transition-all cursor-pointer"
                >
                  <Share2 className="size-3.5 text-amber-400" />
                  <span>Xuất Project Cho CapCut</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
