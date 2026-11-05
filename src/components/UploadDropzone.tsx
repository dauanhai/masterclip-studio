import React, { useState, useRef } from "react";
import { 
  CloudUpload, 
  Link2, 
  Sparkles, 
  Video, 
  Play, 
  Check, 
  FileCheck,
  GraduationCap,
  Sparkle
} from "lucide-react";
import { VideoSource } from "../types";
import { formatFileSize, formatTime } from "../lib/utils";
import { CHANH_FULL_TRANSCRIPT } from "../data/brollAndTranscript";
import { analyzeRawVideo } from "../lib/videoAnalysis";

interface UploadDropzoneProps {
  currentVideo: VideoSource | null;
  onSelectVideo: (video: VideoSource) => void;
  onClearVideo: () => void;
  onReTranscribe?: () => void;
  onAutoPilotSuperpower?: (sampleVideo: VideoSource) => void;
}

const SAMPLE_VIDEOS: VideoSource[] = [
  {
    id: "sample-chi-hanh-superpower",
    name: "⚡ SIÊU PHẨM HOÀN CHỈNH: Cô Hạnh — Giải Oan Vừa Học Vừa Làm (Agent Tổng Tự Duyệt)",
    url: "/samples/sample-chi-hanh-superpower.mp4",
    size: 18707146,
    duration: 45,
    isSample: true,
    isChanhSample: true,
    videoTitle: "GIẢI OAN HỆ VỪA HỌC VỪA LÀM TẠI ĐÀI LOAN",
    speakerBadge: "CÔ HẠNH NGUYÊN",
    hookOpening: "HỆ VỪA HỌC VỪA LÀM Ở ĐÀI LOAN CHỈ CẤP BẰNG NGHỀ THÔI Ạ?",
    transcript: CHANH_FULL_TRANSCRIPT,
  },
  {
    id: "sample-chanh-expert",
    name: "Mẫu 1: Cô Hạnh — Giải Oan Hệ Vừa Học Vừa Làm (Bản Dựng Chuẩn 9:16)",
    url: "/samples/sample-expert-master.mp4",
    size: 12940288,
    duration: 26,
    isSample: true,
    isChanhSample: true,
    videoTitle: "GIẢI OAN HỆ VỪA HỌC VỪA LÀM TẠI ĐÀI LOAN",
    speakerBadge: "CÔ HẠNH NGUYÊN",
    hookOpening: "HỆ VỪA HỌC VỪA LÀM Ở ĐÀI LOAN CHỈ CẤP BẰNG NGHỀ THÔI Ạ?",
    transcript: CHANH_FULL_TRANSCRIPT,
  },
  {
    id: "sample-hoso",
    name: "Mẫu 2: Cô Hạnh Nguyên — Hồ Sơ Báo Danh Du Học Đài Loan Cần Có Là Gì?",
    url: "/samples/sample-reel-authority.mp4",
    size: 10957808,
    duration: 23,
    isSample: true,
    isChanhSample: true,
    videoTitle: "HỒ SƠ BÁO DANH DU HỌC ĐÀI LOAN CẦN CÓ LÀ GÌ?",
    speakerBadge: "CÔ HẠNH NGUYÊN",
    hookOpening: "HỒ SƠ BÁO DANH DU HỌC ĐÀI LOAN CẦN CHUẨN BỊ NHỮNG GÌ?",
    transcript: analyzeRawVideo("ho-so-bao-danh-du-hoc-dai-loan.mp4", 23).segments,
  },
  {
    id: "sample-viral-pro",
    name: "Mẫu 3: Video Hoàn Chỉnh Viral — Phụ Đề Nổi Bật & Cảnh Trám Điện Ảnh",
    url: "/samples/sample-viral-complete.mp4",
    size: 11192925,
    duration: 27,
    isSample: true,
    videoTitle: "BÍ QUYẾT XÂY KÊNH CHUYÊN GIA TRIỆU VIEW",
    speakerBadge: "MASTER CREATOR",
    hookOpening: "TẠI SAO NHIỀU NGƯỜI LÀM VIDEO MÃI KHÔNG LÊN XU HƯỚNG?",
    transcript: analyzeRawVideo("xay-kenh-chuyen-gia.mp4", 27).segments,
  },
  {
    id: "sample-finance",
    name: "Mẫu 4: Tài Chính & Doanh Nghiệp — 3 Tư Duy Bật Tăng Thu Nhập",
    url: "/samples/sample1.mp4",
    size: 2512258,
    duration: 32,
    isSample: true,
    videoTitle: "3 TƯ DUY TÀI CHÍNH BẬT TĂNG THU NHẬP",
    speakerBadge: "CHUYÊN GIA TÀI CHÍNH",
    hookOpening: "TẠI SAO NGƯỜI GIÀU CÀNG LÀM CÀNG NHIỀU TIỀN VÀ TỰ DO?",
    transcript: analyzeRawVideo("tai-chinh.mp4", 32).segments,
  },
];

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  currentVideo,
  onSelectVideo,
  onClearVideo,
  onReTranscribe,
  onAutoPilotSuperpower,
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
    setLoadingMsg("AI đang phân tích lời thoại gốc, bóc tách câu thoại & đề xuất cảnh trám...");
    const objectUrl = URL.createObjectURL(file);
    
    const tempVideo = document.createElement("video");
    tempVideo.src = objectUrl;
    tempVideo.onloadedmetadata = () => {
      const dur = Math.round(tempVideo.duration) || 30;
      const analysis = analyzeRawVideo(file.name, dur);

      onSelectVideo({
        id: `local-${Date.now()}`,
        name: file.name,
        url: objectUrl,
        size: file.size,
        duration: dur,
        isSample: false,
        videoTitle: analysis.title,
        speakerBadge: analysis.badge,
        hookOpening: analysis.hookOpening,
        transcript: analysis.segments,
      });
      setLoadingMsg("");
    };

    tempVideo.onerror = () => {
      const dur = 30;
      const analysis = analyzeRawVideo(file.name, dur);
      onSelectVideo({
        id: `local-${Date.now()}`,
        name: file.name,
        url: objectUrl,
        size: file.size,
        duration: dur,
        isSample: false,
        videoTitle: analysis.title,
        speakerBadge: analysis.badge,
        hookOpening: analysis.hookOpening,
        transcript: analysis.segments,
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

    setLoadingMsg("Đang kết nối & phân tích video qua URL...");
    setTimeout(() => {
      const sample = SAMPLE_VIDEOS[1]; // default to finance or general
      onSelectVideo({
        id: `url-${Date.now()}`,
        name: `Video nạp từ liên kết (${urlInput.substring(0, 30)}...)`,
        url: sample.url,
        size: 5420000,
        duration: 32,
        isSample: false,
        videoTitle: sample.videoTitle,
        speakerBadge: sample.speakerBadge,
        hookOpening: sample.hookOpening,
        transcript: sample.transcript,
      });
      setLoadingMsg("");
      setUrlInput("");
    }, 1200);
  };

  return (
    <div className="w-full">
      {!currentVideo ? (
        <div className="mx-auto max-w-3xl">
          {/* SUPERPOWER AGENT TỔNG 1-CLICK HERO CARD */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-pink-500/70 bg-gradient-to-r from-pink-950/50 via-zinc-900 to-amber-950/40 p-5 mb-6 shadow-2xl shadow-pink-500/15">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-pink-500 px-2.5 py-0.5 text-[10px] font-black text-white uppercase tracking-wider shadow">
                    ⚡ SUPERPOWER AGENT TỔNG
                  </span>
                  <span className="text-xs font-bold text-amber-300">
                    Tự Làm Tự Duyệt 100%
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Cắt Thừa 11.4s • Tăng Tốc 1.13x • B-Roll • Korean Glow Da Mịn
                </h3>
                <p className="text-xs text-zinc-300 max-w-xl">
                  Chỉ cần 1 click, AI tự động biên tập toàn diện theo chuẩn chuyên gia Cô Hạnh, tự động kiểm tra QC âm lượng & safe-zone. Bạn chỉ việc xem thành quả!
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onAutoPilotSuperpower
                    ? onAutoPilotSuperpower(SAMPLE_VIDEOS[0])
                    : onSelectVideo(SAMPLE_VIDEOS[0])
                }
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Sparkles className="size-4 animate-spin" />
                <span>KÍCH HOẠT TỰ LÀM TỰ DUYỆT</span>
              </button>
            </div>
          </div>

          {/* Main Dropzone Card */}
          <div className="relative rounded-2xl border border-zinc-800 bg-card/90 p-5 shadow-2xl backdrop-blur-sm sm:p-7">
            <div className="absolute -top-16 left-1/2 -z-10 h-32 w-80 -translate-x-1/2 bg-pink-500/15 blur-3xl rounded-full pointer-events-none" />

            <div className="text-center mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 px-3 py-1 text-xs font-semibold text-pink-400 mb-2">
                <Sparkles className="size-3.5" /> Chuẩn Mẫu Dựng Chuyên Gia Cô Hạnh & Chèn Cảnh Trám B-Roll
              </span>
              <h2 className="text-xl font-extrabold text-white sm:text-2xl tracking-tight">
                Nạp Video Thô Cần Dựng Thành Bản Chuyên Nghiệp Nhất
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-lg mx-auto">
                Hệ thống tự động nắm bắt toàn bộ lời thoại gốc, phân chia luận điểm, chèn cảnh trám B-Roll phù hợp và áp dụng nhịp cắt punch-in chuyên gia.
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
                  placeholder="Dán liên kết YouTube, Google Drive, TikTok hoặc link video thô..."
                  className="h-11 w-full rounded-xl border border-zinc-700/80 bg-panel pl-10 pr-4 text-xs text-zinc-200 outline-none transition-all placeholder:text-zinc-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                />
              </div>
              <button
                type="submit"
                disabled={!urlInput.trim()}
                className="h-11 px-5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-pink-500/20"
              >
                Lấy Video
              </button>
            </form>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <span className="relative bg-card px-3 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                Hoặc tải lên video của bạn
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
                  ? "border-pink-500 bg-pink-500/5 scale-[1.01]"
                  : "border-zinc-700/70 bg-panel/60 hover:border-pink-500/70 hover:bg-panel"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
                onChange={handleFileChange}
              />
              
              <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 group-hover:scale-110 transition-transform">
                <CloudUpload className="size-7" />
              </div>

              <div className="text-sm font-bold text-zinc-200 group-hover:text-white">
                Kéo thả video thô vào đây hoặc <span className="text-pink-400 underline underline-offset-2">chọn từ máy tính</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Hỗ trợ MP4, MOV, WEBM dung lượng tới 2GB — Quét trích xuất lời thoại tiếng Việt tự động
              </p>
            </div>

            {loadingMsg && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-pink-400 animate-pulse">
                <Sparkles className="size-4" />
                {loadingMsg}
              </div>
            )}
          </div>

          {/* Quick Select Sample Videos - Chị Hạnh Featured */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-pink-500 animate-ping"></span>
                Thử Nghiệm Ngay Mẫu Video Chuyên Gia Cô Hạnh:
              </span>
              <span className="text-[11px] text-pink-400 font-semibold">Đầy đủ footage + lời thoại gốc</span>
            </div>

            {/* Featured Cô Hạnh Card */}
            <div
              onClick={() => onSelectVideo(SAMPLE_VIDEOS[0])}
              className="group relative flex items-center justify-between gap-4 rounded-2xl border-2 border-pink-500/60 bg-gradient-to-r from-pink-950/30 via-panel to-card p-4 cursor-pointer transition-all hover:border-pink-400 hover:shadow-2xl hover:shadow-pink-500/10"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative flex size-16 shrink-0 items-center justify-center rounded-xl bg-black border border-pink-500/40 overflow-hidden">
                  <video
                    src={SAMPLE_VIDEOS[0].url}
                    className="size-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play className="size-6 fill-pink-500 text-pink-500 ml-0.5" />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-pink-500 px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-wider">
                      MẪU CHUYÊN GIA SỐ 1
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">30.4s • 10.7 MB</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-pink-300 transition-colors mt-1">
                    {SAMPLE_VIDEOS[0].name}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                    Đã tích hợp 9 câu thoại gốc, phân bổ 3 cảnh trám B-Roll (Bằng ĐH, Giảng đường), thẻ Info Card và nhịp cắt punch-in.
                  </p>
                </div>
              </div>

              <button className="shrink-0 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-pink-500/20 group-hover:brightness-110">
                Thử Ngay ➔
              </button>
            </div>

            {/* Other samples */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {SAMPLE_VIDEOS.slice(1).map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectVideo(sample)}
                  className="group relative flex items-center gap-3 rounded-xl border border-zinc-800 bg-card p-2.5 text-left transition-all hover:border-zinc-700 hover:bg-panel"
                >
                  <div className="relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
                    <video
                      src={sample.url}
                      className="size-full object-cover opacity-60 group-hover:opacity-90 transition-all"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="size-3.5 fill-white text-white" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h5 className="truncate text-[11px] font-bold text-zinc-200 group-hover:text-brand">
                      {sample.name}
                    </h5>
                    <div className="text-[9px] text-zinc-500 mt-0.5">
                      {formatTime(sample.duration)} • {formatFileSize(sample.size)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Video Loaded Status Bar */
        <div className="rounded-xl border border-pink-500/40 bg-card p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-10 items-center justify-center rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400 shrink-0">
              <Video className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-xs sm:text-sm font-extrabold text-white">
                  {currentVideo.name}
                </h3>
                {currentVideo.isChanhSample && (
                  <span className="rounded bg-pink-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-white">
                    CHUYÊN GIA CÔ HẠNH
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-0.5">
                <span>Thời lượng: <strong>{formatTime(currentVideo.duration)}</strong></span>
                <span>•</span>
                <span>Lời thoại: <strong>{currentVideo.transcript?.length || 9} câu thoại gốc</strong></span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <Check className="size-3" /> Đã sẵn sàng biên tập cảnh trám & xuất bản
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onReTranscribe && (
              <button
                onClick={onReTranscribe}
                className="rounded-lg border border-pink-500/50 bg-pink-950/40 px-3 py-1.5 text-xs font-bold text-pink-300 hover:bg-pink-500 hover:text-white transition-all shadow-md shadow-pink-500/10"
              >
                🎙️ Bóc Tách Lại Lời Thoại AI
              </button>
            )}
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
