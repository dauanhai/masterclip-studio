import React, { useState, useEffect } from "react";
import { 
  Mic, 
  Sparkles, 
  Check, 
  Volume2, 
  Edit3, 
  Type, 
  BadgeAlert, 
  ArrowRight, 
  ClipboardPaste, 
  FileText,
  AudioWaveform,
  Play,
  RotateCcw
} from "lucide-react";
import { TranscriptSegment, VideoSource } from "../types";
import { formatTime } from "../lib/utils";
import { parseCustomScript } from "../lib/videoAnalysis";
import {
  CHANH_FULL_TRANSCRIPT,
  CHANH_LUONG_LAM_THEM_TRANSCRIPT,
  CHANH_HOSO_TRANSCRIPT,
} from "../data/brollAndTranscript";

interface TranscriptionModalProps {
  isOpen: boolean;
  video: VideoSource;
  initialTitle: string;
  initialBadge: string;
  initialSegments: TranscriptSegment[];
  onConfirm: (data: {
    videoTitle: string;
    speakerBadge: string;
    segments: TranscriptSegment[];
  }) => void;
  onCancel: () => void;
}

export const TranscriptionModal: React.FC<TranscriptionModalProps> = ({
  isOpen,
  video,
  initialTitle,
  initialBadge,
  initialSegments,
  onConfirm,
  onCancel,
}) => {
  const [phase, setPhase] = useState<"scanning" | "review">("scanning");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Đang cô lập dải tần giọng nói người nói (Voice Isolation)...");
  
  const [videoTitle, setVideoTitle] = useState(initialTitle);
  const [speakerBadge, setSpeakerBadge] = useState(initialBadge);
  const [segments, setSegments] = useState<TranscriptSegment[]>(initialSegments);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPasteCustom, setShowPasteCustom] = useState(false);
  const [customScriptText, setCustomScriptText] = useState("");

  // Synchronize when initial props change
  useEffect(() => {
    setVideoTitle(initialTitle);
    setSpeakerBadge(initialBadge);
    setSegments(initialSegments);
  }, [initialTitle, initialBadge, initialSegments]);

  // Audio scan simulation
  useEffect(() => {
    if (!isOpen) return;
    setPhase("scanning");
    setProgress(15);
    setStatusText("Đang nhận dạng tần số giọng nói & khử tạp âm nền (Voice Activity Detection)...");

    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText("Whisper Speech-to-Text: Đang bóc tách từng từ ngữ chuẩn xác 100%...");
    }, 700);

    const t2 = setTimeout(() => {
      setProgress(80);
      setStatusText("AI Beat Segmentation: Tách câu theo nhịp thở & gắn mốc thời gian...");
    }, 1400);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText("Hoàn tất trích xuất toàn bộ lời thoại gốc!");
      setTimeout(() => {
        setPhase("review");
      }, 500);
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, video.id]);

  if (!isOpen) return null;

  const handleUpdateSegmentText = (id: string, text: string) => {
    setSegments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text } : s))
    );
  };

  const handleApplyCustomScript = () => {
    if (!customScriptText.trim()) return;
    const dur = video.duration || 30;
    const newSegs = parseCustomScript(customScriptText, dur);
    setSegments(newSegs);
    setShowPasteCustom(false);
  };

  const handleFinalConfirm = () => {
    onConfirm({
      videoTitle,
      speakerBadge,
      segments,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl border border-pink-500/40 bg-[#121216] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow backdrop */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-48 w-96 -translate-x-1/2 bg-pink-500/20 blur-3xl rounded-full" />

        {/* Phase 1: Scanning Audio & Transcribing */}
        {phase === "scanning" ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative flex size-24 items-center justify-center rounded-3xl bg-pink-500/20 border-2 border-pink-500 shadow-2xl shadow-pink-500/30">
              <Mic className="size-12 text-pink-400 animate-pulse" />
              <div className="absolute inset-0 rounded-3xl border border-pink-400 animate-ping opacity-40 pointer-events-none" />
            </div>

            <div className="space-y-2 max-w-md">
              <span className="rounded-full bg-pink-500/10 border border-pink-500/30 px-3 py-1 text-xs font-black uppercase text-pink-400">
                AI SPEECH-TO-TEXT • BƯỚC 1
              </span>
              <h3 className="text-xl font-extrabold text-white">
                Đang Trích Xuất Lời Thoại Gốc Của Video
              </h3>
              <p className="text-xs text-zinc-400">
                File: <strong className="text-zinc-200">{video.name}</strong> ({formatTime(video.duration)})
              </p>
            </div>

            {/* Audio Wave Bars Animation */}
            <div className="flex items-center gap-1.5 h-10 py-2">
              {[40, 70, 30, 90, 60, 100, 45, 80, 95, 50, 85, 40, 75, 60, 90, 35].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-pink-600 to-rose-400 animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${(i * 0.08).toFixed(2)}s`,
                    animationDuration: "0.8s",
                  }}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-md space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span className="text-pink-300 font-semibold">{statusText}</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        ) : (
          /* Phase 2: Review and Confirm Transcribed Dialogue */
          <div className="flex flex-col h-full space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-400 mb-1">
                  <Check className="size-3" /> Đã Trích Xuất Thành Công Lời Thoại Gốc
                </span>
                <h3 className="text-lg font-black text-white">
                  Kiểm Tra & Xác Nhận Lời Thoại Của Video Thô
                </h3>
                <p className="text-xs text-zinc-400">
                  Toàn bộ quy trình edit tiếp theo sẽ bám sát 100% vào các câu thoại bên dưới:
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPasteCustom(!showPasteCustom)}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-panel px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-pink-500 hover:text-white"
                >
                  <ClipboardPaste className="size-3.5 text-pink-400" />
                  <span>Dán kịch bản khác</span>
                </button>
              </div>
            </div>

            {/* Custom Paste Drawer (if requested) */}
            {showPasteCustom && (
              <div className="rounded-xl border border-pink-500/40 bg-black/80 p-3.5 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-pink-300">
                  <span>Dán nội dung lời thoại mới (mỗi câu 1 dòng):</span>
                  <button onClick={() => setShowPasteCustom(false)} className="text-zinc-500 hover:text-white">✕</button>
                </div>
                <textarea
                  rows={4}
                  value={customScriptText}
                  onChange={(e) => setCustomScriptText(e.target.value)}
                  placeholder="Dán câu thoại vào đây..."
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-2 text-xs text-zinc-200 outline-none focus:border-pink-500"
                />
                <button
                  onClick={handleApplyCustomScript}
                  className="rounded-lg bg-pink-500 px-3 py-1 text-xs font-bold text-white hover:bg-pink-400"
                >
                  Áp Dụng Lời Thoại Này
                </button>
              </div>
            )}

            {/* Meta Row: Headline & Speaker Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-2xl border border-zinc-800 bg-card/60">
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                  <BadgeAlert className="size-3 text-pink-400" /> Huy hiệu người nói:
                </label>
                <input
                  type="text"
                  value={speakerBadge}
                  onChange={(e) => setSpeakerBadge(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-1.5 text-xs font-black uppercase text-pink-400 outline-none focus:border-pink-500"
                />
              </div>

              <div className="sm:col-span-8 space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                  <Type className="size-3 text-pink-400" /> Tiêu đề nổi bật (Top Headline Plate):
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Quick Topic Presets Bar - Chọn Lời Thoại Gốc Chuẩn 100% */}
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span className="text-[11px] font-bold text-zinc-400 pl-1 shrink-0">
                ⚡ Chọn nhanh kịch bản gốc:
              </span>
              <button
                type="button"
                onClick={() => {
                  setVideoTitle("SO SÁNH LƯƠNG LÀM THÊM: VIỆT NAM (15K/H) VS ĐÀI LOAN (180K/H)");
                  setSpeakerBadge("CÔ HẠNH NGUYÊN");
                  setSegments(CHANH_LUONG_LAM_THEM_TRANSCRIPT);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold hover:bg-pink-500/30 transition-all cursor-pointer"
              >
                <span>🔥 Mẫu 2: Lương Part-time 15k vs 180k (Cô Hạnh)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVideoTitle("GIẢI OAN HỆ VỪA HỌC VỪA LÀM TẠI ĐÀI LOAN");
                  setSpeakerBadge("CÔ HẠNH NGUYÊN");
                  setSegments(CHANH_FULL_TRANSCRIPT);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
              >
                <span>🎓 Mẫu 1: Giải Oan Bằng Nghề</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVideoTitle("HỒ SƠ BÁO DANH DU HỌC ĐÀI LOAN CẦN CÓ LÀ GÌ?");
                  setSpeakerBadge("CÔ HẠNH NGUYÊN");
                  setSegments(CHANH_HOSO_TRANSCRIPT);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
              >
                <span>📄 Mẫu 3: Hồ Sơ Báo Danh</span>
              </button>
            </div>

            {/* Dialogue Segments List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[340px]">
              {segments.map((seg, idx) => (
                <div
                  key={seg.id}
                  className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-card/40 p-3 hover:border-zinc-700 hover:bg-card/70 transition-all"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-pink-500/20 text-xs font-black text-pink-400 mt-0.5">
                    {idx + 1}
                  </span>
                  
                  <div className="text-[10px] font-mono font-bold text-zinc-500 shrink-0 w-24 pt-1">
                    {formatTime(seg.sourceStart)} ➔ {formatTime(seg.sourceEnd)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={seg.text}
                      onChange={(e) => handleUpdateSegmentText(seg.id, e.target.value)}
                      className="w-full rounded-lg border border-transparent bg-transparent hover:border-zinc-700 focus:border-pink-500 focus:bg-black px-2 py-1 text-xs font-semibold text-zinc-100 outline-none transition-all"
                    />
                  </div>

                  {seg.infoCardText && (
                    <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-1 text-[9px] font-extrabold text-amber-300 shrink-0 hidden sm:inline-block mt-0.5">
                      ✦ {seg.infoCardText}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
              <span className="text-xs text-zinc-400">
                Tổng cộng: <strong className="text-white">{segments.length} câu thoại</strong> ({formatTime(video.duration)})
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={onCancel}
                  className="rounded-xl border border-zinc-700 bg-panel px-4 py-2.5 text-xs font-bold text-zinc-300 hover:text-white"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleFinalConfirm}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-xl shadow-pink-500/25 hover:brightness-110 active:scale-95 transition-all"
                >
                  <span>⚡ XÁC NHẬN LỜI THOẠI & BẮT ĐẦU BIÊN TẬP (TIÊU ĐỀ + CẢNH TRÁM)</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

