import React, { useRef, useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Heart, 
  MessageCircle, 
  Share2, 
  Music, 
  Sparkles,
  Zap,
  Radio,
  Scan,
  Layers,
  Wand2,
  Volume1,
  GraduationCap,
  Film,
  ExternalLink
} from "lucide-react";
import { AspectRatio, Preset, VideoSource, TransitionType, TranscriptSegment, BrollItem } from "../types";
import { formatTime } from "../lib/utils";
import { playSfx, SfxType } from "../lib/sfx";

interface VideoPreviewPlayerProps {
  video: VideoSource;
  preset: Preset;
  segments?: TranscriptSegment[];
  brollList?: BrollItem[];
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  safeZone: boolean;
  onToggleSafeZone: () => void;
  hologramUI: boolean;
  onToggleHologramUI: () => void;
  vfxShake: boolean;
  highlightColor: "yellow" | "red" | "green" | "magenta" | "rose";
  pop3dAssets: boolean;
  sfxEnabled: boolean;
  transition: TransitionType;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  headlineTitle?: string;
  showHeadlinePlate?: boolean;
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  video,
  preset,
  segments = [],
  brollList = [],
  aspectRatio,
  onChangeAspectRatio,
  safeZone,
  onToggleSafeZone,
  hologramUI,
  onToggleHologramUI,
  vfxShake,
  highlightColor,
  pop3dAssets,
  sfxEnabled,
  transition,
  currentTime,
  onTimeUpdate,
  headlineTitle = "CÔ HẠNH CHIA SẺ — GIẢI OAN DU HỌC",
  showHeadlinePlate = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const brollVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(video.duration || 30.4);
  const [isMuted, setIsMuted] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [activeAsset, setActiveAsset] = useState<{ emoji: string; label: string; color: string } | null>(null);

  // Find the current active segment based on current playback time
  const currentSegment = segments.find(
    (s) => currentTime >= s.sourceStart && currentTime <= s.sourceEnd
  );

  // Find the active B-roll for current segment
  const activeBroll = currentSegment?.brollId
    ? brollList.find((b) => b.id === currentSegment.brollId)
    : null;

  const isBrollCutaway = currentSegment?.brollMode === "cutaway" && !!activeBroll;
  const isBrollPip = currentSegment?.brollMode === "pip" && !!activeBroll;

  // Punch zoom calculation (defaults to currentSegment.zoomScale or 1.0)
  const currentScale = currentSegment?.zoomScale || 1.0;

  // Split active sentence into words
  const activeSentence = currentSegment?.text || preset.sampleHook;
  const sentenceWords = activeSentence.split(/[\s\n]+/);

  const triggerTransitionPreview = () => {
    if (sfxEnabled) {
      playSfx("whoosh");
    }
    setIsFlashing(true);
    setIsShaking(true);
    setTimeout(() => setIsFlashing(false), 300);
    setTimeout(() => setIsShaking(false), 450);
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const handleTime = () => {
      onTimeUpdate(el.currentTime);
      
      const totalWords = sentenceWords.length;
      const wordIdx = Math.floor((el.currentTime * 2.2) % totalWords);
      setActiveWordIndex(wordIdx);

      const currentWord = sentenceWords[wordIdx]?.toUpperCase().replace(/[^A-Z0-9À-Ỹ]/gi, "");

      if (pop3dAssets) {
        const matchedAsset = preset.activeAssets3D?.find((asset) =>
          asset.triggerWord.includes(currentWord) || currentWord.includes(asset.triggerWord.split(" ")[0])
        );

        if (matchedAsset) {
          if (!activeAsset || activeAsset.emoji !== matchedAsset.emoji) {
            setActiveAsset({
              emoji: matchedAsset.emoji,
              label: matchedAsset.label,
              color: matchedAsset.color,
            });
            if (sfxEnabled) {
              playSfx(matchedAsset.sfx);
            }
            if (vfxShake) {
              setIsShaking(true);
              setTimeout(() => setIsShaking(false), 350);
            }
          }
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(el.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    el.addEventListener("timeupdate", handleTime);
    el.addEventListener("loadedmetadata", handleLoadedMetadata);
    el.addEventListener("ended", handleEnded);

    return () => {
      el.removeEventListener("timeupdate", handleTime);
      el.removeEventListener("loadedmetadata", handleLoadedMetadata);
      el.removeEventListener("ended", handleEnded);
    };
  }, [sentenceWords, pop3dAssets, preset.activeAssets3D, sfxEnabled, vfxShake, activeAsset, onTimeUpdate]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      brollVideoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        brollVideoRef.current?.play().catch(() => {});
      }).catch(() => setIsPlaying(false));
      if (sfxEnabled) {
        playSfx("whoosh");
      }
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    if (brollVideoRef.current) {
      brollVideoRef.current.muted = true; // B-roll is always background
    }
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    onTimeUpdate(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Subtitle highlight styling
  const renderSubtitles = () => {
    if (!currentSegment) {
      return (
        <div className="rounded-xl bg-[#42152A]/90 px-3.5 py-2 backdrop-blur-md border border-[#FF3B81]/40 shadow-2xl">
          <div className="text-xs sm:text-sm font-black uppercase text-[#FFF7F8] tracking-tight">
            {preset.sampleHook}
          </div>
        </div>
      );
    }

    const highlightTarget = (currentSegment.highlight || "").toUpperCase();

    // Split sentence by words
    return (
      <div className="rounded-xl bg-[#42152A]/90 px-3.5 py-2 backdrop-blur-md border border-[#FF3B81]/40 shadow-2xl max-w-[285px]">
        <div className="text-xs sm:text-sm font-extrabold text-[#FFF7F8] uppercase tracking-tight flex flex-wrap justify-center items-center gap-1 leading-snug">
          {sentenceWords.map((word, i) => {
            const cleanWord = word.toUpperCase().replace(/[^A-Z0-9À-Ỹ]/gi, "");
            const isHighlighted = highlightTarget.includes(cleanWord) && cleanWord.length > 1;

            if (isHighlighted) {
              return (
                <span
                  key={i}
                  className="bg-[#FF3B81] text-white px-1.5 py-0.5 rounded font-black scale-105 shadow-md inline-block transition-transform"
                >
                  {word}
                </span>
              );
            }

            return (
              <span key={i} className="text-[#FFF7F8] drop-shadow">
                {word}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Aspect Ratio, Safe Zone & Hologram Switcher */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-1.5 w-full max-w-sm px-1">
        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-panel p-0.5 text-xs">
          {(["9:16", "16:9", "1:1", "4:5"] as AspectRatio[]).map((ratio) => (
            <button
              key={ratio}
              onClick={() => onChangeAspectRatio(ratio)}
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all ${
                aspectRatio === ratio
                  ? "bg-pink-500 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleHologramUI}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold transition-all ${
              hologramUI
                ? "border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-sm shadow-cyan-500/20"
                : "border-zinc-800 bg-panel text-zinc-400 hover:text-white"
            }`}
            title="Bật/tắt giao diện Hologram Cyberpunk & Camcorder HUD"
          >
            <Scan className="size-3" />
            <span>Hologram</span>
          </button>

          <button
            onClick={onToggleSafeZone}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold transition-all ${
              safeZone
                ? "border-pink-500/40 bg-pink-500/10 text-pink-400"
                : "border-zinc-800 bg-panel text-zinc-400 hover:text-white"
            }`}
            title="Lưới an toàn tránh bị nút TikTok/Reels che chữ"
          >
            {safeZone ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
            <span>Safe-Zone</span>
          </button>
        </div>
      </div>

      {/* Smartphone Device Frame */}
      <div
        className={`relative mx-auto w-full max-w-[310px] overflow-hidden rounded-[36px] border-[7px] border-zinc-800 bg-black shadow-2xl ring-1 ring-zinc-700/50 transition-all ${
          isShaking ? "vfx-shake-active" : ""
        }`}
      >
        {/* Dynamic Island Notch */}
        <div className="absolute left-1/2 top-2 z-30 h-4 w-24 -translate-x-1/2 rounded-full bg-zinc-950 flex items-center justify-center">
          <div className="size-2 rounded-full bg-zinc-800/80 mr-4"></div>
          <div className="size-1.5 rounded-full bg-pink-900/60"></div>
        </div>

        {/* Video Screen Container */}
        <div className="relative aspect-[9/16] w-full overflow-hidden bg-zinc-950">
          {/* Main Talking-Head Footage with Dynamic Punch-in Zoom Ladder */}
          <video
            ref={videoRef}
            src={video.url}
            loop
            playsInline
            style={{
              transform: `scale(${currentScale})`,
              transformOrigin: "center center",
            }}
            className="size-full object-cover transition-transform duration-300 ease-out"
            onClick={togglePlay}
          />

          {/* Cảnh Trám (B-Roll) Cutaway: Fullscreen 9:16 overlay with transition */}
          {isBrollCutaway && activeBroll && (
            <div className="absolute inset-0 z-18 overflow-hidden bg-black animate-fade-in">
              <video
                ref={brollVideoRef}
                src={activeBroll.url}
                loop
                autoPlay
                muted
                playsInline
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />
              {/* B-roll Badge Pill */}
              <div className="absolute top-16 left-3 z-20 flex items-center gap-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-extrabold text-white shadow-lg animate-pulse">
                <Film className="size-3" />
                <span>CẢNH TRÁM TƯ LIỆU: {activeBroll.title.split(" ")[1] || "B-Roll"}</span>
              </div>
            </div>
          )}

          {/* Cảnh Trám (B-Roll) Picture-in-Picture: Small corner video */}
          {isBrollPip && activeBroll && (
            <div className="absolute right-3 top-20 z-22 w-28 aspect-[9/14] overflow-hidden rounded-xl border-2 border-emerald-400 bg-black shadow-2xl animate-fade-in">
              <video
                src={activeBroll.url}
                loop
                autoPlay
                muted
                playsInline
                className="size-full object-cover"
              />
              <div className="absolute bottom-1 inset-x-1 text-center bg-black/80 rounded px-1 text-[8px] font-extrabold text-emerald-300 truncate">
                TƯ LIỆU
              </div>
            </div>
          )}

          {/* Flash hit effect */}
          {isFlashing && (
            <div className="pointer-events-none absolute inset-0 z-30 bg-white vfx-flash-overlay" />
          )}

          {/* Top Headline Plate (Chuyên Gia Cô Hạnh signature) */}
          {showHeadlinePlate && (
            <div className="pointer-events-none absolute left-3 top-7 z-25 flex flex-col gap-1 max-w-[240px]">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#42152A] to-zinc-950 border border-[#FF3B81]/60 px-2.5 py-0.5 shadow-lg backdrop-blur-md">
                <span className="size-2 rounded-full bg-[#FF3B81] animate-ping"></span>
                <span className="text-[9px] font-black uppercase text-[#FFF7F8] tracking-wider">
                  {preset.expertBadge || "CÔ HẠNH CHIA SẺ"}
                </span>
              </div>
              <div className="rounded-lg bg-black/80 border border-white/10 px-2.5 py-1 backdrop-blur-sm">
                <span className="text-[10px] font-extrabold text-[#FFF7F8] uppercase tracking-wide leading-tight line-clamp-1">
                  {headlineTitle}
                </span>
              </div>
            </div>
          )}

          {/* Beat number tracker (Top Right) */}
          {currentSegment && (
            <div className="pointer-events-none absolute right-3 top-8 z-25 rounded bg-black/70 border border-zinc-800 px-2 py-0.5 text-[9px] font-mono font-extrabold text-[#FF3B81] backdrop-blur-sm">
              BEAT 0{segments.indexOf(currentSegment) + 1} / 0{segments.length || 9}
            </div>
          )}

          {/* Thẻ Info Card Pop-up (Luận Điểm Nổi Bật ở giữa khung hình) */}
          {currentSegment?.infoCardText && (
            <div className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 z-25 flex justify-center animate-asset-pop">
              <div className="rounded-2xl border-2 border-[#FF3B81] bg-[#42152A]/95 px-4 py-2.5 shadow-2xl backdrop-blur-md text-center max-w-[270px]">
                <div className="text-[9px] font-extrabold text-[#FF3B81] uppercase tracking-widest mb-0.5">
                  ✦ LUẬN ĐIỂM CHỨNG MINH ✦
                </div>
                <div className="text-sm font-black text-[#FFF7F8] uppercase tracking-tight">
                  {currentSegment.infoCardText}
                </div>
              </div>
            </div>
          )}

          {/* Hologram Cyber UI / Camcorder HUD Overlay */}
          {hologramUI && (
            <div className="pointer-events-none absolute inset-0 z-15 flex flex-col justify-between p-3.5 text-cyan-400/90 font-mono text-[9px] hologram-scanline">
              <div className="flex items-center justify-between pt-5">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="font-bold text-red-400 tracking-wider">● REC 4K</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300">
                  <span>60 FPS</span>
                  <span>ISO 400</span>
                  <span className="rounded border border-cyan-500/40 px-1">BAT 98%</span>
                </div>
              </div>

              {/* Viewfinder crosshairs */}
              <div className="absolute left-4 top-16 size-4 border-l-2 border-t-2 border-cyan-400/70"></div>
              <div className="absolute right-4 top-16 size-4 border-r-2 border-t-2 border-cyan-400/70"></div>
              <div className="absolute left-4 bottom-20 size-4 border-l-2 border-b-2 border-cyan-400/70"></div>
              <div className="absolute right-4 bottom-20 size-4 border-r-2 border-b-2 border-cyan-400/70"></div>
            </div>
          )}

          {/* 3D Asset Pop / Sticker */}
          {pop3dAssets && activeAsset && (
            <div className="pointer-events-none absolute left-1/2 top-24 z-25 -translate-x-1/2 animate-asset-pop">
              <div
                className="flex items-center gap-2 rounded-2xl border px-3.5 py-1.5 shadow-2xl backdrop-blur-md"
                style={{
                  backgroundColor: "rgba(66, 21, 42, 0.9)",
                  borderColor: activeAsset.color,
                  boxShadow: `0 0 25px ${activeAsset.color}50`,
                }}
              >
                <span className="text-2xl drop-shadow">{activeAsset.emoji}</span>
                <span className="text-xs font-black uppercase text-white tracking-wide">
                  {activeAsset.label}
                </span>
              </div>
            </div>
          )}

          {/* Safe Zone Overlay (TikTok/Reels UI) */}
          {safeZone && (
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 text-white">
              <div className="flex justify-center gap-4 pt-6 text-[11px] font-bold text-white/80">
                <span className="opacity-60">Đang theo dõi</span>
                <span className="border-b-2 border-white pb-0.5">Dành cho bạn</span>
              </div>

              {/* Right Action Icons */}
              <div className="absolute right-2 bottom-20 flex flex-col items-center gap-3.5">
                <div className="flex flex-col items-center">
                  <div className="flex size-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                    <Heart className="size-5 fill-[#FF3B81] text-[#FF3B81]" />
                  </div>
                  <span className="text-[10px] font-bold mt-0.5 drop-shadow">94.2K</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex size-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                    <MessageCircle className="size-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold mt-0.5 drop-shadow">3.4K</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex size-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                    <Share2 className="size-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold mt-0.5 drop-shadow">Chia sẻ</span>
                </div>

                <div className="flex size-8 items-center justify-center rounded-full bg-black/60 border border-white/20 animate-spin">
                  <Music className="size-4 text-[#FF3B81]" />
                </div>
              </div>

              {/* Bottom Caption Safe Zone */}
              <div className="w-[78%] pb-4">
                <div className="text-xs font-bold drop-shadow">@cohanh.duhoc</div>
                <div className="text-[10px] text-zinc-200 line-clamp-2 mt-0.5 drop-shadow">
                  Giải oan hệ vừa học vừa làm tại Đài Loan — Hiểu đúng trước khi chọn #duhoc #cohanh
                </div>
              </div>
            </div>
          )}

          {/* Subtitles: Chữ Trắng Kem - Hồng Đậm #FF3B81 chuẩn Chị Hạnh */}
          <div className="pointer-events-none absolute inset-x-2 bottom-24 z-24 flex flex-col items-center justify-center text-center">
            {renderSubtitles()}
          </div>

          {/* Play/Pause Button Overlay */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 z-28 flex items-center justify-center bg-black/35 backdrop-blur-[1px] cursor-pointer"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-[#FF3B81] text-white shadow-2xl transition-transform hover:scale-110">
                <Play className="size-7 fill-white ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Player Controls Bar */}
        <div className="border-t border-zinc-800 bg-zinc-950 p-2.5">
          {/* Seeker Slider */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 font-mono w-8">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 30.4}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="h-1 flex-1 accent-[#FF3B81] bg-zinc-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-zinc-500 font-mono w-8 text-right">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="flex size-7 items-center justify-center rounded-full bg-zinc-800 text-white hover:bg-[#FF3B81] transition-colors"
              >
                {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5 ml-0.5" />}
              </button>
              <button
                onClick={toggleMute}
                className="flex size-7 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:text-white"
              >
                {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {currentSegment?.brollId && (
                <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-400">
                  🎬 Cảnh Trám Bật
                </span>
              )}
              <button
                onClick={triggerTransitionPreview}
                className="flex items-center gap-1 rounded-md border border-[#FF3B81]/40 bg-[#FF3B81]/15 px-2 py-0.5 text-[10px] font-bold text-[#FF3B81] hover:bg-[#FF3B81] hover:text-white transition-all"
              >
                <Zap className="size-3" />
                <span>Thử VFX/SFX</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
