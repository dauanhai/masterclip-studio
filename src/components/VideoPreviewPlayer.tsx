import React, { useRef, useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Heart, 
  MessageCircle, 
  Share2, 
  Music, 
  Sparkles,
  Layers
} from "lucide-react";
import { AspectRatio, Preset, VideoSource } from "../types";
import { formatTime } from "../lib/utils";

interface VideoPreviewPlayerProps {
  video: VideoSource;
  preset: Preset;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  safeZone: boolean;
  onToggleSafeZone: () => void;
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  video,
  preset,
  aspectRatio,
  onChangeAspectRatio,
  safeZone,
  onToggleSafeZone,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration || 30);
  const [isMuted, setIsMuted] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  // Split sample hook into words for karaoke highlight simulation
  const hookWords = preset.sampleHook.split(" ");

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const handleTimeUpdate = () => {
      setCurrentTime(el.currentTime);
      // Change active word every 0.6s
      const wordIdx = Math.floor((el.currentTime * 2) % hookWords.length);
      setActiveWordIndex(wordIdx);
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
  }, [video.url, hookWords.length]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
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

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Aspect Ratio & Safe Zone Toolbar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 w-full max-w-sm px-1">
        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-panel p-0.5 text-xs">
          {(["9:16", "16:9", "1:1", "4:5"] as AspectRatio[]).map((ratio) => (
            <button
              key={ratio}
              onClick={() => onChangeAspectRatio(ratio)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                aspectRatio === ratio
                  ? "bg-brand text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>

        <button
          onClick={onToggleSafeZone}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
            safeZone
              ? "border-brand/40 bg-brand/10 text-brand"
              : "border-zinc-800 bg-panel text-zinc-400 hover:text-white"
          }`}
          title="Bật/tắt lưới an toàn tránh bị nút TikTok/Reels che chữ"
        >
          {safeZone ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
          <span>Safe-Zone TikTok</span>
        </button>
      </div>

      {/* Smartphone Device Frame */}
      <div className="relative mx-auto w-full max-w-[310px] overflow-hidden rounded-[36px] border-[7px] border-zinc-800 bg-black shadow-2xl ring-1 ring-zinc-700/50">
        {/* Dynamic Island / Notch */}
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

          {/* Skin glow badge indicator on screen */}
          {preset.skinGlowEnabled && (
            <div className="absolute left-3 top-7 z-20 flex items-center gap-1 rounded-full bg-pink-500/80 backdrop-blur-sm px-2 py-0.5 text-[9px] font-extrabold text-white shadow-md animate-pulse">
              <Sparkles className="size-2.5" /> Korean Glow Active
            </div>
          )}

          {/* Play/Pause Center Overlay on click */}
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

              {/* Right Action Icons (Like, Comment, Bookmark, Share) */}
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

          {/* Realtime Subtitles Simulated Render based on Preset */}
          <div className="pointer-events-none absolute inset-x-3 bottom-28 z-20 flex flex-col items-center justify-center text-center">
            {preset.subtitleStyle === "neon" && (
              <div className="rounded-lg bg-black/70 px-3 py-1.5 backdrop-blur-sm border border-pink-500/50 shadow-2xl">
                <div className="text-sm sm:text-base font-black uppercase tracking-tight flex flex-wrap justify-center gap-1.5">
                  {hookWords.map((word, i) => (
                    <span
                      key={i}
                      className={
                        i === activeWordIndex
                          ? "text-[#FF007F] neon-glow-magenta scale-110 transition-all font-black"
                          : "text-[#FFE600] neon-glow-yellow"
                      }
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {preset.subtitleStyle === "karaoke" && (
              <div className="rounded-xl bg-black/80 px-3 py-1.5 backdrop-blur-sm border border-amber-500/40">
                <div className="text-xs sm:text-sm font-extrabold uppercase flex flex-wrap justify-center gap-1 text-white">
                  {hookWords.map((word, i) => (
                    <span
                      key={i}
                      className={`px-1 rounded transition-colors ${
                        i === activeWordIndex
                          ? "bg-brand text-black font-black scale-105"
                          : "text-zinc-300"
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {preset.subtitleStyle === "box" && (
              <div className="bg-amber-400 text-black px-3 py-1 rounded font-black text-xs uppercase tracking-wide shadow-lg border border-black/20">
                {preset.sampleHook}
              </div>
            )}

            {preset.subtitleStyle === "minimal" && (
              <div className="text-white text-xs font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-[240px]">
                "{preset.sampleHook}"
              </div>
            )}
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

            <div className="text-[10px] font-medium text-zinc-400">
              Preset: <span className="font-bold text-brand">{preset.name.split(" ")[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
