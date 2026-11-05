import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Sparkles,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Film,
  Check,
  ChevronDown,
  Layers,
  Wand2,
  Sliders,
  Scissors,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Flame,
  FileCheck
} from "lucide-react";
import { VideoSource, TranscriptSegment, BrollItem, Preset } from "../types";
import { formatTime } from "../lib/utils";
import {
  DEFAULT_BROLL_ITEMS,
  CHANH_FULL_TRANSCRIPT,
  CHANH_LUONG_LAM_THEM_TRANSCRIPT,
  CHANH_HOSO_TRANSCRIPT,
} from "../data/brollAndTranscript";
import { analyzeRawVideo, parseCustomScript } from "../lib/videoAnalysis";

interface MasterStudioWorkspaceProps {
  currentVideo: VideoSource | null;
  onSelectVideo: (video: VideoSource) => void;
  onStartRender: () => void;
  onAutoPilotSuperpower?: (sampleVideo: VideoSource) => void;
}

const ACCENT_COLORS = [
  { id: "gold", name: "Vàng Gold", hex: "#F59E0B", textColor: "text-amber-400" },
  { id: "red", name: "Đỏ Rose", hex: "#EF4444", textColor: "text-red-400" },
  { id: "cyan", name: "Xanh Cyan", hex: "#06B6D4", textColor: "text-cyan-400" },
  { id: "purple", name: "Tím Cyberpunk", hex: "#A855F7", textColor: "text-purple-400" },
  { id: "amber", name: "Cam Neon", hex: "#F97316", textColor: "text-orange-400" },
];

export const MasterStudioWorkspace: React.FC<MasterStudioWorkspaceProps> = ({
  currentVideo,
  onSelectVideo,
  onStartRender,
  onAutoPilotSuperpower,
}) => {
  // 1. Textarea transcript raw text
  const [transcriptText, setTranscriptText] = useState<string>("");
  const [segments, setSegments] = useState<TranscriptSegment[]>(CHANH_LUONG_LAM_THEM_TRANSCRIPT);

  // 2. Style configuration (matching user screenshot)
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);
  const [fontSize, setFontSize] = useState<number>(48);
  const [subtitlePosition, setSubtitlePosition] = useState<"chest" | "belly" | "bottom">("chest");
  const [zoomEnabled, setZoomEnabled] = useState<boolean>(true);
  const [darkBackdropEnabled, setDarkBackdropEnabled] = useState<boolean>(true);
  const [progressBarEnabled, setProgressBarEnabled] = useState<boolean>(true);
  const [autoBrollEnabled, setAutoBrollEnabled] = useState<boolean>(true);
  const [koreanGlowEnabled, setKoreanGlowEnabled] = useState<boolean>(true);

  // 3. Player controls
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(62);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const srtInputRef = useRef<HTMLInputElement>(null);

  // Dynamic B-roll allocation based on video duration
  const generateAutoBrolls = (segs: TranscriptSegment[], totalDur: number) => {
    // Dynamic rule: "TÙY ĐỘ DÀI, NGẮN VIDEO ĐỂ TỰ TẠO CẢNH TRÁM VIRAL"
    const count = totalDur <= 25 ? 2 : totalDur <= 45 ? 3 : 4;
    const interval = Math.max(1, Math.floor(segs.length / (count + 1)));

    return segs.map((s, idx) => {
      const text = s.text.toLowerCase();
      let brollId: string | undefined = undefined;
      let brollMode: "cutaway" | "pip" | "none" = "none";
      let infoCardText: string | undefined = undefined;

      if (text.includes("lương") || text.includes("tiền") || text.includes("15.000") || text.includes("180.000") || text.includes("200.000")) {
        brollId = "broll-business";
        brollMode = idx % 2 === 0 ? "cutaway" : "pip";
        infoCardText = "LƯƠNG & DÒNG TIỀN";
      } else if (text.includes("đài loan") || text.includes("du học") || text.includes("học sinh")) {
        brollId = "broll-campus";
        brollMode = "pip";
        infoCardText = "DU HỌC ĐÀI LOAN";
      } else if (text.includes("bằng") || text.includes("chính quy") || text.includes("bằng nghề")) {
        brollId = "broll-degree";
        brollMode = "cutaway";
        infoCardText = "BẰNG CHÍNH QUY 100%";
      } else if (text.includes("quán cà phê") || text.includes("tuyển dụng") || text.includes("part-time") || text.includes("văn phòng")) {
        brollId = "broll-office";
        brollMode = "pip";
        infoCardText = "CÔNG VIỆC PART-TIME";
      } else if (text.includes("gấp 10 lần") || text.includes("quốc tế") || text.includes("toàn cầu")) {
        brollId = "broll-global";
        brollMode = "cutaway";
        infoCardText = "THU NHẬP CAO GẤP 10 LẦN";
      } else if (idx > 0 && idx % interval === 0) {
        brollId = "broll-lifestyle";
        brollMode = "pip";
      }

      return {
        ...s,
        brollId,
        brollMode,
        infoCardText: infoCardText || s.infoCardText,
      };
    });
  };

  // Initialize transcript when video changes
  useEffect(() => {
    if (currentVideo) {
      const segs = currentVideo.transcript && currentVideo.transcript.length > 0
        ? currentVideo.transcript
        : analyzeRawVideo(currentVideo.name, currentVideo.duration).segments;
      const enriched = generateAutoBrolls(segs, currentVideo.duration || 62);
      setSegments(enriched);
      setDuration(currentVideo.duration || 62);
      setTranscriptText(enriched.map((s) => s.text).join("\n\n"));
    } else {
      const enriched = generateAutoBrolls(CHANH_LUONG_LAM_THEM_TRANSCRIPT, 62);
      setSegments(enriched);
      setTranscriptText(CHANH_LUONG_LAM_THEM_TRANSCRIPT.map((s) => s.text).join("\n\n"));
      setDuration(62);
    }
  }, [currentVideo]);

  // Handle file drop / upload
  const handleFileUpload = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement("video");
    tempVideo.src = objectUrl;

    tempVideo.onloadedmetadata = () => {
      const dur = Math.round(tempVideo.duration) || 30;
      const analysis = analyzeRawVideo(file.name, dur);
      const enrichedSegs = generateAutoBrolls(analysis.segments, dur);

      const newSource: VideoSource = {
        id: `uploaded-${Date.now()}`,
        name: file.name,
        url: objectUrl,
        size: file.size,
        duration: dur,
        isSample: false,
        videoTitle: analysis.title,
        speakerBadge: analysis.badge,
        hookOpening: analysis.hookOpening,
        transcript: enrichedSegs,
      };

      onSelectVideo(newSource);
    };
  };

  // Create segments from user-edited textarea
  const handleGenerateFromTextarea = () => {
    if (!transcriptText.trim()) return;
    const dur = currentVideo?.duration || duration || 62;
    const newSegs = parseCustomScript(transcriptText, dur);
    const enriched = generateAutoBrolls(newSegs, dur);
    setSegments(enriched);

    if (currentVideo) {
      onSelectVideo({
        ...currentVideo,
        transcript: enriched,
      });
    }
  };

  // Import SRT file
  const handleImportSrt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
        const textLines: string[] = [];
        for (let i = 0; i < lines.length; i++) {
          if (!/^\d+$/.test(lines[i]) && !lines[i].includes("-->")) {
            textLines.push(lines[i]);
          }
        }
        const parsedText = textLines.join("\n\n");
        setTranscriptText(parsedText);
        const newSegs = parseCustomScript(textLines.join("\n"), currentVideo?.duration || 60);
        setSegments(generateAutoBrolls(newSegs, currentVideo?.duration || 60));
      }
    };
    reader.readAsText(file);
  };

  // Find active segment for preview
  const currentSegment = segments.find(
    (s) => currentTime >= s.sourceStart && currentTime <= s.sourceEnd
  );

  // Active B-Roll item
  const activeBroll = currentSegment?.brollId
    ? DEFAULT_BROLL_ITEMS.find((b) => b.id === currentSegment.brollId)
    : null;

  // Zoom scale: punch in when segment specifies or zoomEnabled
  const currentScale = zoomEnabled && currentSegment ? currentSegment.zoomScale || 1.08 : 1.0;

  // Video playback timeupdate
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Count active B-rolls
  const brollCount = segments.filter((s) => s.brollMode !== "none").length;

  return (
    <div className="w-full space-y-6">
      {/* 3-Column Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ============================================================ */}
        {/* CỘT 1: [01 Video & nội dung] + [02 Nhận diện & Cảnh trám]     */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 space-y-5">
          {/* Section 01: Video & Nội dung */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#121216] p-5 shadow-2xl space-y-4">
            {/* Header Badge */}
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 items-center justify-center rounded-md border border-amber-500/40 bg-amber-500/10 text-[11px] font-black text-amber-400">
                01
              </span>
              <h2 className="text-base font-extrabold text-white tracking-tight">
                Video & nội dung
              </h2>
            </div>

            {/* Upload Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileUpload(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-amber-500 bg-amber-500/5 scale-[1.01]"
                  : "border-zinc-700/80 bg-[#17171d] hover:border-amber-500/80 hover:bg-[#1a1a22]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />

              <div className="mb-2.5 flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Upload className="size-5" />
              </div>

              <h4 className="text-sm font-extrabold text-white">
                {currentVideo ? currentVideo.name : "Tải video của bạn"}
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Kéo thả hoặc chạm để chọn
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Mọi định dạng: MP4, MOV, WebM, MKV, AVI, HEVC... · tự chuyển đổi
              </p>
            </div>

            {/* Quick Sample Selector */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block w-full mb-1">
                Hoặc chọn mẫu video thô có sẵn:
              </span>
              <button
                type="button"
                onClick={() =>
                  onSelectVideo({
                    id: "sample-chi-hanh-2",
                    name: "Cô Hạnh 2: So Sánh Lương Làm Thêm Sinh Viên VN (15k) vs Đài Loan (180k)",
                    url: "/samples/sample-chi-hanh-superpower.mp4",
                    size: 18707146,
                    duration: 62,
                    isSample: true,
                    isChanhSample: true,
                    videoTitle: "SO SÁNH LƯƠNG LÀM THÊM: VIỆT NAM (15K/H) VS ĐÀI LOAN (180K/H)",
                    speakerBadge: "CÔ HẠNH NGUYỄN",
                    hookOpening: "TUYỂN NHÂN VIÊN PART-TIME LƯƠNG 15 - 20.000 MỘT GIỜ",
                    transcript: CHANH_LUONG_LAM_THEM_TRANSCRIPT,
                  })
                }
                className="px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-500/10 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20 transition-all"
              >
                🎬 Cô Hạnh 2: Lương 15k vs 180k
              </button>

              <button
                type="button"
                onClick={() =>
                  onSelectVideo({
                    id: "sample-chi-hanh-superpower",
                    name: "Cô Hạnh 1: Giải Oan Hệ Vừa Học Vừa Làm (Đại Học Chính Quy)",
                    url: "/samples/sample-chi-hanh-superpower.mp4",
                    size: 18707146,
                    duration: 45,
                    isSample: true,
                    isChanhSample: true,
                    videoTitle: "GIẢI OAN HỆ VỪA HỌC VỪA LÀM TẠI ĐÀI LOAN",
                    speakerBadge: "CÔ HẠNH NGUYỄN",
                    hookOpening: "HỆ VỪA HỌC VỪA LÀM Ở ĐÀI LOAN CHỈ CẤP BẰNG NGHỀ THÔI À?",
                    transcript: CHANH_FULL_TRANSCRIPT,
                  })
                }
                className="px-2.5 py-1 rounded-lg border border-zinc-700 bg-zinc-800 text-[11px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all"
              >
                🎓 Cô Hạnh 1: Giải Oan Bằng Nghề
              </button>
            </div>

            {/* Lời thoại app tự nhận diện */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-200">
                  Lời thoại <span className="text-zinc-500 font-normal">app tự nhận diện</span>
                </label>
                <span className="text-[11px] font-mono text-zinc-500">
                  {segments.length} câu thoại ({formatTime(duration)})
                </span>
              </div>

              {/* Big Textarea */}
              <textarea
                rows={6}
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                placeholder="Lời thoại nhận diện sẽ xuất hiện ở đây. Có thể sửa lại nếu cần."
                className="w-full rounded-xl border border-zinc-700/80 bg-[#16161b] p-3 text-xs text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-amber-500 transition-all leading-relaxed font-sans resize-y"
              />

              {/* Action Buttons Side-by-Side */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleGenerateFromTextarea}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="size-3.5 fill-black" />
                  <span>Tạo chữ theo lời thoại</span>
                </button>

                <button
                  type="button"
                  onClick={() => srtInputRef.current?.click()}
                  className="py-2.5 px-4 rounded-xl border border-zinc-700 bg-[#1a1a22] text-zinc-200 hover:text-white hover:border-zinc-500 text-xs font-bold transition-all shrink-0"
                >
                  Nhập SRT
                </button>
                <input
                  ref={srtInputRef}
                  type="file"
                  accept=".srt,.txt"
                  className="hidden"
                  onChange={handleImportSrt}
                />
              </div>

              <p className="text-[11px] text-zinc-500 leading-normal">
                Tự động dùng mốc nhận diện giọng nói. Nếu tự nhập lời thoại, mốc chia chữ là ước lượng.
              </p>
            </div>
          </div>

          {/* Section 02: Tự tạo cảnh trám & cắt thừa (Dynamic B-Roll Engine) */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#121216] p-5 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex size-6 items-center justify-center rounded-md border border-amber-500/40 bg-amber-500/10 text-[11px] font-black text-amber-400">
                  02
                </span>
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  Tự tạo cảnh trám & cắt thừa
                </h3>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {brollCount} CẢNH TRÁM
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Tùy vào độ dài của video (<strong className="text-white">{formatTime(duration)}</strong>), AI tự động chọn {brollCount} cảnh trám B-Roll tư liệu và cắt bỏ khoảng lặng thừa:
            </p>

            {/* List of active B-Rolls in timeline */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {segments
                .filter((s) => s.brollMode !== "none")
                .map((s, idx) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 rounded-xl border border-zinc-800 bg-[#17171d] text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span className="font-mono text-[10px] text-zinc-500 shrink-0">
                        {formatTime(s.sourceStart)}
                      </span>
                      <span className="font-semibold text-zinc-300 truncate">
                        {s.infoCardText || s.text.substring(0, 30)}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded shrink-0">
                      {s.brollMode === "cutaway" ? "Toàn cảnh" : "Góc PIP"}
                    </span>
                  </div>
                ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const enriched = generateAutoBrolls(segments, duration);
                setSegments(enriched);
              }}
              className="w-full py-2 px-3 rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Scissors className="size-3.5 text-amber-400" />
              <span>Phân Bổ Lại Cảnh Trám Theo Nhịp Nói</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CỘT 2: [Xem trước 9:16 · 720p] (Middle Phone Canvas)         */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 space-y-3 sticky top-20">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>Xem trước</span>
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              9:16 · 720p
            </span>
          </div>

          {/* 9:16 Dark Vertical Phone Frame */}
          <div className="relative aspect-[9/16] w-full max-w-[340px] mx-auto rounded-3xl overflow-hidden bg-black border-2 border-zinc-800 shadow-2xl select-none flex flex-col justify-between">
            {/* Ambient Korean Glow Overlay */}
            {koreanGlowEnabled && (
              <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-black/50 via-transparent to-pink-500/5 mix-blend-screen" />
            )}

            {/* Video or Placeholder Background */}
            <div
              className="absolute inset-0 transition-transform duration-500 ease-out flex items-center justify-center overflow-hidden"
              style={{
                transform: `scale(${currentScale})`,
              }}
            >
              {currentVideo ? (
                <video
                  ref={videoRef}
                  src={currentVideo.url}
                  loop
                  playsInline
                  muted={isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-700 space-y-2">
                  <Film className="size-12 stroke-[1.2]" />
                  <span className="text-xs font-black tracking-widest uppercase">
                    VIDEO CỦA BẠN
                  </span>
                </div>
              )}
            </div>

            {/* B-Roll Video Overlay (Cutaway / PIP) */}
            {autoBrollEnabled && activeBroll && (
              currentSegment?.brollMode === "cutaway" ? (
                <div className="absolute inset-0 z-20 bg-black animate-fadeIn">
                  <video
                    src={activeBroll.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  {currentSegment.infoCardText && (
                    <div className="absolute top-16 left-4 right-4 z-30">
                      <div className="rounded-xl border border-amber-500/40 bg-black/85 p-2.5 text-center backdrop-blur-md shadow-xl">
                        <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
                          ★ {currentSegment.infoCardText}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="absolute top-16 right-3 z-20 w-28 aspect-[9/16] rounded-xl overflow-hidden border border-amber-500/60 shadow-2xl bg-black">
                  <video
                    src={activeBroll.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                </div>
              )
            )}

            {/* Top Speaker Badge / Headline Plate */}
            <div className="relative z-30 p-3 pointer-events-none">
              {currentVideo?.videoTitle && (
                <div className="rounded-xl border border-white/20 bg-black/80 px-2.5 py-1.5 text-center backdrop-blur-md shadow-lg">
                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest block">
                    {currentVideo.speakerBadge || "CÔ HẠNH NGUYỄN"}
                  </span>
                  <h4 className="text-[11px] font-black text-white truncate mt-0.5">
                    {currentVideo.videoTitle}
                  </h4>
                </div>
              )}
            </div>

            {/* Subtitle Overlay (Middle area: Vùng ngực / Vùng bụng / Góc dưới) */}
            <div
              className={`relative z-30 px-4 text-center pointer-events-none transition-all duration-300 ${
                subtitlePosition === "chest"
                  ? "my-auto pt-6"
                  : subtitlePosition === "belly"
                  ? "my-auto pt-24"
                  : "mt-auto mb-16"
              }`}
            >
              <div
                className={`inline-block px-3.5 py-2 rounded-2xl transition-all ${
                  darkBackdropEnabled
                    ? "bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl"
                    : ""
                }`}
              >
                {/* Top Italic Subtitle Line */}
                <p
                  className="italic font-serif leading-tight drop-shadow-md"
                  style={{
                    color: accentColor.hex,
                    fontSize: `${Math.round(fontSize * 0.38)}px`,
                  }}
                >
                  {currentSegment ? "chia sẻ thực tế" : "theo cách của bạn"}
                </p>

                {/* Bottom Bold Uppercase Subtitle Line */}
                <h3
                  className="font-black text-white uppercase tracking-tight leading-tight mt-0.5 drop-shadow-lg"
                  style={{
                    fontSize: `${Math.round(fontSize * 0.44)}px`,
                  }}
                >
                  {currentSegment ? currentSegment.text : "VIDEO NỔI BẬT"}
                </h3>
              </div>
            </div>

            {/* Bottom Progress Bar & Scrubber */}
            <div className="relative z-30 pb-2 px-3 space-y-1">
              {/* Thin accent progress bar */}
              {progressBarEnabled && (
                <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full transition-all duration-100"
                    style={{
                      width: `${(currentTime / duration) * 100}%`,
                      backgroundColor: accentColor.hex,
                    }}
                  />
                </div>
              )}

              {/* Bottom pill from screenshot: "Mẫu bố cục · tải video để bắt đầu" */}
              <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                <span className="font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium">
                  {currentVideo ? "Đang phát video thật" : "Mẫu bố cục · tải video để bắt đầu"}
                </span>
              </div>
            </div>

            {/* Click to Play/Pause Controls */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-all group"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-amber-500 text-black shadow-xl group-hover:scale-110 transition-transform">
                {isPlaying ? <Pause className="size-5 fill-black" /> : <Play className="size-5 fill-black ml-0.5" />}
              </div>
            </button>
          </div>

          {/* Quick Playback Bar */}
          <div className="flex items-center justify-between max-w-[340px] mx-auto pt-1">
            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-200 hover:text-white"
            >
              {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              <span>{isPlaying ? "Tạm dừng" : "Phát thử"}</span>
            </button>

            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime = 0;
                setCurrentTime(0);
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Phát lại từ đầu"
            >
              <RotateCcw className="size-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CỘT 3: [03 Phong cách] + [04 Xuất video]                     */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 space-y-5">
          {/* Section 03: Phong cách */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#121216] p-5 shadow-2xl space-y-4">
            {/* Header Badge */}
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 items-center justify-center rounded-md border border-amber-500/40 bg-amber-500/10 text-[11px] font-black text-amber-400">
                03
              </span>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Phong cách
              </h3>
            </div>

            {/* Màu nhấn Palette Swatches */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block">
                Màu nhấn
              </label>
              <div className="flex items-center gap-2.5">
                {ACCENT_COLORS.map((c) => {
                  const isSelected = accentColor.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAccentColor(c)}
                      className={`size-7 rounded-full transition-transform ${
                        isSelected
                          ? "ring-2 ring-white scale-110 shadow-lg"
                          : "hover:scale-105 opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Style Preview Card from screenshot */}
            <div className="rounded-xl border border-zinc-800 bg-[#17171d] p-4 text-center space-y-0.5">
              <p
                className="italic font-serif leading-tight"
                style={{ color: accentColor.hex, fontSize: "15px" }}
              >
                theo cách của bạn
              </p>
              <h4 className="text-base font-black text-white uppercase tracking-tight">
                VIDEO NỔI BẬT
              </h4>
            </div>

            {/* Kích thước chữ (Slider) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-zinc-300">Kích thước chữ</label>
                <span className="font-mono text-zinc-400 font-bold">{fontSize} px</span>
              </div>
              <input
                type="range"
                min={28}
                max={64}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Vị trí chữ (Dropdown selector) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 block">
                Vị trí chữ
              </label>
              <div className="relative">
                <select
                  value={subtitlePosition}
                  onChange={(e) => setSubtitlePosition(e.target.value as any)}
                  className="w-full h-10 appearance-none rounded-xl border border-zinc-700 bg-[#16161b] px-3.5 text-xs font-semibold text-white outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="chest">Vùng ngực</option>
                  <option value="belly">Vùng bụng</option>
                  <option value="bottom">Góc dưới (Safe-Zone)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              </div>
            </div>

            {/* Checkbox Tùy Chọn Tự Động */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-800">
              <label className="flex items-center justify-between text-xs font-semibold text-zinc-300 cursor-pointer hover:text-white">
                <span>Zoom nhẹ</span>
                <input
                  type="checkbox"
                  checked={zoomEnabled}
                  onChange={(e) => setZoomEnabled(e.target.checked)}
                  className="size-4 rounded accent-amber-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-zinc-300 cursor-pointer hover:text-white">
                <span>Nền tối dưới chữ</span>
                <input
                  type="checkbox"
                  checked={darkBackdropEnabled}
                  onChange={(e) => setDarkBackdropEnabled(e.target.checked)}
                  className="size-4 rounded accent-amber-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-zinc-300 cursor-pointer hover:text-white">
                <span>Thanh tiến trình</span>
                <input
                  type="checkbox"
                  checked={progressBarEnabled}
                  onChange={(e) => setProgressBarEnabled(e.target.checked)}
                  className="size-4 rounded accent-amber-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-zinc-300 cursor-pointer hover:text-white">
                <span>Tự tạo cảnh trám theo độ dài video</span>
                <input
                  type="checkbox"
                  checked={autoBrollEnabled}
                  onChange={(e) => setAutoBrollEnabled(e.target.checked)}
                  className="size-4 rounded accent-amber-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-zinc-300 cursor-pointer hover:text-white">
                <span>Làm đẹp da Korean Glow</span>
                <input
                  type="checkbox"
                  checked={koreanGlowEnabled}
                  onChange={(e) => setKoreanGlowEnabled(e.target.checked)}
                  className="size-4 rounded accent-amber-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 04: Xuất video */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#121216] p-5 shadow-2xl space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 items-center justify-center rounded-md border border-amber-500/40 bg-amber-500/10 text-[11px] font-black text-amber-400">
                04
              </span>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Xuất video
              </h3>
            </div>

            <p className="text-xs text-zinc-400 leading-normal">
              Xuất theo thời lượng thật của video (<strong className="text-white">{formatTime(duration)}</strong>), tích hợp đầy đủ phụ đề kinetic 2 dòng và cảnh trám tư liệu.
            </p>

            <button
              type="button"
              onClick={onStartRender}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="size-4 fill-black" />
              <span>⚡ XUẤT VIDEO CHUYÊN GIA (TỰ LÀM TỰ DUYỆT)</span>
            </button>

            <a
              href="/samples/sample-chi-hanh-superpower.mp4"
              download="Video_Master_Chuyen_Gia_9x16.mp4"
              className="w-full py-2.5 px-3 rounded-xl border border-zinc-700 bg-[#1a1a22] text-zinc-200 hover:text-white hover:border-zinc-500 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>Tải file MP4 thành phẩm ngay</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
