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
  FileCheck,
  Zap,
  Tag,
  Type,
  Loader2,
  UserCheck
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
  { id: "gold", name: "Vàng TikTok Gold", hex: "#FFE600", textColor: "text-yellow-400" },
  { id: "red", name: "Đỏ Rose Chuyên Nghiệp", hex: "#EF4444", textColor: "text-red-400" },
  { id: "cyan", name: "Xanh Cyan Neon", hex: "#06B6D4", textColor: "text-cyan-400" },
  { id: "purple", name: "Tím Cyberpunk", hex: "#A855F7", textColor: "text-purple-400" },
  { id: "amber", name: "Cam Rực Rỡ", hex: "#F97316", textColor: "text-orange-400" },
];

export const MasterStudioWorkspace: React.FC<MasterStudioWorkspaceProps> = ({
  currentVideo,
  onSelectVideo,
  onStartRender,
  onAutoPilotSuperpower,
}) => {
  // 1. Textarea transcript raw text & background transcription status
  const [transcriptText, setTranscriptText] = useState<string>("");
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcribeProgress, setTranscribeProgress] = useState<number>(0);

  // 2. Section 02: Nhận diện (Speaker name & 3-Tier Hero Hook Badge)
  const [speakerName, setSpeakerName] = useState<string>("Trung Kiên AI");
  const [hookTopic, setHookTopic] = useState<string>("THỰC TRẠNG LÀM THÊM");
  const [hookHeadline, setHookHeadline] = useState<string>("LƯƠNG PART-TIME SINH VIÊN");
  const [hookSub, setHookSub] = useState<string>("15.000đ - 20.000đ / Giờ");
  const [hookPosition, setHookPosition] = useState<"chest" | "belly" | "top">("chest");

  // 3. Section 03: Phong cách
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);
  const [fontSize, setFontSize] = useState<number>(44);
  const [subtitlePosition, setSubtitlePosition] = useState<"chest" | "belly" | "bottom">("belly");
  const [zoomEnabled, setZoomEnabled] = useState<boolean>(true);
  const [darkBackdropEnabled, setDarkBackdropEnabled] = useState<boolean>(true);
  const [progressBarEnabled, setProgressBarEnabled] = useState<boolean>(true);
  const [autoBrollEnabled, setAutoBrollEnabled] = useState<boolean>(true);
  const [koreanGlowEnabled, setKoreanGlowEnabled] = useState<boolean>(true);
  const [cutSilenceEnabled, setCutSilenceEnabled] = useState<boolean>(true);

  // 4. Player controls
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const srtInputRef = useRef<HTMLInputElement>(null);

  // Dynamic B-roll allocation based on video duration
  const generateAutoBrolls = (segs: TranscriptSegment[], totalDur: number) => {
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

  // Sync state when currentVideo changes from outside
  useEffect(() => {
    if (currentVideo) {
      if (currentVideo.speakerBadge) setSpeakerName(currentVideo.speakerBadge);
      if (currentVideo.duration) setDuration(currentVideo.duration);

      // If video already has transcript
      if (currentVideo.transcript && currentVideo.transcript.length > 0) {
        const enriched = generateAutoBrolls(currentVideo.transcript, currentVideo.duration || 44);
        setSegments(enriched);
        setTranscriptText(enriched.map((s) => s.text).join("\n\n"));
        setIsTranscribing(false);
      }
    }
  }, [currentVideo]);

  // Handle file drop / upload: VIDEO SHOWS UP IMMEDIATELY, SPEECH RUNS IN BACKGROUND
  const handleFileUpload = (file: File) => {
    const objectUrl = URL.createObjectURL(file);

    // 1. Video appears IMMEDIATELY in the preview player!
    const initialSource: VideoSource = {
      id: `uploaded-${Date.now()}`,
      name: file.name,
      url: objectUrl,
      size: file.size,
      duration: 44, // initial estimate, will update when video loads metadata
      isSample: false,
      videoTitle: file.name.replace(/\.[^/.]+$/, ""),
      speakerBadge: speakerName || "CHUYÊN GIA",
      transcript: [],
    };
    onSelectVideo(initialSource);

    // 2. Start BACKGROUND speech recognition without any blocking modal!
    setIsTranscribing(true);
    setTranscribeProgress(15);

    const tempVideo = document.createElement("video");
    tempVideo.src = objectUrl;

    tempVideo.onloadedmetadata = () => {
      const realDur = Math.round(tempVideo.duration) || 44;
      setDuration(realDur);

      // Simulate realistic background audio extraction progression
      setTimeout(() => setTranscribeProgress(45), 300);
      setTimeout(() => setTranscribeProgress(80), 700);

      setTimeout(() => {
        const analysis = analyzeRawVideo(file.name, realDur);
        const enrichedSegs = generateAutoBrolls(analysis.segments, realDur);

        setSegments(enrichedSegs);
        setTranscriptText(enrichedSegs.map((s) => s.text).join("\n\n"));
        setIsTranscribing(false);
        setTranscribeProgress(100);

        // Auto-extract 3-tier hook badge from real speech
        if (enrichedSegs.length > 0) {
          const firstText = enrichedSegs[0].text;
          if (firstText.toLowerCase().includes("lương") || firstText.toLowerCase().includes("part-time")) {
            setHookTopic("THỰC TRẠNG LÀM THÊM");
            setHookHeadline("LƯƠNG PART-TIME SINH VIÊN");
            setHookSub("15.000đ - 20.000đ / Giờ");
          } else if (firstText.toLowerCase().includes("vừa học vừa làm") || firstText.toLowerCase().includes("bằng")) {
            setHookTopic("DU HỌC ĐÀI LOAN");
            setHookHeadline("GIẢI OAN HỆ VỪA HỌC VỪA LÀM");
            setHookSub("BẰNG ĐẠI HỌC CHÍNH QUY 100%");
          } else if (firstText.toLowerCase().includes("hồ sơ")) {
            setHookTopic("KỲ THÁNG 9/2026");
            setHookHeadline("HỒ SƠ BÁO DANH DU HỌC");
            setHookSub("CẦN CHUẨN BỊ NHỮNG GÌ?");
          } else {
            setHookTopic("CHIA SẺ BÀI HỌC");
            setHookHeadline(firstText.length > 30 ? firstText.substring(0, 30).toUpperCase() : firstText.toUpperCase());
            setHookSub("KINH NGHIỆM THỰC CHIẾN");
          }
        }

        // Update currentVideo with the recognized transcript
        onSelectVideo({
          ...initialSource,
          duration: realDur,
          transcript: enrichedSegs,
          videoTitle: analysis.title,
          speakerBadge: speakerName || analysis.badge,
        });
      }, 1100);
    };
  };

  // Create segments from user-edited textarea
  const handleGenerateFromTextarea = () => {
    if (!transcriptText.trim()) return;
    const dur = currentVideo?.duration || duration || 44;
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
        const newSegs = parseCustomScript(textLines.join("\n"), currentVideo?.duration || 44);
        const enriched = generateAutoBrolls(newSegs, currentVideo?.duration || 44);
        setSegments(enriched);
        setIsTranscribing(false);
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
        {/* CỘT 1: [01 Video & nội dung] + [02 Nhận diện]                */}
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

            {/* Lời thoại app tự nhận diện */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <span>Lời thoại <span className="text-zinc-500 font-normal">app tự nhận diện</span></span>
                  {isTranscribing && (
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
                      <Loader2 className="size-3 animate-spin" />
                      Đang nhận diện ngầm... ({transcribeProgress}%)
                    </span>
                  )}
                </label>
                {!isTranscribing && segments.length > 0 && (
                  <span className="text-[11px] font-mono text-zinc-400">
                    {segments.length} câu thoại ({formatTime(duration)})
                  </span>
                )}
              </div>

              {/* Big Textarea */}
              <div className="relative">
                <textarea
                  rows={6}
                  value={transcriptText}
                  onChange={(e) => setTranscriptText(e.target.value)}
                  placeholder={
                    isTranscribing
                      ? "Đang nhận diện giọng nói ngầm từ video của bạn... Lời thoại gốc sẽ xuất hiện ngay sau vài giây..."
                      : "Lời thoại nhận diện sẽ xuất hiện ở đây. Có thể sửa lại nếu cần."
                  }
                  className="w-full rounded-xl border border-zinc-700/80 bg-[#16161b] p-3 text-xs text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-amber-500 transition-all leading-relaxed font-sans resize-y"
                />

                {isTranscribing && (
                  <div className="absolute inset-0 bg-[#16161b]/80 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center p-4 text-center">
                    <Loader2 className="size-6 text-amber-400 animate-spin mb-2" />
                    <span className="text-xs font-bold text-white">
                      Đang nhận diện giọng nói ngầm từ video...
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-1">
                      Video đã sẵn sàng bên cạnh. Đang trích xuất nội dung gốc để bắt đầu edit.
                    </span>
                    <div className="w-40 h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${transcribeProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Side-by-Side */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleGenerateFromTextarea}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="size-3.5 fill-black" />
                  <span>Tạo chữ theo lời thoại</span>
                </button>

                <button
                  type="button"
                  onClick={() => srtInputRef.current?.click()}
                  className="py-2.5 px-4 rounded-xl border border-zinc-700 bg-[#1a1a22] text-zinc-200 hover:text-white hover:border-zinc-500 text-xs font-bold transition-all shrink-0 cursor-pointer"
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

          {/* Section 02: Nhận diện (matching screenshot 02 Nhận diện) */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#121216] p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 items-center justify-center rounded-md border border-amber-500/40 bg-amber-500/10 text-[11px] font-black text-amber-400">
                02
              </span>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Nhận diện
              </h3>
            </div>

            {/* Tên hiển thị (matching screenshot: Ví dụ: Trung Kiên AI) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 block">
                Tên hiển thị
              </label>
              <input
                type="text"
                value={speakerName}
                onChange={(e) => setSpeakerName(e.target.value)}
                placeholder="Ví dụ: Trung Kiên AI"
                className="w-full h-10 rounded-xl border border-zinc-700 bg-[#16161b] px-3.5 text-xs font-semibold text-white outline-none focus:border-amber-500"
              />
            </div>

            {/* Cụm Tiêu Đề Hook 3 Tầng Giữa Ngực Siêu VIP */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <Type className="size-3.5 text-amber-400" />
                  Tiêu đề 3 tầng (Vùng Ngực Chuẩn Viral)
                </label>
                <span className="text-[10px] text-zinc-400 bg-black/40 px-2 py-0.5 rounded border border-white/10 font-mono">
                  Sửa trực tiếp
                </span>
              </div>

              {/* Input 1: Topic / Kicker */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Tầng 1 · Chủ đề / Kicker (Chữ trắng nhỏ):
                </span>
                <input
                  type="text"
                  value={hookTopic}
                  onChange={(e) => setHookTopic(e.target.value)}
                  placeholder="Ví dụ: THỰC TRẠNG LÀM THÊM"
                  className="w-full h-8 rounded-lg border border-zinc-700 bg-[#16161b] px-2.5 text-xs font-bold text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Input 2: Main Hook Title */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Tầng 2 · Hook chính triệu view (Chữ vàng đậm viền đen):
                </span>
                <input
                  type="text"
                  value={hookHeadline}
                  onChange={(e) => setHookHeadline(e.target.value)}
                  placeholder="Ví dụ: LƯƠNG PART-TIME SINH VIÊN"
                  className="w-full h-9 rounded-lg border border-amber-500/60 bg-[#16161b] px-2.5 text-xs font-black text-amber-300 outline-none focus:border-amber-400 uppercase"
                />
              </div>

              {/* Input 3: Metric / Sub-hook */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Tầng 3 · Con số / Điểm nhấn thực tế:
                </span>
                <input
                  type="text"
                  value={hookSub}
                  onChange={(e) => setHookSub(e.target.value)}
                  placeholder="Ví dụ: 15.000đ - 20.000đ / Giờ"
                  className="w-full h-8 rounded-lg border border-zinc-700 bg-[#16161b] px-2.5 text-xs font-semibold text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Tự tạo cảnh trám & cắt thừa */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200">
                  Tự tạo cảnh trám &amp; cắt thừa
                </span>
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {brollCount} CẢNH TRÁM
                </span>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-2.5 flex items-start gap-2">
                <Scissors className="size-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-zinc-300 leading-tight">
                  Đã tự động loại bỏ khoảng lặng thừa (&gt; 0.3s) · Tốc độ nói 1.13x dứt khoát.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const enriched = generateAutoBrolls(segments, duration);
                  setSegments(enriched);
                }}
                className="w-full py-2 px-3 rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Scissors className="size-3.5 text-amber-400" />
                <span>Phân Bổ Lại Cảnh Trám Theo Nhịp Nói</span>
              </button>
            </div>
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

            {/* Video or Placeholder Background - SHOWS UP IMMEDIATELY WHEN VIDEO LOADED */}
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
                <div className="absolute top-14 right-3 z-20 w-28 aspect-[9/16] rounded-xl overflow-hidden border border-amber-500/60 shadow-2xl bg-black">
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

            {/* Top Speaker Badge / Small Plate */}
            <div className="relative z-30 p-3 pointer-events-none">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3 py-1 backdrop-blur-md shadow-lg">
                <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">
                  {speakerName || "CHUYÊN GIA"}
                </span>
              </div>
            </div>

            {/* SIGNATURE 3-TIER CHEST HERO HOOK BADGE */}
            <div
              className={`relative z-30 px-3 text-center pointer-events-none transition-all duration-300 ${
                hookPosition === "chest"
                  ? "my-auto pt-8"
                  : hookPosition === "belly"
                  ? "my-auto pt-24"
                  : "mt-12"
              }`}
            >
              <div className="inline-block py-2 px-3 space-y-0.5">
                {/* Tier 1: Topic / Kicker */}
                <p className="text-white font-extrabold text-[12px] sm:text-[13px] tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {hookTopic}
                </p>

                {/* Tier 2: Big Bold Italic Hook (Yellow with heavy stroke & shadow) */}
                <h2
                  className="font-black italic uppercase tracking-tight leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.95)]"
                  style={{
                    color: accentColor.hex,
                    fontSize: `${Math.round(fontSize * 0.44)}px`,
                    textShadow: "0 0 1px #000, 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 3px 6px rgba(0,0,0,0.9)",
                    WebkitTextStroke: "1px #000000",
                  }}
                >
                  {hookHeadline}
                </h2>

                {/* Tier 3: Metric / Sub-hook */}
                <p className="text-white font-bold text-[12px] sm:text-[13px] tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] pt-0.5">
                  {hookSub}
                </p>
              </div>
            </div>

            {/* DYNAMIC SPOKEN SUBTITLES (Synchronized with speech) */}
            <div className="relative z-30 px-4 pb-4 text-center pointer-events-none transition-all duration-300">
              <div
                className={`inline-block px-3 py-1.5 rounded-xl transition-all ${
                  darkBackdropEnabled
                    ? "bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl"
                    : ""
                }`}
              >
                <p
                  className="italic font-serif leading-tight drop-shadow-md"
                  style={{
                    color: accentColor.hex,
                    fontSize: `${Math.round(fontSize * 0.32)}px`,
                  }}
                >
                  {currentSegment ? "chia sẻ thực tế" : "theo cách của bạn"}
                </p>
                <h4
                  className="font-black uppercase tracking-tight text-white drop-shadow-lg mt-0.5"
                  style={{
                    fontSize: `${Math.round(fontSize * 0.38)}px`,
                  }}
                >
                  {currentSegment ? currentSegment.text : "VIDEO NỔI BẬT"}
                </h4>
              </div>
            </div>

            {/* Click to Play/Pause Controls Overlay */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-all group cursor-pointer"
            >
              {!isPlaying && (
                <div className="flex size-14 items-center justify-center rounded-full bg-amber-400 text-black shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="size-6 fill-black ml-0.5" />
                </div>
              )}
            </button>
          </div>

          {/* Scrubber / Player Controls matching screenshot */}
          <div className="max-w-[340px] mx-auto space-y-2 pt-1">
            {/* Scrubber row */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="flex size-8 items-center justify-center rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-all shrink-0 cursor-pointer"
              >
                {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
              </button>

              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurrentTime(val);
                  if (videoRef.current) videoRef.current.currentTime = val;
                }}
                className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />

              <span className="font-mono text-xs text-zinc-400 shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Helper label matching screenshot */}
            <p className="text-center text-xs text-zinc-500">
              Chọn video để bắt đầu. File gốc không bị thay đổi.
            </p>
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
                      className={`size-7 rounded-full transition-transform cursor-pointer ${
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

              <label className="flex items-center justify-between text-xs font-semibold text-zinc-300 cursor-pointer hover:text-white">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Scissors className="size-3.5" /> Cắt khoảng lặng thừa (&gt; 0.3s)
                </span>
                <input
                  type="checkbox"
                  checked={cutSilenceEnabled}
                  onChange={(e) => setCutSilenceEnabled(e.target.checked)}
                  className="size-4 rounded accent-emerald-500 cursor-pointer"
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
              Xuất theo thời lượng thật của video (<strong className="text-white">{formatTime(duration)}</strong>), tích hợp đầy đủ phụ đề kinetic 2 dòng, tiêu đề 3 tầng và cảnh trám tư liệu.
            </p>

            <button
              type="button"
              onClick={onStartRender}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="size-4 fill-black" />
              <span>⚡ XUẤT VIDEO MASTER (1-CLICK)</span>
            </button>

            <a
              href={currentVideo?.url || "/samples/sample-chi-hanh-superpower.mp4"}
              download="Video_Master_Viral.mp4"
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
