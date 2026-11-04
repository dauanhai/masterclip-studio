import React, { useState, useRef } from "react";
import { 
  CloudUpload, 
  Link2, 
  Sparkles, 
  Video, 
  Play, 
  Check, 
  FileCheck,
  AlertCircle 
} from "lucide-react";
import { VideoSource } from "../types";
import { formatFileSize, formatTime } from "../lib/utils";

interface UploadDropzoneProps {
  currentVideo: VideoSource | null;
  onSelectVideo: (video: VideoSource) => void;
  onClearVideo: () => void;
}

const SAMPLE_VIDEOS: VideoSource[] = [
  {
    id: "sample-1",
    name: "Video mẫu 1 — Bài giảng / Talking Head",
    url: "/samples/sample1.mp4",
    size: 2512258,
    duration: 32,
    isSample: true,
  },
  {
    id: "sample-2",
    name: "Video mẫu 2 — B-Roll & Du Lịch Điện Ảnh",
    url: "/samples/sample2.mp4",
    size: 2580221,
    duration: 45,
    isSample: true,
  },
  {
    id: "sample-3",
    name: "Video mẫu 3 — Review Sản Phẩm Đời Sống",
    url: "/samples/sample3.mp4",
    size: 2770846,
    duration: 38,
    isSample: true,
  },
];

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  currentVideo,
  onSelectVideo,
  onClearVideo,
}) => {
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setLoadingMsg("Đang đọc video...");
    const objectUrl = URL.createObjectURL(file);
    
    // Create temporary video element to get duration
    const tempVideo = document.createElement("video");
    tempVideo.src = objectUrl;
    tempVideo.onloadedmetadata = () => {
      onSelectVideo({
        id: `local-${Date.now()}`,
        name: file.name,
        url: objectUrl,
        size: file.size,
        duration: Math.round(tempVideo.duration) || 60,
        isSample: false,
      });
      setLoadingMsg("");
    };
    tempVideo.onerror = () => {
      // Fallback if metadata fails
      onSelectVideo({
        id: `local-${Date.now()}`,
        name: file.name,
        url: objectUrl,
        size: file.size,
        duration: 45,
        isSample: false,
      });
      setLoadingMsg("");
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      processFile(file);
    } else {
      alert("Vui lòng thả đúng định dạng file video (MP4, MOV, WEBM).");
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoadingMsg("Đang kết nối liên kết...");
    setTimeout(() => {
      // Pick a sample video to simulate fetching
      const matched = SAMPLE_VIDEOS[0];
      onSelectVideo({
        id: `url-${Date.now()}`,
        name: `Video từ liên kết (${urlInput.substring(0, 30)}...)`,
        url: matched.url,
        size: 15400000,
        duration: 75,
        isSample: false,
      });
      setUrlInput("");
      setLoadingMsg("");
    }, 700);
  };

  return (
    <div className="w-full">
      {/* If no video is selected yet */}
      {!currentVideo ? (
        <div className="mx-auto max-w-2xl">
          {/* Main Dropzone & Link Input Card */}
          <div className="relative rounded-2xl border border-zinc-800 bg-card/90 p-5 shadow-2xl backdrop-blur-sm sm:p-7">
            {/* Ambient gold glow */}
            <div className="absolute -top-16 left-1/2 -z-10 h-32 w-80 -translate-x-1/2 bg-amber-500/15 blur-3xl rounded-full pointer-events-none" />

            <div className="text-center mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 border border-brand/30 px-3 py-1 text-xs font-semibold text-brand mb-2">
                <Sparkles className="size-3.5" /> Công Nghệ Cắt Short Tự Động Bằng AI
              </span>
              <h2 className="text-xl font-extrabold text-white sm:text-2xl tracking-tight">
                Kéo Thả Video Dài Cần Cắt Short
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                AI quét toàn bộ lời thoại, phân tích nhịp cảm xúc và trích xuất thành 3 - 5 đoạn Short viral ngay lập tức.
              </p>
            </div>

            {/* Dán link */}
            <form onSubmit={handleUrlSubmit} className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Link2 className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Dán liên kết YouTube, Google Drive, TikTok hoặc video URL..."
                  className="h-11 w-full rounded-xl border border-zinc-700/80 bg-panel pl-10 pr-4 text-xs text-zinc-200 outline-none transition-all placeholder:text-zinc-500 focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
              <button
                type="submit"
                disabled={!urlInput.trim()}
                className="h-11 px-5 rounded-xl bg-gradient-to-r from-brand to-gold-400 text-black text-xs font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                Lấy Video
              </button>
            </form>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <span className="relative bg-card px-3 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                Hoặc kéo thả file
              </span>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-brand bg-brand/5 scale-[1.01]"
                  : "border-zinc-700/70 bg-panel/60 hover:border-brand/70 hover:bg-panel"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
                onChange={handleFileChange}
              />
              
              <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 text-brand group-hover:scale-110 transition-transform">
                <CloudUpload className="size-7" />
              </div>

              <div className="text-sm font-bold text-zinc-200 group-hover:text-white">
                Kéo thả file video vào đây hoặc <span className="text-brand underline underline-offset-2">chọn từ máy tính</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Hỗ trợ MP4, MOV, WEBM dung lượng lên tới 2GB (Xử lý 100% riêng tư trên trình duyệt)
              </p>
            </div>

            {loadingMsg && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-brand animate-pulse">
                <Sparkles className="size-4" />
                {loadingMsg}
              </div>
            )}
          </div>

          {/* Quick Select Sample Videos for testing without upload */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                ⚡ Hoặc bấm thử ngay với Video Mẫu có sẵn:
              </span>
              <span className="text-[11px] text-zinc-500">Không cần tải file</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_VIDEOS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectVideo(sample)}
                  className="group relative flex items-center gap-3 rounded-xl border border-zinc-800 bg-card p-3 text-left transition-all hover:border-brand/60 hover:bg-panel hover:shadow-lg"
                >
                  <div className="relative flex size-12 shrink-0 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
                    <video
                      src={sample.url}
                      className="size-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="size-4 fill-white text-white group-hover:text-brand group-hover:fill-brand ml-0.5" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-xs font-bold text-zinc-200 group-hover:text-brand">
                      {sample.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
                      <span>{formatTime(sample.duration)}</span>
                      <span>•</span>
                      <span>{formatFileSize(sample.size)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Video Selected Banner / Status Header */
        <div className="rounded-xl border border-brand/30 bg-card p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-10 items-center justify-center rounded-lg bg-brand/10 border border-brand/30 text-brand shrink-0">
              <Video className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-xs sm:text-sm font-bold text-white">
                  {currentVideo.name}
                </h3>
                {currentVideo.isSample && (
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-semibold text-zinc-300">
                    Mẫu có sẵn
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-0.5">
                <span>Thời lượng gốc: <strong>{formatTime(currentVideo.duration)}</strong></span>
                <span>•</span>
                <span>Dung lượng: <strong>{formatFileSize(currentVideo.size)}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="size-3" /> Đã sẵn sàng nạp Preset
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-zinc-700 bg-panel px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white"
            >
              Đổi video khác
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={onClearVideo}
              className="rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-900/40"
            >
              Gỡ bỏ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
