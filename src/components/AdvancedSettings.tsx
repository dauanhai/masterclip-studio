import React from "react";
import { 
  Sliders, 
  Scissors, 
  Gauge, 
  Type, 
  Music, 
  Sparkles, 
  Volume2, 
  Zap, 
  Scan, 
  Layers, 
  Smile, 
  VolumeX, 
  Radio, 
  Check,
  Flame,
  Wand2
} from "lucide-react";
import { AdvancedSettingsConfig, TransitionType } from "../types";
import { playSfx, SfxType } from "../lib/sfx";

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

  const handleTestSfx = (type: SfxType) => {
    playSfx(type);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-card/80 p-5 shadow-xl backdrop-blur-sm space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Wand2 className="size-4" />
          </div>
          <h3 className="text-sm font-extrabold text-white">
            Bộ Hiệu Ứng Chuyển Cảnh, VFX, SFX & Kinetic Subtitles
          </h3>
        </div>
        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
          Mẫu Viral Tự Động
        </span>
      </div>

      {/* Row 1: Kinetic Subtitles & Highlight Color */}
      <div className="rounded-xl border border-zinc-800/80 bg-panel/50 p-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Type className="size-3.5 text-brand" />
            <span>Chữ Hiện Từng Từ Bám Sát Giọng Đọc (Kinetic Subtitles)</span>
          </label>
          <span className="text-[10px] text-zinc-400">Từ khóa quan trọng phóng to & đổi màu</span>
        </div>

        {/* Highlight Color Picker */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-zinc-400">Màu từ khóa nhấn:</span>
          <div className="flex items-center gap-2">
            {[
              { id: "yellow", name: "Vàng Neon", color: "#FFE600", bg: "bg-amber-400" },
              { id: "red", name: "Đỏ Rực", color: "#FF2E63", bg: "bg-red-500" },
              { id: "green", name: "Xanh Lá", color: "#00FF66", bg: "bg-emerald-400" },
              { id: "magenta", name: "Magenta", color: "#FF007F", bg: "bg-pink-500" },
            ].map((col) => (
              <button
                key={col.id}
                onClick={() => update({ highlightKeywordColor: col.id as any })}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${
                  settings.highlightKeywordColor === col.id
                    ? "border-white bg-white/10 text-white shadow-md"
                    : "border-zinc-800 bg-panel text-zinc-400 hover:text-white"
                }`}
              >
                <span className={`size-2.5 rounded-full ${col.bg}`} />
                <span>{col.name}</span>
                {settings.highlightKeywordColor === col.id && <Check className="size-3 text-brand" />}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles: Zoom keywords & 3D Assets Pop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-zinc-800/80">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={settings.zoomKeywords}
              onChange={(e) => update({ zoomKeywords: e.target.checked })}
              className="accent-brand size-3.5 rounded"
            />
            <span>Phóng to từ khóa 130% khi phát âm</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={settings.pop3dAssets}
              onChange={(e) => update({ pop3dAssets: e.target.checked })}
              className="accent-brand size-3.5 rounded"
            />
            <span>Bật nảy 3D Sticker (💰, 🔥, 🚀, 💡, ⚠️) theo lời thoại</span>
          </label>
        </div>
      </div>

      {/* Row 2: Transitions & VFX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Transitions Selector */}
        <div className="rounded-xl border border-zinc-800/80 bg-panel/50 p-3">
          <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 mb-2">
            <Zap className="size-3.5 text-amber-400" />
            <span>Hiệu Ứng Chuyển Cảnh (Transitions)</span>
          </label>

          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "zoom-punch", name: "Zoom-Punch Giật" },
              { id: "flash-cut", name: "Flash Chớp Trắng" },
              { id: "glitch", name: "Cyber Glitch" },
              { id: "whip-pan", name: "Whip Pan Lướt" },
              { id: "film-dissolve", name: "Film Dissolve Mờ" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => update({ transition: t.id as TransitionType })}
                className={`rounded-lg border px-2 py-1.5 text-left text-[11px] font-semibold transition-all ${
                  settings.transition === t.id
                    ? "border-brand bg-brand/15 text-brand"
                    : "border-zinc-800 bg-panel text-zinc-400 hover:text-white"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Hologram UI & Visual Effects (VFX) */}
        <div className="rounded-xl border border-zinc-800/80 bg-panel/50 p-3 space-y-2">
          <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 mb-1">
            <Scan className="size-3.5 text-cyan-400" />
            <span>Hologram UI & Hiệu Ứng Hình Ảnh (VFX)</span>
          </label>

          <div className="space-y-1.5 text-xs text-zinc-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.hologramUI}
                onChange={(e) => update({ hologramUI: e.target.checked })}
                className="accent-brand size-3.5 rounded"
              />
              <span className="text-cyan-300 font-semibold">Khung Hologram Cyber / Camcorder HUD</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.vfxShake}
                onChange={(e) => update({ vfxShake: e.target.checked })}
                className="accent-brand size-3.5 rounded"
              />
              <span>Camera Shake (Rung lắc giật nhịp từ khóa)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.vfxFlash}
                onChange={(e) => update({ vfxFlash: e.target.checked })}
                className="accent-brand size-3.5 rounded"
              />
              <span>Flash White Hit (Chớp sáng khi chuyển câu)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.skinGlow}
                onChange={(e) => update({ skinGlow: e.target.checked })}
                className="accent-brand size-3.5 rounded"
              />
              <span className="text-pink-300">Korean Glow (Làm sáng & mịn da mặt)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Row 3: Sound Effects (SFX) Audio Board */}
      <div className="rounded-xl border border-zinc-800/80 bg-panel/50 p-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Volume2 className="size-3.5 text-emerald-400" />
            <span>Bộ Hiệu Ứng Âm Thanh (Sound Effects - SFX)</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-brand font-semibold">
            <input
              type="checkbox"
              checked={settings.sfxEnabled}
              onChange={(e) => update({ sfxEnabled: e.target.checked })}
              className="accent-brand size-3.5 rounded"
            />
            <span>Tự động chèn SFX theo nhịp</span>
          </label>
        </div>

        {/* SFX Soundboard Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {[
            { id: "whoosh", name: "💨 Whoosh Gió", desc: "Chuyển cảnh" },
            { id: "pop", name: "🫧 Pop Bong Bóng", desc: "Hiện sticker" },
            { id: "cash", name: "💰 Cash Tiền", desc: "Doanh thu" },
            { id: "ding", name: "💡 Ding Chuông", desc: "Ý tưởng" },
            { id: "bassdrop", name: "💣 Bass Drop", desc: "Điểm nhấn" },
          ].map((sfx) => (
            <button
              key={sfx.id}
              onClick={() => handleTestSfx(sfx.id as SfxType)}
              className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-card p-2 text-center transition-all hover:border-brand/70 hover:bg-brand/10 hover:scale-105 active:scale-95"
              title="Bấm để nghe thử âm thanh"
            >
              <span className="text-[11px] font-bold text-white">{sfx.name}</span>
              <span className="text-[9px] text-zinc-500 mt-0.5">{sfx.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Row 4: Speed & Silence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Silence Cutting */}
        <div className="rounded-xl border border-zinc-800/80 bg-panel/50 p-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Scissors className="size-3.5 text-amber-400" />
              <span>Cắt khoảng lặng</span>
            </label>
            <span className="text-xs font-mono font-bold text-brand">
              {settings.silenceThreshold}s
            </span>
          </div>
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

        {/* Speed */}
        <div className="rounded-xl border border-zinc-800/80 bg-panel/50 p-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Gauge className="size-3.5 text-blue-400" />
              <span>Tốc độ giọng đọc</span>
            </label>
            <span className="text-xs font-mono font-bold text-brand">
              {settings.speed}x
            </span>
          </div>
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

      {/* Big Action Render Button */}
      <div className="pt-2">
        <button
          onClick={onStartRender}
          className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-brand via-amber-400 to-brand p-0.5 shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all"
        >
          <div className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-black px-6 text-sm font-extrabold text-white transition-all group-hover:bg-transparent group-hover:text-black">
            <Sparkles className="size-4 text-brand group-hover:text-black" />
            <span>⚡ BẮT ĐẦU TẠO SHORT VIRAL ĐẦY ĐỦ VFX, SFX & KINETIC SUBTITLES</span>
          </div>
        </button>
      </div>
    </div>
  );
};
