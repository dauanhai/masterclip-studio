import React, { useState } from "react";
import { 
  Sparkles, 
  Crown, 
  FolderGit2, 
  Settings, 
  Globe, 
  CheckCircle2, 
  Play, 
  ExternalLink,
  HelpCircle,
  X
} from "lucide-react";

import { StudioMode } from "../types";

interface HeaderProps {
  onShowPricing: () => void;
  onShowHistory: () => void;
  studioMode: StudioMode;
  onSelectStudioMode: (mode: StudioMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onShowPricing,
  onShowHistory,
  studioMode,
  onSelectStudioMode,
}) => {
  const [showDocsModal, setShowDocsModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 h-16 border-b border-brand/20 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-brand to-gold-400 opacity-60 blur-sm"></div>
              <div className="relative flex size-10 items-center justify-center rounded-xl border border-brand/40 bg-card text-brand">
                <Play className="size-5 fill-brand ml-0.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white sm:text-2xl">
                  Master<span className="gold-text">Clip</span>
                </span>
                <span className="rounded-full bg-brand/10 border border-brand/30 px-2 py-0.5 text-[10px] font-bold text-brand uppercase tracking-wider">
                  AI Studio
                </span>
              </div>
              <p className="hidden text-[11px] text-zinc-400 sm:block">
                Auto-Pilot Agent Tổng & Clone Video Từ Link Mẫu
              </p>
            </div>
          </div>

          {/* Center Mode Switcher */}
          <div className="hidden md:flex items-center rounded-xl border border-zinc-800 bg-panel/80 p-1 shadow-inner">
            <button
              onClick={() => onSelectStudioMode("superpower")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                studioMode === "superpower"
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="size-3.5" />
              <span>⚡ Agent Tổng Superpower</span>
            </button>

            <button
              onClick={() => onSelectStudioMode("template-clone")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                studioMode === "template-clone"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="size-3.5" />
              <span>🎬 Clone Video Từ Link Mẫu + Ảnh</span>
            </button>
          </div>

          {/* Quick Stats & Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onShowHistory}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-panel px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
            >
              <FolderGit2 className="size-3.5 text-zinc-400" />
              <span className="hidden md:inline">Thư viện dự án</span>
            </button>

            <button
              onClick={() => setShowDocsModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-panel px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
            >
              <HelpCircle className="size-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Hướng dẫn</span>
            </button>

            <button
              onClick={onShowPricing}
              className="relative group overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-black shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-amber-500 active:scale-95"
            >
              <div className="flex items-center gap-1.5">
                <Crown className="size-3.5 fill-black" />
                <span>Nâng cấp VIP</span>
              </div>
            </button>

            {/* Profile Avatar simulation */}
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
              <div className="size-8 rounded-full bg-gradient-to-tr from-brand to-pink-500 p-0.5 cursor-pointer">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-card text-xs font-bold text-zinc-200">
                  VN
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Docs / Guide Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-card p-6 shadow-2xl">
            <button
              onClick={() => setShowDocsModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Quy Trình Tạo Video Short Viral</h3>
                <p className="text-xs text-zinc-400">Chỉ 3 bước đơn giản để tạo nội dung triệu view</p>
              </div>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-panel/50 p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-extrabold text-black">
                  1
                </span>
                <div>
                  <h4 className="font-semibold text-zinc-200">Kéo Thả Video Dài</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tải video bài giảng, podcast, review, hoặc video thô từ điện thoại/máy tính (hoặc chọn video mẫu có sẵn).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-panel/50 p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-extrabold text-black">
                  2
                </span>
                <div>
                  <h4 className="font-semibold text-zinc-200">Chọn Preset Phong Cách Viral</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Chọn phong cách phù hợp: <strong>Korean Glow</strong> (làm đẹp da), <strong>Hero Neon</strong> (Alex Hormozi), <strong>Podcast</strong> (cắt lặng 100%)...
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-panel/50 p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-extrabold text-black">
                  3
                </span>
                <div>
                  <h4 className="font-semibold text-zinc-200">Xem Trước 9:16 & Xuất Video</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Hệ thống AI tự động phát hiện các đoạn hook hay nhất, cắt thành 3 clip ngắn, thêm phụ đề và cho tải file MP4 chất lượng cao.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDocsModal(false)}
              className="mt-6 w-full rounded-xl bg-brand py-2.5 text-xs font-bold text-black hover:bg-gold-400"
            >
              Đã hiểu, Bắt đầu ngay
            </button>
          </div>
        </div>
      )}
    </>
  );
};
