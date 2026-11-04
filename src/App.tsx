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
  TranscriptTimeline 
} from "./components/TranscriptTimeline";
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
  DEFAULT_BROLL_ITEMS, 
  CHANH_FULL_TRANSCRIPT 
} from "./data/brollAndTranscript";
import { 
  AspectRatio, 
  AdvancedSettingsConfig, 
  Preset, 
  VideoSource, 
  ProjectHistoryItem,
  TranscriptSegment,
  BrollItem 
} from "./types";
import { 
  Sparkles, 
  Crown, 
  Check, 
  X, 
  ArrowRight, 
  Zap, 
  Wand2, 
  FileText, 
  Film, 
  Sliders 
} from "lucide-react";

export function App() {
  const [currentVideo, setCurrentVideo] = useState<VideoSource | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]); // Chuyên gia Cô Hạnh as default
  const [segments, setSegments] = useState<TranscriptSegment[]>(CHANH_FULL_TRANSCRIPT);
  const [brollList, setBrollList] = useState<BrollItem[]>(DEFAULT_BROLL_ITEMS);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"transcript" | "presets" | "settings">("transcript");
  
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [safeZone, setSafeZone] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasRenderedOutput, setHasRenderedOutput] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const [settings, setSettings] = useState<AdvancedSettingsConfig>({
    aspectRatio: "9:16",
    safeZone: true,
    hologramUI: false,
    transition: "zoom-punch",
    vfxShake: false,
    vfxFlash: true,
    skinGlow: false,
    vfxRgbGlitch: false,
    vfxFilmGrain: false,
    silenceThreshold: 0.3,
    speed: 1.0,
    subtitlesEnabled: true,
    subtitleStyle: "chanh",
    highlightKeywordColor: "rose",
    zoomKeywords: true,
    pop3dAssets: true,
    sfxEnabled: true,
    musicMood: "upbeat",
    musicVolume: 25,
    duckingLevel: 85,
    hookOpening: true,
    headlineText: "GIẢI OAN DU HỌC ĐÀI LOAN",
    showHeadlinePlate: true,
    showInfoCards: true,
    enableDynamicZoomLadder: true,
    enableBrollCutaways: true,
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
      headlineText: preset.headlineText || prev.headlineText,
    }));

    if (preset.defaultSegments) {
      setSegments(preset.defaultSegments);
    }

    showToast(`Đã áp dụng mẫu "${preset.name}"`);
  };

  const handleUpdateSegment = (updated: TranscriptSegment) => {
    setSegments((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleAutoAssignBroll = () => {
    // Smart B-roll allocation based on keywords
    setSegments((prev) =>
      prev.map((s) => {
        const text = s.text.toLowerCase();
        if (text.includes("bằng nghề") || text.includes("oan") || text.includes("đại học chính quy")) {
          return { ...s, brollId: "broll-degree", brollMode: "cutaway" as const };
        } else if (text.includes("4 năm") || text.includes("chương trình")) {
          return { ...s, brollId: "broll-campus", brollMode: "pip" as const };
        } else if (text.includes("quốc gia") || text.includes("giá trị")) {
          return { ...s, brollId: "broll-global", brollMode: "cutaway" as const };
        }
        return s;
      })
    );
    showToast("AI đã tự động phân bổ cảnh trám B-Roll phù hợp với từng câu thoại!");
  };

  const handleUploadCustomBroll = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const newBroll: BrollItem = {
      id: `custom-${Date.now()}`,
      title: `📁 ${file.name.substring(0, 25)}`,
      category: "custom",
      url: objectUrl,
      duration: 15,
      isCustom: true,
    };
    setBrollList((prev) => [newBroll, ...prev]);
  };

  const handleStartRender = () => {
    if (!currentVideo) {
      showToast("Vui lòng nạp 1 video trước!");
      return;
    }
    setIsProcessing(true);
  };

  const handleCompleteRender = () => {
    setIsProcessing(false);
    setHasRenderedOutput(true);
    showToast("Hoàn tất! Bản dựng Master Chuyên Gia đã sẵn sàng xuất bản.");
  };

  const handleOpenHistoryProject = (proj: ProjectHistoryItem) => {
    setCurrentVideo({
      id: proj.id,
      name: proj.title,
      url: proj.thumbnailUrl,
      size: 10718522,
      duration: 31,
      isSample: true,
      isChanhSample: true,
      transcript: CHANH_FULL_TRANSCRIPT,
    });
    setSegments(CHANH_FULL_TRANSCRIPT);
    setHasRenderedOutput(false);
    showToast(`Đã mở dự án: ${proj.title}`);
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 selection:bg-pink-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-[500px] w-[1000px] -translate-x-1/2 bg-pink-500/5 blur-[120px] rounded-full" />
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
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {hasRenderedOutput && currentVideo ? (
          /* View 1: Master Professional Output */
          <OutputResults
            sourceVideo={currentVideo}
            preset={selectedPreset}
            segments={segments}
            onReset={() => setHasRenderedOutput(false)}
          />
        ) : currentVideo ? (
          /* View 2: Video Loaded - Professional Editor Workspace */
          <div className="space-y-6">
            <UploadDropzone
              currentVideo={currentVideo}
              onSelectVideo={(v) => {
                setCurrentVideo(v);
                if (v.transcript) {
                  setSegments(v.transcript);
                }
                setHasRenderedOutput(false);
              }}
              onClearVideo={() => setCurrentVideo(null)}
            />

            {/* Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (7 cols): Tabs for Transcript / Presets / Studio Controls */}
              <div className="lg:col-span-7 space-y-4">
                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <button
                    onClick={() => setActiveTab("transcript")}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                      activeTab === "transcript"
                        ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-panel"
                    }`}
                  >
                    <FileText className="size-3.5" />
                    <span>1. Toàn Bộ Lời Thoại & Cảnh Trám B-Roll ({segments.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("presets")}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                      activeTab === "presets"
                        ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-panel"
                    }`}
                  >
                    <Sparkles className="size-3.5" />
                    <span>2. Mẫu Chuyên Gia & Preset</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                      activeTab === "settings"
                        ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-panel"
                    }`}
                  >
                    <Sliders className="size-3.5" />
                    <span>3. Tinh Chỉnh Studio</span>
                  </button>
                </div>

                {/* Tab 1: Full Transcript Timeline & B-roll Cutaway Manager */}
                {activeTab === "transcript" && (
                  <TranscriptTimeline
                    segments={segments}
                    brollList={brollList}
                    currentPlayTime={currentTime}
                    onUpdateSegment={handleUpdateSegment}
                    onSeek={(time) => setCurrentTime(time)}
                    onAutoAssignBroll={handleAutoAssignBroll}
                    onUploadCustomBroll={handleUploadCustomBroll}
                  />
                )}

                {/* Tab 2: Preset Selector */}
                {activeTab === "presets" && (
                  <PresetSelector
                    selectedPresetId={selectedPreset.id}
                    onSelectPreset={handleSelectPreset}
                  />
                )}

                {/* Tab 3: Advanced Settings */}
                {activeTab === "settings" && (
                  <AdvancedSettings
                    settings={settings}
                    onChangeSettings={setSettings}
                    onStartRender={handleStartRender}
                  />
                )}

                {/* Bottom Master Render Button Always Visible */}
                <div className="pt-2">
                  <button
                    onClick={handleStartRender}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-pink-500/25 hover:brightness-110 active:scale-[0.99] transition-all"
                  >
                    <Sparkles className="size-4" />
                    <span>⚡ XUẤT BẢN VIDEO CHUYÊN GIA HOÀN CHỈNH (FULL MASTER EDIT)</span>
                  </button>
                </div>
              </div>

              {/* Right Column (5 cols): Real-Time 9:16 Video Player with Cutaway & Punch Zoom */}
              <div className="lg:col-span-5 sticky top-20">
                <div className="rounded-2xl border border-zinc-800 bg-card/70 p-4 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <Film className="size-3.5 text-pink-400" /> Xem Trước Bản Dựng 9:16
                    </span>
                    <span className="text-[10px] text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                      Mẫu Cô Hạnh Active
                    </span>
                  </div>

                  <VideoPreviewPlayer
                    video={currentVideo}
                    preset={selectedPreset}
                    segments={segments}
                    brollList={brollList}
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
                    currentTime={currentTime}
                    onTimeUpdate={(t) => setCurrentTime(t)}
                    headlineTitle={settings.headlineText}
                    showHeadlinePlate={settings.showHeadlinePlate}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* View 3: Landing / Empty State */
          <div className="space-y-12">
            <UploadDropzone
              currentVideo={null}
              onSelectVideo={(v) => {
                setCurrentVideo(v);
                if (v.transcript) {
                  setSegments(v.transcript);
                }
                showToast(`Đã nạp video "${v.name}". Đã trích xuất toàn bộ lời thoại gốc!`);
              }}
              onClearVideo={() => setCurrentVideo(null)}
            />

            {/* Presets Showcase Section */}
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-6">
                <h3 className="text-lg font-extrabold text-white">
                  Mẫu Video Chuyên Gia & Các Phong Cách Thịnh Hành
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Đầy đủ trích xuất lời thoại gốc, phân bổ cảnh trám B-Roll và camera punch-in
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRESETS.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setCurrentVideo({
                        id: "sample-chanh",
                        name: "Mẫu Chuyên Gia Cô Hạnh — Giải Oan Du Học",
                        url: "/samples/chanh-source.mp4",
                        size: 10718522,
                        duration: 31,
                        isSample: true,
                        isChanhSample: true,
                        transcript: CHANH_FULL_TRANSCRIPT,
                      });
                      handleSelectPreset(p);
                    }}
                    className="group rounded-2xl border border-zinc-800 bg-card p-5 cursor-pointer transition-all hover:border-pink-500/60 hover:bg-panel hover:shadow-xl hover:shadow-pink-500/10"
                  >
                    <span
                      className="rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider inline-block mb-3"
                      style={{ backgroundColor: `${p.accentColor}25`, color: p.accentColor }}
                    >
                      {p.badge}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2">
                      {p.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-pink-400">
                      <span>Dựng theo mẫu này</span>
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
              Master<span className="gold-text">Clip</span> AI Studio — Chuyên Gia Edition
            </span>
            <span>• Bản quyền © 2026</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span className="inline-flex items-center gap-1.5 text-pink-400 font-semibold">
              <span className="size-2 rounded-full bg-pink-500 animate-pulse"></span>
              Toàn bộ lời thoại gốc + Cảnh trám B-Roll + Mẫu Cô Hạnh
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
              <span className="inline-flex items-center gap-1 rounded-full bg-pink-500/10 border border-pink-500/30 px-3 py-1 text-xs font-bold text-pink-400 mb-2">
                <Crown className="size-3.5 fill-pink-500" /> Gói Đăng Ký Chuyên Gia Cao Cấp
              </span>
              <h3 className="text-2xl font-extrabold text-white">Nâng Cấp MasterClip Pro VIP</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Tự động hóa toàn bộ kênh video chuyên gia với thư viện cảnh trám không giới hạn
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-panel/60 p-5">
                <h4 className="font-bold text-white text-sm">Gói Miễn Phí (Free Test)</h4>
                <div className="text-2xl font-black text-white my-2">0đ <span className="text-xs text-zinc-500 font-normal">/ mãi mãi</span></div>
                <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-pink-400" /> Trích xuất toàn bộ lời thoại</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-pink-400" /> Chèn tối đa 5 cảnh trám B-Roll</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-pink-400" /> Xuất video chuẩn 1080p 9:16</li>
                </ul>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="w-full rounded-xl border border-zinc-700 bg-panel py-2 text-xs font-bold text-zinc-200 hover:border-zinc-500"
                >
                  Đang sử dụng
                </button>
              </div>

              <div className="relative rounded-2xl border-2 border-pink-500 bg-panel p-5 shadow-xl shadow-pink-500/10">
                <div className="absolute -top-3 right-4 rounded-full bg-pink-500 px-2.5 py-0.5 text-[9px] font-black uppercase text-white">
                  Khuyên dùng
                </div>
                <h4 className="font-bold text-pink-400 text-sm flex items-center gap-1.5">
                  <Crown className="size-4 fill-pink-400" /> Gói VIP Chuyên Gia
                </h4>
                <div className="text-2xl font-black text-white my-2">199.000đ <span className="text-xs text-zinc-500 font-normal">/ tháng</span></div>
                <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-pink-400" /> Xuất Video Master KHÔNG GIỚI HẠN</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-pink-400" /> Kho 1.000+ Cảnh Trám B-Roll 4K</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-pink-400" /> Xuất file EDL/XML cho CapCut & Premiere</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-pink-400" /> Độ phân giải 4K 60FPS sắc nét</li>
                </ul>
                <button
                  onClick={() => {
                    alert("Cảm ơn anh/chị! Tính năng nâng cấp gói đã sẵn sàng.");
                    setShowPricingModal(false);
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 py-2.5 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-pink-500/25"
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
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-pink-500/50 bg-card px-4 py-3 text-xs font-semibold text-zinc-100 shadow-2xl backdrop-blur-md">
          <div className="size-2 rounded-full bg-pink-500 animate-ping" />
          <span>{toastNotice}</span>
        </div>
      )}
    </div>
  );
}
export default App;
