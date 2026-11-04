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
  Volume1
} from "lucide-react";
import { AspectRatio, Preset, VideoSource, TransitionType } from "../types";
import { formatTime } from "../lib/utils";
import { playSfx, SfxType } from "../lib/sfx";

interface VideoPreviewPlayerProps {
  video: VideoSource;
  preset: Preset;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  safeZone: boolean;
  onToggleSafeZone: () => void;
  hologramUI: boolean;
  onToggleHologramUI: () => void;
  vfxShake: boolean;
  highlightColor: "yellow" | "red" | "green" | "magenta";
  pop3dAssets: boolean;
  sfxEnabled: boolean;
  transition: TransitionType;
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  video,
  preset,
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
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration || 30);
  const [isMuted, setIsMuted] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [activeAsset, setActiveAsset] = useState<{ emoji: string; label: string; color: string } | null>(null);

  // Split hook into individual words
  const hookWords = preset.sampleHook.split(" ");

  // Trigger sound effect and visual transition test
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

    const handleTimeUpdate = () => {
      setCurrentTime(el.currentTime);
      
      // Calculate active word index (changes smoothly every ~0.6s)
      const totalWords = hookWords.length;
      const wordIdx = Math.floor((el.currentTime * 2.2) % totalWords);
      setActiveWordIndex(wordIdx);

      const currentWord = hookWords[wordIdx]?.toUpperCase().replace(/[^A-Z0-9À-Ỹ]/gi, "");

      // Check if current word matches any 3D asset triggers
      if (pop3dAssets) {
        const matchedAsset = preset.activeAssets3D.find((asset) =>
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
        } else {
          // Keep asset briefly then fade
          if (activeAsset) {
            setTimeout(() => setActiveAsset(null), 1200);
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

    el.addEventListener("timeupdate", handleTimeUpdate);
    el.addEventListener("loadedmetadata", handleLoadedMetadata);
    el.addEventListener("ended", handleEnded);

    return () => {
      el.removeEventListener("timeupdate", handleTimeUpdate);
      el.removeEventListener("loadedmetadata", handleLoadedMetadata);
      el.removeEventListener("ended", handleEnded);
    };
  }, [video.url, hookWords, pop3dAssets, preset.activeAssets3D, sfxEnabled, vfxShake, activeAsset]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      if (sfxEnabled) {
        playSfx("whoosh");
      }
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Color mapper for highlighted words
  const getHighlightClass = (word: string, isCurrent: boolean) => {
    const upper = word.toUpperCase().replace(/[^A-Z0-9À-Ỹ]/gi, "");
    const isKeyword = preset.keyWords.some((k) => k.includes(upper) || upper.includes(k.split(" ")[0]));

    if (isCurrent && isKeyword) {
      switch (highlightColor) {
        case "yellow":
          return "text-[#FFE600] neon-glow-yellow scale-125 font-black bg-amber-500/25 px-1.5 py-0.5 rounded-lg border border-amber-400/50 shadow-lg";
        case "red":
          return "text-[#FF2E63] neon-glow-red scale-125 font-black bg-red-600/30 px-1.5 py-0.5 rounded-lg border border-red-500/50 shadow-lg";
        case "green":
          return "text-[#00FF66] neon-glow-green scale-125 font-black bg-emerald-600/30 px-1.5 py-0.5 rounded-lg border border-emerald-400/50 shadow-lg";
        case "magenta":
          return "text-[#FF007F] neon-glow-magenta scale-125 font-black bg-pink-600/30 px-1.5 py-0.5 rounded-lg border border-pink-400/50 shadow-lg";
      }
    }

    if (isKeyword) {
      return "text-amber-300 font-extrabold underline underline-offset-4 decoration-amber-400";
    }

    if (isCurrent) {
      return "text-white font-extrabold scale-110 bg-white/20 px-1 rounded";
    }

    return "text-zinc-200 opacity-90";
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
                  ? "bg-brand text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Hologram UI Toggle */}
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

          {/* Safe Zone Toggle */}
          <button
            onClick={onToggleSafeZone}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold transition-all ${
              safeZone
                ? "border-brand/40 bg-brand/10 text-brand"
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
          <div className="size-1.5 rounded-full bg-blue-900/60"></div>
        </div>

        {/* Video Screen Container */}
        <div className="relative aspect-[9/16] w-full overflow-hidden bg-zinc-950">
          <video
            ref={videoRef}
            src={video.url}
            loop
            playsInline
            className={`size-full object-cover transition-all ${
              preset.skinGlowEnabled ? "contrast-[1.05] brightness-[1.06] saturate-[1.12]" : ""
            }`}
            onClick={togglePlay}
          />

          {/* Flash hit effect */}
          {isFlashing && (
            <div className="pointer-events-none absolute inset-0 z-30 bg-white vfx-flash-overlay" />
          )}

          {/* Hologram Cyber UI / Camcorder HUD Overlay */}
          {hologramUI && (
            <div className="pointer-events-none absolute inset-0 z-15 flex flex-col justify-between p-3.5 text-cyan-400/90 font-mono text-[9px] hologram-scanline">
              {/* Top HUD */}
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

              {/* Viewfinder crosshairs in 4 corners */}
              <div className="absolute left-4 top-16 size-4 border-l-2 border-t-2 border-cyan-400/70"></div>
              <div className="absolute right-4 top-16 size-4 border-r-2 border-t-2 border-cyan-400/70"></div>
              <div className="absolute left-4 bottom-20 size-4 border-l-2 border-b-2 border-cyan-400/70"></div>
              <div className="absolute right-4 bottom-20 size-4 border-r-2 border-b-2 border-cyan-400/70"></div>

              {/* Center Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-6 border border-cyan-400/40 rounded-full flex items-center justify-center">
                  <div className="size-1 bg-cyan-400 rounded-full"></div>
                </div>
              </div>

              {/* Bottom Hologram Audio Meter */}
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-1">
                  <span className="text-[8px] text-cyan-400">CH1</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5, 6].map((bar) => (
                      <span
                        key={bar}
                        className={`w-1 h-2 rounded-xs ${
                          bar > 4 ? "bg-red-400" : bar > 2 ? "bg-amber-400" : "bg-cyan-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-[8px] text-cyan-400 tracking-widest">
                  HUD V2.4 // AI STABILIZED
                </div>
              </div>
            </div>
          )}

          {/* 3D Asset Pop / Sticker Bounce according to speech */}
          {pop3dAssets && activeAsset && (
            <div className="pointer-events-none absolute left-1/2 top-24 z-25 -translate-x-1/2 animate-asset-pop">
              <div
                className="flex items-center gap-2 rounded-2xl border px-3.5 py-1.5 shadow-2xl backdrop-blur-md"
                style={{
                  backgroundColor: "rgba(0,0,0,0.85)",
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

          {/* Skin glow badge indicator on screen */}
          {preset.skinGlowEnabled && (
            <div className="absolute left-3 top-7 z-20 flex items-center gap-1 rounded-full bg-pink-500/80 backdrop-blur-sm px-2 py-0.5 text-[9px] font-extrabold text-white shadow-md animate-pulse">
              <Sparkles className="size-2.5" /> Korean Glow Active
            </div>
          )}

          {/* Play/Pause Center Overlay */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[1px] cursor-pointer"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-brand/90 text-black shadow-xl transition-transform hover:scale-110">
                <Play className="size-7 fill-black ml-1" />
              </div>
            </div>
          )}

          {/* Safe Zone Overlay (TikTok/Reels UI) */}
          {safeZone && (
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 text-white">
              {/* Top Tabs */}
              <div className="flex justify-center gap-4 pt-6 text-[11px] font-bold text-white/80">
                <span className="opacity-60">Đang theo dõi</span>
                <span className="border-b-2 border-white pb-0.5">Dành cho bạn</span>
              </div>

              {/* Right Action Icons */}
              <div className="absolute right-2 bottom-20 flex flex-col items-center gap-3.5">
                <div className="flex flex-col items-center">
                  <div className="flex size-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                    <Heart className="size-5 fill-red-500 text-red-500" />
                  </div>
                  <span className="text-[10px] font-bold mt-0.5 drop-shadow">86.4K</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex size-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                    <MessageCircle className="size-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold mt-0.5 drop-shadow">1.2K</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex size-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                    <Share2 className="size-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold mt-0.5 drop-shadow">Chia sẻ</span>
                </div>

                <div className="flex size-8 items-center justify-center rounded-full bg-black/60 border border-white/20 animate-spin">
                  <Music className="size-4 text-brand" />
                </div>
              </div>

              {/* Bottom Caption Safe Zone */}
              <div className="w-[78%] pb-4">
                <div className="text-xs font-bold drop-shadow">@masterclip.creator</div>
                <div className="text-[10px] text-zinc-200 line-clamp-2 mt-0.5 drop-shadow">
                  Biến video thô thành short triệu view tự động bằng AI #masterclip #videoviral #shorts
                </div>
              </div>
            </div>
          )}

          {/* Kinetic Subtitles: Hiện từng từ bám sát giọng đọc & Phóng to từ khóa đổi màu */}
          <div className="pointer-events-none absolute inset-x-2 bottom-24 z-20 flex flex-col items-center justify-center text-center">
            <div className="rounded-xl bg-black/75 px-3 py-2 backdrop-blur-md border border-white/10 shadow-2xl max-w-[270px]">
              <div className="text-xs sm:text-sm font-black uppercase tracking-tight flex flex-wrap justify-center items-center gap-1.5 leading-relaxed">
                {hookWords.map((word, i) => {
                  const isCurrent = i === activeWordIndex;
                  const highlightClass = getHighlightClass(word, isCurrent);

                  return (
                    <span
                      key={i}
                      className={`inline-block transition-all duration-150 ${highlightClass}`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
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
              max={duration || 60}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="h-1 flex-1 accent-brand bg-zinc-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-zinc-500 font-mono w-8 text-right">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="flex size-7 items-center justify-center rounded-full bg-zinc-800 text-white hover:bg-brand hover:text-black transition-colors"
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

            {/* Test Transition & SFX Button */}
            <button
              onClick={triggerTransitionPreview}
              className="flex items-center gap-1 rounded-md border border-brand/40 bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand hover:bg-brand hover:text-black transition-all"
              title="Kích hoạt thử hiệu ứng chuyển cảnh Zoom, Flash và âm thanh Whoosh/Pop"
            >
              <Zap className="size-3" />
              <span>Thử VFX / SFX</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
