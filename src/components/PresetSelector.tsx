import React from "react";
import { 
  Sparkles, 
  Zap, 
  Mic, 
  Film, 
  ShoppingBag, 
  Check, 
  Volume2, 
  Scissors, 
  Gauge 
} from "lucide-react";
import { Preset } from "../types";
import { PRESETS } from "../data/presets";

interface PresetSelectorProps {
  selectedPresetId: string;
  onSelectPreset: (preset: Preset) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Zap,
  Mic,
  Film,
  ShoppingBag,
};

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  selectedPresetId,
  onSelectPreset,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Sparkles className="size-4 text-brand" /> Chọn Preset Phong Cách Cho Video
          </h3>
          <p className="text-[11px] text-zinc-400">
            Tự động áp dụng màu sắc, kiểu chữ phụ đề, tốc độ nói và quy luật cắt viral
          </p>
        </div>
        <span className="text-[10px] font-bold text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-full">
          5 Phong Cách
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-1">
        {PRESETS.map((preset) => {
          const Icon = ICON_MAP[preset.iconName] || Sparkles;
          const isSelected = preset.id === selectedPresetId;

          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`group relative rounded-xl border p-3.5 cursor-pointer transition-all ${
                isSelected
                  ? "border-brand bg-panel/90 shadow-xl shadow-brand/10 ring-1 ring-brand/40"
                  : "border-zinc-800 bg-card/60 hover:border-zinc-700 hover:bg-card"
              }`}
            >
              {/* Active selection badge */}
              {isSelected && (
                <div className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-brand text-black">
                  <Check className="size-3.5 stroke-[3]" />
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Icon box */}
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: `${preset.accentColor}18`,
                    color: preset.accentColor,
                    borderColor: `${preset.accentColor}40`,
                    borderWidth: 1,
                  }}
                >
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0 flex-1 pr-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs font-extrabold text-white group-hover:text-brand transition-colors">
                      {preset.name}
                    </h4>
                    <span
                      className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${preset.accentColor}25`,
                        color: preset.accentColor,
                      }}
                    >
                      {preset.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                    {preset.description}
                  </p>

                  {/* Subtitle sample badge */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 font-medium">Hook mẫu:</span>
                    <span className="rounded bg-black/60 border border-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-300 truncate max-w-[280px]">
                      {preset.sampleHook}
                    </span>
                  </div>

                  {/* Meta badges */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px]">
                    {preset.skinGlowEnabled && (
                      <span className="inline-flex items-center gap-1 rounded bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 text-pink-400 font-medium">
                        🌸 Làm đẹp da
                      </span>
                    )}
                    {preset.autoSilenceCut && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-amber-400 font-medium">
                        <Scissors className="size-2.5" /> Cắt lặng 0.3s
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300 font-medium">
                      <Gauge className="size-2.5" /> Tốc độ: {preset.speed}x
                    </span>
                    <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300 font-medium">
                      Sub: {preset.subtitleStyle.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
