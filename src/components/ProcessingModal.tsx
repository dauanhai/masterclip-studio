import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Bot, 
  AudioWaveform, 
  Wand2, 
  Film, 
  Download,
  X 
} from "lucide-react";
import confetti from "canvas-confetti";
import { Preset, VideoSource } from "../types";

interface ProcessingModalProps {
  isOpen: boolean;
  video: VideoSource;
  preset: Preset;
  onComplete: () => void;
  onCancel: () => void;
}

interface Step {
  id: number;
  label: string;
  detail: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  {
    id: 1,
    label: "Phân tích ngữ âm & Trích xuất lời thoại",
    detail: "Đang chạy mô hình Whisper AI nhận diện phụ đề tiếng Việt...",
    icon: AudioWaveform,
  },
  {
    id: 2,
    label: "Quét đoạn Hook cao trào & Chấm điểm Viral Score",
    detail: "Tìm kiếm các câu nói gây kích thích trí tò mò & giữ chân người xem...",
    icon: Sparkles,
  },
  {
    id: 3,
    label: "Cắt khoảng lặng & Căn chỉnh tỉ lệ 9:16",
    detail: "Tự động loại bỏ các khoảng chết âm thanh, zoom cận chủ thể...",
    icon: Film,
  },
  {
    id: 4,
    label: "Áp dụng Preset & Tạo phụ đề động",
    detail: "Tô màu phong cách, hiệu ứng làm đẹp da và phối nhạc nền thông minh...",
    icon: Wand2,
  },
  {
    id: 5,
    label: "Hoàn tất render 3 video Short thành phẩm",
    detail: "Đóng gói video độ phân giải cao và chuẩn bị file tải về...",
    icon: CheckCircle2,
  },
];

export const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  video,
  preset,
  onComplete,
  onCancel,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgress(0);
      setLogs([]);
      return;
    }

    setLogs([`Bắt đầu xử lý: "${video.name}"`]);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#F59E0B", "#FBBF24", "#FF007F", "#10B981"],
          });
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }

        const next = prev + 1.25;
        // Determine current step based on progress
        const stepIdx = Math.min(Math.floor((next / 100) * STEPS.length), STEPS.length - 1);
        setCurrentStepIndex(stepIdx);

        // Add periodic logs
        if (Math.round(next) === 20) {
          setLogs((l) => [...l, `[Whisper AI] Nhận diện 420 từ thoại tiếng Việt với độ chính xác 99.2%`]);
        } else if (Math.round(next) === 45) {
          setLogs((l) => [...l, `[Viral Scorer] Phát hiện 3 đoạn cao trào xuất sắc (Điểm viral: 96/100, 92/100, 90/100)`]);
        } else if (Math.round(next) === 70) {
          setLogs((l) => [...l, `[Auto Trim] Đã cắt bỏ 4.8 giây khoảng lặng, tăng tốc nhịp 1.15x`]);
        } else if (Math.round(next) === 88) {
          setLogs((l) => [...l, `[Audio Ducking] Đã hòa âm nhạc nền ${preset.bgmMood} tự động giảm -80% khi có tiếng nói`]);
        }

        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isOpen, onComplete, preset.bgmMood, video.name]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-card p-6 shadow-2xl">
        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Hủy bỏ quá trình"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex size-12 items-center justify-center rounded-2xl bg-brand/10 border border-brand/30 text-brand">
            <Bot className="size-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">
                MasterClip AI Đang Xử Lý Video
              </h3>
              <span className="rounded bg-brand/20 px-1.5 py-0.5 text-[10px] font-bold text-brand">
                {Math.round(progress)}%
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Đang áp dụng Preset: <span className="text-white font-semibold">{preset.name}</span>
            </p>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="mb-6">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand via-amber-400 to-gold-400 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Pipeline Steps List */}
        <div className="space-y-3 mb-6">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isFinished = idx < currentStepIndex || progress === 100;
            const isCurrent = idx === currentStepIndex && progress < 100;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 rounded-xl border p-2.5 transition-all ${
                  isFinished
                    ? "border-emerald-500/30 bg-emerald-950/10 text-emerald-300"
                    : isCurrent
                    ? "border-brand/40 bg-brand/5 text-white shadow-md shadow-brand/5"
                    : "border-zinc-800/60 bg-panel/30 text-zinc-500 opacity-60"
                }`}
              >
                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center">
                  {isFinished ? (
                    <CheckCircle2 className="size-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="size-5 text-brand animate-spin" />
                  ) : (
                    <Icon className="size-4 text-zinc-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold">{step.label}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">{step.detail}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Terminal Log simulation */}
        <div className="rounded-xl border border-zinc-800 bg-black/60 p-3 font-mono text-[10px] text-zinc-400">
          <div className="text-zinc-500 mb-1 font-bold">─── NHẬT KÝ TIẾN TRÌNH AI ───</div>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="text-emerald-400/90 truncate">
                › {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
