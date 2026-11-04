import React from "react";
import { 
  Sliders, 
  Scissors, 
  Gauge, 
  Type, 
  Music, 
  Sparkles, 
  Volume2, 
  Flame,
  Check
} from "lucide-react";
import { AdvancedSettingsConfig } from "../types";

interface AdvancedSettingsProps {
  settings: AdvancedSettingsConfig;
  onChangeSettings: (newSettings: AdvancedSettingsConfig) => void;
  onStartRender: () => void;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  settings,
  onChangeSettings,
  onStartRender,
}) => {
  const update = (partial: Partial<AdvancedSettingsConfig>) => {
    onChangeSettings({ ...settings, ...partial });
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-card/80 p-5 shadow-xl backdrop-blur-sm space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Sliders className="size-4" />
          </div>
          <h3 className="text-sm font-extrabold text-white">
            Tinh Chỉnh Thông Số Studio
          </h3>
        </div>
        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          Chuẩn Viral Reels & TikTok
        </span>
      </div>

      {/* Row 1: Speed & Silence Cutting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Silence Cutting */}
        <div className="rounded-xl border border-zinc-800/80 bg-panel/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 cursor-pointer">
              <Scissors className="size-3.5 text-amber-400" />
              <span>Cắt khoảng lặng vô nghĩa</span>
            </label>
            <span className="text-xs font-mono font-bold text-brand">
              {settings.silenceThreshold}s
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 mb-2">
            Tự động cắt bỏ những lúc người nói ngập ngừng, suy nghĩ dài hơn ngưỡng này.
          </p>
          <input
            type="range"
            min={0.2}
            max={1.0}
            step={0.1}
            value={settings.silenceThreshold}
            onChange={(e) => update({ silenceThreshold: parseFloat(e.target.value) })}
            className="w-full accent-brand bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Playback Speech Speed */}
        <div className="rounded-xl border border-zinc-800/80 bg-panel/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Gauge className="size-3.5 text-blue-400" />
              <span>Tăng tốc giọng nói</span>
            </label>
            <span className="text-xs font-mono font-bold text-brand">
              {settings.speed}x
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 mb-2">
            Giúp video ngắn gọn, nhịp nhanh cuốn hút nhưng không biến đổi tông giọng tự nhiên.
          </p>
          <input
            type="range"
            min={1.0}
            max={1.3}
            step={0.02}
            value={settings.speed}
            onChange={(e) => update({ speed: parseFloat(e.target.value) })}
            className="w-full accent-brand bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Row 2: Subtitle Style */}
      <div className="rounded-xl border border-zinc-800/80 bg-panel/50 p-3">
        <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 mb-2">
          <Type className="size-3.5 text-purple-400" />
          <span>Kiểu Phụ Đề Chữ Động (Auto-Captions)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: "neon", name: "Neon Alex Hormozi", desc: "Chữ Magenta/Vàng giật" },
            { id: "karaoke", name: "Karaoke Word", desc: "Sáng từng từ theo giọng" },
            { id: "box", name: "Box Vàng TikTok", desc: "Nền nổi bật chống rối" },
            { id: "minimal", name: "Tối Giản Luxury", desc: "Thanh lịch điện ảnh" },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => update({ subtitleStyle: style.id as any })}
              className={`rounded-lg border p-2 text-left transition-all ${
                settings.subtitleStyle === style.id
                  ? "border-brand bg-brand/10 text-white"
                  : "border-zinc-800 bg-panel text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <div className="text-[11px] font-bold text-zinc-100 flex items-center justify-between">
                <span>{style.name}</span>
                {settings.subtitleStyle === style.id && <Check className="size-3 text-brand" />}
              </div>
              <div className="text-[9px] text-zinc-500 mt-0.5">{style.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Row 3: Music Mood & Ducking */}
      <div className="rounded-xl border border-zinc-800/80 bg-panel/50 p-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Music className="size-3.5 text-pink-400" />
            <span>Kho Nhạc Nền Miễn Bản Quyền (Copyright-Free)</span>
          </label>
          <div className="flex items-center gap-1 text-[10px] text-zinc-400">
            <Volume2 className="size-3 text-brand" />
            <span>Ducking: -{settings.duckingLevel}% khi có tiếng nói</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: "trending", name: "🔥 Trending TikTok" },
            { id: "chill", name: "☕ Lofi & Chill" },
            { id: "upbeat", name: "⚡ Upbeat & Năng Lượng" },
            { id: "dramatic", name: "🎬 Kịch Tính & Hồi Hộp" },
            { id: "none", name: "🚫 Không Nhạc Nền" },
          ].map((mood) => (
            <button
              key={mood.id}
              onClick={() => update({ musicMood: mood.id as any })}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                settings.musicMood === mood.id
                  ? "border-brand bg-brand/15 text-brand"
                  : "border-zinc-800 bg-panel text-zinc-400 hover:text-white"
              }`}
            >
              {mood.name}
            </button>
          ))}
        </div>
      </div>

      {/* Big Render Button */}
      <div className="pt-2">
        <button
          onClick={onStartRender}
          className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-brand via-amber-400 to-brand p-0.5 shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all"
        >
          <div className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-black px-6 text-sm font-extrabold text-white transition-all group-hover:bg-transparent group-hover:text-black">
            <Sparkles className="size-4 text-brand group-hover:text-black" />
            <span>⚡ BẮT ĐẦU QUÉT AI & TẠO 3 SHORT VIRAL NGAY</span>
          </div>
        </button>
        <p className="text-center text-[11px] text-zinc-500 mt-2">
          Hệ thống sẽ chạy qua 5 bước phân tích ngữ âm, tách câu hook và xuất video hoàn thiện.
        </p>
      </div>
    </div>
  );
};
