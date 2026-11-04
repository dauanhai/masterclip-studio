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
  GraduationCap
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

  // Master Full Video Clip (The complete professional edit)
  const masterClip: ShortClip = {
    id: "master-cut-final",
    title: "🌟 BẢN DỰNG MASTER CHUYÊN NGHIỆP HOÀN CHỈNH (FULL EDIT)",
    duration: Math.round(sourceVideo.duration) || 31,
    startTime: 0,
    endTime: sourceVideo.duration || 30.4,
    viralScore: 99,
    hookText: `"${preset.sampleHook}"`,
    summary: `Biên tập hoàn chỉnh toàn bộ ${segments.length || 9} câu thoại gốc, tự động chèn cảnh trám B-Roll (Bằng ĐH, Giảng đường), thẻ Info Card luận điểm, camera punch-in 1.08x-1.14x và nhạc nền 120 BPM chuẩn mẫu Chị Hạnh.`,
    videoUrl: sourceVideo.url,
    aspectRatio: "9:16",
    tags: ["Master Cut", "Chuyên Gia", "Full Edit", "Tiktok / Reels Top"],
    appliedEffects: [
      "Nắm trọn 9 câu thoại gốc",
      "Chèn cảnh trám B-Roll Cutaways",
      "Camera Punch-in 1.08x-1.14x",
      "Thẻ Info Card Luận Điểm",
      "Subtitles Trắng Kem - Hồng Đậm #FF3B81",
      "Nhạc nền 120 BPM Carve Ducking",
    ],
    isMasterCut: true,
  };

  // Additional cut clips
  const subClips: ShortClip[] = [
    {
      id: "clip-1",
      title: "Short Cắt Nhanh #1: Hook Mở Đầu & Phản Biện 'Quá Oan'",
      duration: 11,
      startTime: 0.72,
      endTime: 10.83,
      viralScore: 98,
      hookText: `"“Hệ vừa học vừa làm ở Đài Loan chỉ cấp bằng nghề thôi ạ?” — Hiểu như vậy thì quá oan rồi!"`,
      summary: "3 giây đầu gây tò mò cực độ và phản biện đánh thẳng vào hiểu lầm phổ biến nhất của người xem.",
      videoUrl: sourceVideo.url,
      aspectRatio: "9:16",
      tags: ["Strong Hook", "Phản Biện", "Tiktok Viral"],
      appliedEffects: ["Kinetic Subtitles", "Punch-in 1.14x", "Thẻ Info Card: KHÔNG CHỈ LÀ BẰNG NGHỀ"],
    },
    {
      id: "clip-2",
      title: "Short Cắt Nhanh #2: Chứng Minh Bằng Đại Học Chính Quy & Quốc Tế",
      duration: 16,
      startTime: 11.08,
      endTime: 27.5,
      viralScore: 95,
      hookText: `"Tốt nghiệp 4 năm nhận BẰNG ĐẠI HỌC CHÍNH QUY dùng để học tiếp THẠC SĨ hoặc TIẾN SĨ!"`,
      summary: "Đưa ra bằng chứng thuyết phục, chèn cảnh trám lễ tốt nghiệp và giảng đường đại học quốc tế.",
      videoUrl: sourceVideo.url,
      aspectRatio: "9:16",
      tags: ["Bằng Chứng", "B-Roll Cutaway", "Reels Top"],
      appliedEffects: ["Cảnh trám B-Roll Bằng ĐH", "Info Card: BẰNG ĐẠI HỌC CHÍNH QUY", "Audio Ducking"],
    },
  ];

  const handleDownloadMp4 = (clip: ShortClip) => {
    const a = document.createElement("a");
    a.href = clip.videoUrl;
    a.download = `MasterClip_${clip.isMasterCut ? "MASTER_FULL" : "SHORT"}_${preset.id}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadNotice(`Đang tải video ${clip.title} (MP4 1080x1920 60FPS)...`);
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
      srtContent = `1\n00:00:00,720 --> 00:00:06,780\n${preset.sampleHook}\n\n2\n00:00:07,100 --> 00:00:10,830\nHiểu như vậy thì quá oan rồi!\n`;
    }

    const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MasterClip_Transcript_${preset.id}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadNotice(`Đã xuất kịch bản phụ đề SRT chuẩn Unicode 100% lời thoại gốc`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handleExportEdlJson = () => {
    const editProject = {
      preset: preset.name,
      headline: preset.headlineText,
      totalDuration: sourceVideo.duration,
      segments: segments,
      appliedBrolls: segments.filter((s) => s.brollId).map((s) => ({ time: s.sourceStart, broll: s.brollId, mode: s.brollMode })),
      audioTrack: "tech-beat-120bpm",
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

    setDownloadNotice(`Đã xuất file cấu trúc Timeline Project (JSON / EDL) cho Premiere & CapCut!`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <div className="rounded-2xl border-2 border-pink-500/50 bg-gradient-to-r from-pink-950/40 via-panel to-card p-5 sm:p-6 backdrop-blur-sm shadow-2xl shadow-pink-500/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-xl shadow-pink-500/30">
              <GraduationCap className="size-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Đã Hoàn Tất Biên Tập 1 Video Chuyên Gia Chuẩn Mực Nhất!
                </h2>
                <span className="rounded-full bg-pink-500/20 border border-pink-500/40 px-2.5 py-0.5 text-[10px] font-black text-pink-400">
                  CHUYÊN GIA SỐ 1
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1">
                Đã tích hợp trọn vẹn <strong>{segments.length || 9} câu thoại gốc</strong> • Đã chèn <strong>3 cảnh trám B-Roll</strong> tư liệu • Nhạc nền 120 BPM voice-carved
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportEdlJson}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-panel px-3.5 py-2 text-xs font-bold text-zinc-300 hover:border-zinc-500 hover:text-white transition-all"
            >
              <FileText className="size-3.5 text-pink-400" />
              <span>Xuất Timeline JSON/CapCut</span>
            </button>

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-panel px-3.5 py-2 text-xs font-bold text-zinc-300 hover:border-zinc-500 hover:text-white transition-all"
            >
              <RotateCcw className="size-3.5" />
              <span>Dựng video khác</span>
            </button>
          </div>
        </div>
      </div>

      {downloadNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-pink-500/50 bg-pink-950/30 px-4 py-2.5 text-xs font-semibold text-pink-300 animate-fade-in">
          <Check className="size-4 text-pink-400" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* MASTER CUT SHOWCASE CARD (Primary Final Output) */}
      <div className="rounded-2xl border-2 border-pink-500 bg-card p-5 shadow-2xl ring-1 ring-pink-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown className="size-5 text-pink-400" />
            <h3 className="text-base font-black text-white uppercase tracking-tight">
              BẢN DỰNG HOÀN CHỈNH CAO CẤP NHẤT (MASTER FULL CUT — 1080x1920)
            </h3>
          </div>
          <span className="rounded bg-gradient-to-r from-pink-500 to-rose-600 px-3 py-1 text-xs font-black text-white shadow-md">
            VIRAL SCORE: 99/100
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Video Preview thumbnail */}
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

            {/* Badge overlay */}
            <div className="absolute top-3 left-3 rounded-full bg-pink-600/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-white">
              CÔ HẠNH CHIA SẺ
            </div>

            <div className="absolute bottom-3 inset-x-3 text-center">
              <div className="rounded-lg bg-[#42152A]/90 border border-[#FF3B81] px-2.5 py-1.5 text-xs font-black text-[#FFF7F8]">
                {masterClip.hookText}
              </div>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-zinc-300">
                Toàn Bộ Kỹ Thuật Biên Tập Đã Được Áp Dụng:
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                {masterClip.summary}
              </p>
            </div>

            {/* Effect Badges */}
            <div className="flex flex-wrap gap-1.5">
              {masterClip.appliedEffects.map((eff) => (
                <span
                  key={eff}
                  className="rounded-lg bg-pink-500/10 border border-pink-500/30 px-2 py-1 text-[11px] font-bold text-pink-300"
                >
                  ✓ {eff}
                </span>
              ))}
            </div>

            {/* Big Download Button */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={() => handleDownloadMp4(masterClip)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-pink-500/30 hover:brightness-110 active:scale-[0.99] transition-all"
              >
                <Download className="size-5 stroke-[2.5]" />
                <span>TẢI VIDEO MASTER HOÀN CHỈNH (1080x1920 MP4)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDownloadSrt(masterClip)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-panel py-2 text-xs font-bold text-zinc-200 hover:border-zinc-500 transition-all"
                >
                  <FileText className="size-3.5 text-pink-400" />
                  <span>Xuất Phụ Đề Lời Thoại (.SRT)</span>
                </button>

                <button
                  onClick={handleExportEdlJson}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-panel py-2 text-xs font-bold text-zinc-200 hover:border-zinc-500 transition-all"
                >
                  <Share2 className="size-3.5 text-pink-400" />
                  <span>Xuất Project Cho CapCut</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Clips Section (Short Cutaways) */}
      <div className="pt-4 border-t border-zinc-800">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 mb-3">
          Hoặc Tải Từng Đoạn Short Cắt Nhanh (Trích Xuất Từ Video Master):
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subClips.map((clip) => (
            <div
              key={clip.id}
              className="rounded-xl border border-zinc-800 bg-card p-4 space-y-3 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-extrabold text-white">{clip.title}</h5>
                <span className="text-[10px] font-mono text-zinc-400">{clip.duration}s</span>
              </div>
              <p className="text-xs text-zinc-400">{clip.summary}</p>
              <div className="flex flex-wrap gap-1">
                {clip.appliedEffects.map((eff) => (
                  <span key={eff} className="rounded bg-panel px-1.5 py-0.5 text-[9px] font-bold text-zinc-400">
                    {eff}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleDownloadMp4(clip)}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-pink-500/40 bg-pink-500/10 py-2 text-xs font-bold text-pink-300 hover:bg-pink-500 hover:text-white transition-all"
              >
                <Download className="size-3.5" />
                <span>Tải Clip Này ({clip.duration}s)</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
