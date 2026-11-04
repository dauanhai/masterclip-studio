import React, { useState } from "react";
import { 
  Header 
} from "./components/Header";
import { 
  AiToolsMarquee 
} from "./components/AiToolsMarquee";
import { 
  UploadDropzone 
} from "./components/UploadDropzone";
import { 
  PresetSelector 
} from "./components/PresetSelector";
import { 
  VideoPreviewPlayer 
} from "./components/VideoPreviewPlayer";
import { 
  AdvancedSettings 
} from "./components/AdvancedSettings";
import { 
  ProcessingModal 
} from "./components/ProcessingModal";
import { 
  OutputResults 
} from "./components/OutputResults";
import { 
  ProjectHistory 
} from "./components/ProjectHistory";
import { 
  PRESETS 
} from "./data/presets";
import { 
  AspectRatio, 
  AdvancedSettingsConfig, 
  Preset, 
  VideoSource, 
  ProjectHistoryItem,
  TransitionType 
} from "./types";
import { 
  Sparkles, 
  Crown, 
  Check, 
  X, 
  ArrowRight, 
  Zap, 
  Wand2 
} from "lucide-react";

export function App() {
  const [currentVideo, setCurrentVideo] = useState<VideoSource | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [safeZone, setSafeZone] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasRenderedOutput, setHasRenderedOutput] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const [settings, setSettings] = useState<AdvancedSettingsConfig>({
    aspectRatio: "9:16",
    safeZone: true,
    hologramUI: true,
    transition: "zoom-punch",
    vfxShake: true,
    vfxFlash: true,
    skinGlow: false,
    vfxRgbGlitch: true,
    vfxFilmGrain: false,
    silenceThreshold: 0.3,
    speed: 1.18,
    subtitlesEnabled: true,
    subtitleStyle: "neon",
    highlightKeywordColor: "yellow",
    zoomKeywords: true,
    pop3dAssets: true,
    sfxEnabled: true,
    musicMood: "upbeat",
    musicVolume: 35,
    duckingLevel: 80,
    hookOpening: true,
  });

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
  };

  const handleSelectPreset = (preset: Preset) => {
    setSelectedPreset(preset);
    setSettings((prev) => ({
      ...prev,
      skinGlow: preset.skinGlowEnabled,
      speed: preset.speed,
      subtitleStyle: preset.subtitleStyle,
      musicMood: preset.bgmMood,
      transition: preset.recommendedTransition,
      hologramUI: preset.hologramDefault,
      highlightKeywordColor: preset.highlightKeywordColor,
      vfxShake: preset.recommendedVfx.includes("shake"),
      vfxFlash: preset.recommendedVfx.includes("flash"),
      vfxFilmGrain: preset.recommendedVfx.includes("film-grain"),
    }));
    showToast(`Đã áp dụng Preset "${preset.name}" kèm VFX & SFX`);
  };

  const handleStartRender = () => {
    if (!currentVideo) {
      showToast("Vui lòng kéo thả hoặc chọn 1 video trước!");
      return;
    }
    setIsProcessing(true);
  };

  const handleCompleteRender = () => {
    setIsProcessing(false);
    setHasRenderedOutput(true);
    showToast("Chúc mừng! 3 video Short viral hoàn chỉnh đã sẵn sàng tải về.");
  };

  const handleOpenHistoryProject = (proj: ProjectHistoryItem) => {
    setCurrentVideo({
      id: proj.id,
      name: proj.title,
      url: proj.thumbnailUrl,
      size: 3200000,
      duration: 65,
      isSample: true,
    });
    setHasRenderedOutput(false);
    showToast(`Đã mở dự án: ${proj.title}`);
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 selection:bg-brand selection:text-black">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-[500px] w-[1000px] -translate-x-1/2 bg-amber-500/5 blur-[120px] rounded-full" />
      <div className="pointer-events-none fixed inset-0 -z-20 app-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]" />

      {/* Header */}
      <Header
        onShowPricing={() => setShowPricingModal(true)}
        onShowHistory={() => {
          const el = document.getElementById("project-history-section");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* AI Tools Marquee Ribbon */}
      <AiToolsMarquee onSelectTool={(tool) => showToast(`Tính năng AI "${tool}" đã sẵn sàng.`)} />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* State 1: Rendered Output Results View */}
        {hasRenderedOutput && currentVideo ? (
          <OutputResults
            sourceVideo={currentVideo}
            preset={selectedPreset}
            onReset={() => setHasRenderedOutput(false)}
          />
        ) : currentVideo ? (
          /* State 2: Interactive Split Workspace (Video Loaded) */
          <div className="space-y-6">
            <UploadDropzone
              currentVideo={currentVideo}
              onSelectVideo={(v) => {
                setCurrentVideo(v);
                setHasRenderedOutput(false);
              }}
              onClearVideo={() => setCurrentVideo(null)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Preset Selector & Advanced Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <PresetSelector
                  selectedPresetId={selectedPreset.id}
                  onSelectPreset={handleSelectPreset}
                />

                <AdvancedSettings
                  settings={settings}
                  onChangeSettings={setSettings}
                  onStartRender={handleStartRender}
                />
              </div>

              {/* Right Column: 9:16 Realtime Mobile Player Preview (5 cols) */}
              <div className="lg:col-span-5 sticky top-20">
                <div className="rounded-2xl border border-zinc-800 bg-card/60 p-4 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-brand" /> Xem Trước 9:16 Kinetic Subtitles
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Zap className="size-3" /> VFX & SFX Bật
                    </span>
                  </div>

                  <VideoPreviewPlayer
                    video={currentVideo}
                    preset={selectedPreset}
                    aspectRatio={aspectRatio}
                    onChangeAspectRatio={setAspectRatio}
                    safeZone={safeZone}
                    onToggleSafeZone={() => setSafeZone(!safeZone)}
                    hologramUI={settings.hologramUI}
                    onToggleHologramUI={() => setSettings((s) => ({ ...s, hologramUI: !s.hologramUI }))}
                    vfxShake={settings.vfxShake}
                    highlightColor={settings.highlightKeywordColor}
                    pop3dAssets={settings.pop3dAssets}
                    sfxEnabled={settings.sfxEnabled}
                    transition={settings.transition}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* State 3: Empty State / Initial Landing & Dropzone */
          <div className="space-y-12">
            <UploadDropzone
              currentVideo={null}
              onSelectVideo={(v) => {
                setCurrentVideo(v);
                showToast(`Đã nạp video "${v.name}". Hãy chọn Preset phong cách mong muốn!`);
              }}
              onClearVideo={() => setCurrentVideo(null)}
            />

            {/* Presets Showcase Section */}
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-6">
                <h3 className="text-lg font-extrabold text-white">
                  Khám Phá Các Phong Cách Preset Short Thịnh Hành (Tích Hợp VFX & SFX)
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Chữ hiện từng từ, từ khóa phóng to đổi màu, Hologram UI và Sticker 3D nảy theo giọng nói
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRESETS.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setCurrentVideo({
                        id: "sample-1",
                        name: "Video mẫu — " + p.name,
                        url: "/samples/sample1.mp4",
                        size: 2512258,
                        duration: 32,
                        isSample: true,
                      });
                      handleSelectPreset(p);
                    }}
                    className="group rounded-2xl border border-zinc-800 bg-card p-5 cursor-pointer transition-all hover:border-brand/60 hover:bg-panel hover:shadow-xl hover:shadow-brand/5"
                  >
                    <span
                      className="rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider inline-block mb-3"
                      style={{ backgroundColor: `${p.accentColor}25`, color: p.accentColor }}
                    >
                      {p.badge}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-brand transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2">
                      {p.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-brand">
                      <span>Thử ngay preset này</span>
                      <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Project History Section */}
        <section id="project-history-section" className="mt-16 pt-10 border-t border-zinc-800/80">
          <ProjectHistory onOpenProject={handleOpenHistoryProject} />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-800/80 bg-black/60 py-8 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-zinc-300">
              Master<span className="gold-text">Clip</span> AI Studio
            </span>
            <span>• Bản quyền © 2026</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Đầy đủ Transitions, Kinetic Subtitles, VFX & SFX
            </span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer" onClick={() => setShowPricingModal(true)}>
              Bảng giá VIP
            </span>
          </div>
        </div>
      </footer>

      {/* AI Processing Modal Stepper */}
      {currentVideo && (
        <ProcessingModal
          isOpen={isProcessing}
          video={currentVideo}
          preset={selectedPreset}
          onComplete={handleCompleteRender}
          onCancel={() => setIsProcessing(false)}
        />
      )}

      {/* VIP Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-800 bg-card p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setShowPricingModal(false)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X className="size-5" />
            </button>

            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 border border-brand/30 px-3 py-1 text-xs font-bold text-brand mb-2">
                <Crown className="size-3.5 fill-brand" /> Gói Đăng Ký Creator Chuyên Nghiệp
              </span>
              <h3 className="text-2xl font-extrabold text-white">Nâng Cấp MasterClip Pro VIP</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Tự động hóa toàn bộ kênh TikTok & Reels không giới hạn số lượng video
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-panel/60 p-5">
                <h4 className="font-bold text-white text-sm">Gói Miễn Phí (Free Test)</h4>
                <div className="text-2xl font-black text-white my-2">0đ <span className="text-xs text-zinc-500 font-normal">/ mãi mãi</span></div>
                <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-brand" /> Cắt tối đa 5 video/tháng</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-brand" /> Xuất độ phân giải 1080p</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-brand" /> Đầy đủ 5 Preset viral</li>
                </ul>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="w-full rounded-xl border border-zinc-700 bg-panel py-2 text-xs font-bold text-zinc-200 hover:border-zinc-500"
                >
                  Đang sử dụng
                </button>
              </div>

              <div className="relative rounded-2xl border-2 border-brand bg-panel p-5 shadow-xl shadow-brand/10">
                <div className="absolute -top-3 right-4 rounded-full bg-brand px-2.5 py-0.5 text-[9px] font-black uppercase text-black">
                  Khuyên dùng
                </div>
                <h4 className="font-bold text-brand text-sm flex items-center gap-1.5">
                  <Crown className="size-4 fill-brand" /> Gói VIP Unlimited
                </h4>
                <div className="text-2xl font-black text-white my-2">199.000đ <span className="text-xs text-zinc-500 font-normal">/ tháng</span></div>
                <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-brand" /> Xuất video KHÔNG GIỚI HẠN</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-brand" /> Đầy đủ VFX, SFX & Hologram</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-brand" /> Độ phân giải 4K 60FPS sắc nét</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-brand" /> Ưu tiên xử lý AI tốc độ cao gấp 3x</li>
                </ul>
                <button
                  onClick={() => {
                    alert("Cảm ơn anh/chị! Tính năng thanh toán đã sẵn sàng.");
                    setShowPricingModal(false);
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-brand to-gold-400 py-2.5 text-xs font-bold text-black hover:brightness-110"
                >
                  Nâng Cấp Ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastNotice && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-brand/50 bg-card px-4 py-3 text-xs font-semibold text-zinc-100 shadow-2xl backdrop-blur-md">
          <div className="size-2 rounded-full bg-brand animate-ping" />
          <span>{toastNotice}</span>
        </div>
      )}
    </div>
  );
}
export default App;
