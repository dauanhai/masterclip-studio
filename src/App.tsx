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
  TranscriptionModal
} from "./components/TranscriptionModal";
import {
  OutputResults
} from "./components/OutputResults";
import {
  ProjectHistory
} from "./components/ProjectHistory";
import {
  TemplateCloneRemaker
} from "./components/TemplateCloneRemaker";
import {
  MasterStudioWorkspace
} from "./components/MasterStudioWorkspace";
import {
  PRESETS
} from "./data/presets";
import {
  DEFAULT_BROLL_ITEMS,
  CHANH_FULL_TRANSCRIPT,
  CHANH_LUONG_LAM_THEM_TRANSCRIPT,
  CHANH_HOSO_TRANSCRIPT,
} from "./data/brollAndTranscript";
import {
  AspectRatio,
  AdvancedSettingsConfig,
  Preset,
  VideoSource,
  ProjectHistoryItem,
  TranscriptSegment,
  BrollItem,
  StudioMode
} from "./types";
import { parseCustomScript, analyzeRawVideo } from "./lib/videoAnalysis";
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
  const [studioMode, setStudioMode] = useState<StudioMode>("superpower");
  const [editorLayout, setEditorLayout] = useState<"master-studio" | "granular-timeline">("master-studio");
  const [currentVideo, setCurrentVideo] = useState<VideoSource | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [segments, setSegments] = useState<TranscriptSegment[]>(CHANH_FULL_TRANSCRIPT);
  const [brollList, setBrollList] = useState<BrollItem[]>(DEFAULT_BROLL_ITEMS);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"transcript" | "presets" | "settings">("transcript");

  // Dynamic video metadata
  const [videoTitle, setVideoTitle] = useState<string>("GIẢI OAN HỆ VỪA HỌC VỪA LÀM TẠI ĐÀI LOAN");
  const [speakerBadge, setSpeakerBadge] = useState<string>("CÔ HẠNH CHIA SẺ");

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [safeZone, setSafeZone] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasRenderedOutput, setHasRenderedOutput] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // AI Speech-to-Text Transcription Modal State
  const [showTranscriptionModal, setShowTranscriptionModal] = useState<boolean>(false);
  const [pendingVideo, setPendingVideo] = useState<VideoSource | null>(null);
  const [pendingAnalysis, setPendingAnalysis] = useState<{
    title: string;
    badge: string;
    segments: TranscriptSegment[];
  } | null>(null);

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

  const handleSelectVideo = (v: VideoSource) => {
    const analysis = analyzeRawVideo(v.name, v.duration);
    const title = v.videoTitle || analysis.title;
    const badge = v.speakerBadge || analysis.badge;
    const segs = v.transcript && v.transcript.length > 0 ? v.transcript : analysis.segments;

    setPendingVideo(v);
    setPendingAnalysis({
      title,
      badge,
      segments: segs,
    });
    setShowTranscriptionModal(true);
  };

  const handleConfirmTranscription = (data: {
    videoTitle: string;
    speakerBadge: string;
    segments: TranscriptSegment[];
  }) => {
    if (pendingVideo) {
      const updated: VideoSource = {
        ...pendingVideo,
        videoTitle: data.videoTitle,
        speakerBadge: data.speakerBadge,
        transcript: data.segments,
      };
      setCurrentVideo(updated);
      setVideoTitle(data.videoTitle);
      setSpeakerBadge(data.speakerBadge);
      setSegments(data.segments);
      setHasRenderedOutput(false);
      setShowTranscriptionModal(false);
      showToast(`Đã xác nhận ${data.segments.length} câu thoại gốc! Toàn bộ video sẽ edit theo lời thoại này.`);
    }
  };

  const handleAutoPilotSuperpower = (sampleVideo?: VideoSource) => {
    const targetVideo = sampleVideo || currentVideo || {
      id: "sample-chi-hanh-superpower",
      name: "⚡ SIÊU PHẨM HOÀN CHỈNH: Cô Hạnh — Giải Oan Vừa Học Vừa Làm (Agent Tổng Tự Duyệt)",
      url: "/samples/sample-chi-hanh-superpower.mp4",
      size: 18707146,
      duration: 45,
      isSample: true,
      isChanhSample: true,
      videoTitle: "GIẢI OAN HỆ VỪA HỌC VỪA LÀM TẠI ĐÀI LOAN",
      speakerBadge: "CÔ HẠNH NGUYÊN",
      hookOpening: "HỆ VỪA HỌC VỪA LÀM Ở ĐÀI LOAN CHỈ CẤP BẰNG NGHỀ THÔI Ạ?",
      transcript: CHANH_FULL_TRANSCRIPT,
    };

    setCurrentVideo(targetVideo);
    setVideoTitle(targetVideo.videoTitle || "GIẢI OAN HỆ VỪA HỌC VỪA LÀM TẠI ĐÀI LOAN");
    setSpeakerBadge(targetVideo.speakerBadge || "CÔ HẠNH NGUYÊN");
    setSegments(targetVideo.transcript || CHANH_FULL_TRANSCRIPT);
    setSelectedPreset(PRESETS[0]); // Chuyên gia Cô Hạnh

    setSettings((prev) => ({
      ...prev,
      skinGlow: true,
      speed: 1.13,
      subtitlesEnabled: true,
      subtitleStyle: "chanh",
      highlightKeywordColor: "rose",
      showHeadlinePlate: true,
      showInfoCards: true,
      enableDynamicZoomLadder: true,
      enableBrollCutaways: true,
      duckingLevel: 85,
    }));

    setIsProcessing(true);
  };

  const handleReTranscribe = () => {
    if (!currentVideo) return;
    setPendingVideo(currentVideo);
    setPendingAnalysis({
      title: videoTitle,
      badge: speakerBadge,
      segments,
    });
    setShowTranscriptionModal(true);
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
    }));

    showToast(`Đã áp dụng mẫu phong cách: "${preset.name}"`);
  };

  const handleUpdateSegment = (updated: TranscriptSegment) => {
    setSegments((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleApplyCustomScript = (scriptText: string) => {
    const dur = currentVideo?.duration || 30;
    const newSegs = parseCustomScript(scriptText, dur);

    // Auto-enrich segments with matching B-Rolls based on text keywords
    const enriched = newSegs.map((s, idx) => {
      const text = s.text.toLowerCase();
      if (text.includes("ai") || text.includes("phần mềm") || text.includes("công nghệ") || text.includes("máy tính") || text.includes("tool")) {
        return { ...s, brollId: "broll-tech", brollMode: "cutaway" as const, infoCardText: "CÔNG NGHỆ ĐỘT PHÁ" };
      }
      if (text.includes("tiền") || text.includes("tài chính") || text.includes("doanh thu") || text.includes("đầu tư") || text.includes("giàu")) {
        return { ...s, brollId: "broll-business", brollMode: "cutaway" as const, infoCardText: "TĂNG TRƯỞNG TÀI CHÍNH" };
      }
      if (text.includes("bằng") || text.includes("đại học") || text.includes("du học") || text.includes("nghề") || text.includes("học")) {
        return { ...s, brollId: "broll-degree", brollMode: "cutaway" as const, infoCardText: "BẰNG CHÍNH QUY" };
      }
      if (text.includes("sản phẩm") || text.includes("review") || text.includes("mua") || text.includes("món") || text.includes("giá")) {
        return { ...s, brollId: "broll-product", brollMode: "cutaway" as const, infoCardText: "CHẤT LƯỢNG CAO CẤP" };
      }
      if (idx % 2 === 1) {
        return { ...s, brollId: "broll-office", brollMode: "pip" as const };
      }
      return s;
    });

    setSegments(enriched);
    showToast(`Đã áp dụng ${newSegs.length} câu thoại từ kịch bản của bạn!`);
  };

  const handleAutoAssignBroll = () => {
    // Smart B-roll allocation based on keywords across all niches
    setSegments((prev) =>
      prev.map((s, idx) => {
        const text = s.text.toLowerCase();
        if (text.includes("ai") || text.includes("phần mềm") || text.includes("công nghệ") || text.includes("máy tính")) {
          return { ...s, brollId: "broll-tech", brollMode: "cutaway" as const, infoCardText: "KÍCH HOẠT CÔNG NGHỆ" };
        } else if (text.includes("tiền") || text.includes("tài chính") || text.includes("doanh thu") || text.includes("đầu tư") || text.includes("giàu")) {
          return { ...s, brollId: "broll-business", brollMode: "cutaway" as const, infoCardText: "DÒNG TIỀN TỰ ĐỘNG" };
        } else if (text.includes("sản phẩm") || text.includes("review") || text.includes("mua") || text.includes("món") || text.includes("giá")) {
          return { ...s, brollId: "broll-product", brollMode: "cutaway" as const, infoCardText: "SẢN PHẨM CHÍNH HÃNG" };
        } else if (text.includes("bằng nghề") || text.includes("oan") || text.includes("đại học chính quy") || text.includes("bằng")) {
          return { ...s, brollId: "broll-degree", brollMode: "cutaway" as const, infoCardText: "BẰNG ĐẠI HỌC CHÍNH QUY" };
        } else if (text.includes("4 năm") || text.includes("chương trình") || text.includes("trường")) {
          return { ...s, brollId: "broll-campus", brollMode: "pip" as const };
        } else if (text.includes("quốc gia") || text.includes("giá trị")) {
          return { ...s, brollId: "broll-global", brollMode: "cutaway" as const, infoCardText: "GIÁ TRỊ QUỐC TẾ" };
        } else if (idx % 2 === 1) {
          return { ...s, brollId: "broll-lifestyle", brollMode: "pip" as const };
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
    showToast("Hoàn tất! Bản dựng Master Chuyên Nghiệp đã sẵn sàng xuất bản.");
  };

  const handleOpenHistoryProject = (proj: ProjectHistoryItem) => {
    const analysis = analyzeRawVideo(proj.title, 31);
    setCurrentVideo({
      id: proj.id,
      name: proj.title,
      url: proj.thumbnailUrl,
      size: 10718522,
      duration: 31,
      isSample: true,
      videoTitle: analysis.title,
      speakerBadge: analysis.badge,
      hookOpening: analysis.hookOpening,
      transcript: analysis.segments,
    });
    setVideoTitle(analysis.title);
    setSpeakerBadge(analysis.badge);
    setSegments(analysis.segments);
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
        studioMode={studioMode}
        onSelectStudioMode={(mode) => setStudioMode(mode)}
      />

      {/* AI Tools Marquee Ribbon */}
      <AiToolsMarquee onSelectTool={(tool) => showToast(`Tính năng AI "${tool}" đã sẵn sàng.`)} />

      {/* Mobile Mode Switcher Bar */}
      <div className="md:hidden mx-auto max-w-7xl px-4 pt-3">
        <div className="flex items-center rounded-xl border border-zinc-800 bg-panel/90 p-1 shadow-inner">
          <button
            onClick={() => setStudioMode("superpower")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${studioMode === "superpower"
                ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/20"
                : "text-zinc-400 hover:text-white"
              }`}
          >
            <Sparkles className="size-3.5" />
            <span>⚡ Agent Tổng Superpower</span>
          </button>

          <button
            onClick={() => setStudioMode("template-clone")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${studioMode === "template-clone"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-md shadow-amber-500/20"
                : "text-zinc-400 hover:text-white"
              }`}
          >
            <Sparkles className="size-3.5" />
            <span>🎬 Clone Từ Link Mẫu + Ảnh</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {studioMode === "template-clone" ? (
          /* View A: Template Clone & Persona Remaker */
          <TemplateCloneRemaker
            onApplyFinishedVideo={(videoUrl, title) => {
              showToast(`Đã xuất bản video theo mẫu: ${title}`);
            }}
          />
        ) : hasRenderedOutput && currentVideo ? (
          /* View 1: Master Professional Output */
          <OutputResults
            sourceVideo={{ ...currentVideo, videoTitle, speakerBadge }}
            preset={selectedPreset}
            segments={segments}
            onReset={() => setHasRenderedOutput(false)}
          />
        ) : (
          <div className="space-y-6">
            {/* Studio Workspace Layout Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditorLayout("master-studio")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                    editorLayout === "master-studio"
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20"
                      : "border border-zinc-800 bg-[#16161b] text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="size-3.5 fill-current" />
                  <span>⚡ Studio 3 Cột Chuẩn (Mẫu Tham Khảo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditorLayout("granular-timeline")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    editorLayout === "granular-timeline"
                      ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                      : "border border-zinc-800 bg-[#16161b] text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sliders className="size-3.5" />
                  <span>🎛️ Timeline Đa Tầng Nâng Cao</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-medium text-zinc-300">
                  Tùy độ dài, ngắn video để tự tạo cảnh trám viral
                </span>
              </div>
            </div>

            {/* Workspace Content */}
            {editorLayout === "master-studio" ? (
              <MasterStudioWorkspace
                currentVideo={currentVideo}
                onSelectVideo={handleSelectVideo}
                onStartRender={handleStartRender}
                onAutoPilotSuperpower={handleAutoPilotSuperpower}
              />
            ) : (
              currentVideo ? (
          /* View 2: Video Loaded - Professional Editor Workspace */
          <div className="space-y-6">
            <UploadDropzone
              currentVideo={currentVideo}
              onSelectVideo={handleSelectVideo}
              onClearVideo={() => setCurrentVideo(null)}
              onReTranscribe={handleReTranscribe}
              onAutoPilotSuperpower={handleAutoPilotSuperpower}
            />

            {/* Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (7 cols): Tabs for Transcript / Presets / Studio Controls */}
              <div className="lg:col-span-7 space-y-4">
                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <button
                    onClick={() => setActiveTab("transcript")}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${activeTab === "transcript"
                      ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-panel"
                      }`}
                  >
                    <FileText className="size-3.5" />
                    <span>1. Lời Thoại Gốc & Cảnh Trám ({segments.length} câu)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("presets")}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${activeTab === "presets"
                      ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-panel"
                      }`}
                  >
                    <Sparkles className="size-3.5" />
                    <span>2. Phong Cách & Preset</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${activeTab === "settings"
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
                    videoTitle={videoTitle}
                    speakerBadge={speakerBadge}
                    onChangeTitle={(t) => setVideoTitle(t)}
                    onChangeBadge={(b) => setSpeakerBadge(b)}
                    onApplyCustomScript={handleApplyCustomScript}
                    onUpdateSegment={handleUpdateSegment}
                    onSeek={(time) => setCurrentTime(time)}
                    onAutoAssignBroll={handleAutoAssignBroll}
                    onUploadCustomBroll={handleUploadCustomBroll}
                    onReTranscribe={handleReTranscribe}
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
                    <span>⚡ XUẤT BẢN VIDEO MASTER CHUYÊN NGHIỆP THEO LỜI THOẠI NÀY</span>
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
                    <span className="text-[10px] text-pink-400 font-bold bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20 truncate max-w-[180px]">
                      {speakerBadge}
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
                    headlineTitle={videoTitle}
                    speakerBadge={speakerBadge}
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
              onSelectVideo={handleSelectVideo}
              onClearVideo={() => setCurrentVideo(null)}
              onAutoPilotSuperpower={handleAutoPilotSuperpower}
            />

            {/* Presets Showcase Section */}
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-6">
                <h3 className="text-lg font-extrabold text-white">
                  Mẫu Video Chuyên Gia & Các Phong Cách Biên Tập Thịnh Hành
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Mỗi video đầu vào được tự động bóc tách lời thoại gốc riêng biệt, chèn cảnh trám B-Roll phù hợp và camera punch-in
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRESETS.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (p.id === "chanh-expert") {
                        handleSelectVideo({
                          id: "sample-chanh-expert",
                          name: "Mẫu 1: Cô Hạnh — Giải Oan Hệ Vừa Học Vừa Làm (Bản Dựng Chuẩn 9:16)",
                          url: "/samples/sample-expert-master.mp4",
                          size: 12940288,
                          duration: 26,
                          isSample: true,
                          isChanhSample: true,
                          videoTitle: "GIẢI OAN HỆ VỪA HỌC VỪA LÀM TẠI ĐÀI LOAN",
                          speakerBadge: "CÔ HẠNH NGUYÊN",
                          hookOpening: "HỆ VỪA HỌC VỪA LÀM Ở ĐÀI LOAN CHỈ CẤP BẰNG NGHỀ THÔI Ạ?",
                          transcript: CHANH_FULL_TRANSCRIPT,
                        });
                      } else if (p.id === "hero-neon" || p.id === "podcast-authority") {
                        handleSelectVideo({
                          id: "sample-hoso",
                          name: "Mẫu 2: Cô Hạnh Nguyên — Hồ Sơ Báo Danh Du Học Đài Loan Cần Có Là Gì?",
                          url: "/samples/sample-reel-authority.mp4",
                          size: 10957808,
                          duration: 23,
                          isSample: true,
                          isChanhSample: true,
                          videoTitle: "HỒ SƠ BÁO DANH DU HỌC ĐÀI LOAN CẦN CÓ LÀ GÌ?",
                          speakerBadge: "CÔ HẠNH NGUYÊN",
                          hookOpening: "HỒ SƠ BÁO DANH DU HỌC ĐÀI LOAN CẦN CHUẨN BỊ NHỮNG GÌ?",
                          transcript: analyzeRawVideo("ho-so-bao-danh-du-hoc-dai-loan.mp4", 23).segments,
                        });
                      } else if (p.id === "ecommerce-review") {
                        handleSelectVideo({
                          id: "sample-viral-pro",
                          name: "Mẫu 3: Video Hoàn Chỉnh Viral — Phụ Đề Nổi Bật & Cảnh Trám Điện Ảnh",
                          url: "/samples/sample-viral-complete.mp4",
                          size: 11192925,
                          duration: 27,
                          isSample: true,
                          videoTitle: "BÍ QUYẾT XÂY KÊNH CHUYÊN GIA TRIỆU VIEW",
                          speakerBadge: "MASTER CREATOR",
                          hookOpening: "TẠI SAO NHIỀU NGƯỜI LÀM VIDEO MÃI KHÔNG LÊN XU HƯỚNG?",
                          transcript: analyzeRawVideo("xay-kenh-chuyen-gia.mp4", 27).segments,
                        });
                      } else {
                        const analysis = analyzeRawVideo("tai-chinh.mp4", 32);
                        handleSelectVideo({
                          id: "sample-finance",
                          name: "Mẫu 4: Tài Chính & Doanh Nghiệp — 3 Tư Duy Bật Tăng Thu Nhập",
                          url: "/samples/sample1.mp4",
                          size: 2512258,
                          duration: 32,
                          isSample: true,
                          videoTitle: analysis.title,
                          speakerBadge: analysis.badge,
                          hookOpening: analysis.hookOpening,
                          transcript: analysis.segments,
                        });
                      }
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
              )
            )}
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
              Master<span className="gold-text">Clip</span> AI Studio — Nền Tảng Biên Tập Video Chuyên Gia Đa Chủ Đề
            </span>
            <span>• Bản quyền © 2026</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span className="inline-flex items-center gap-1.5 text-pink-400 font-semibold">
              <span className="size-2 rounded-full bg-pink-500 animate-pulse"></span>
              Phân tích lời thoại độc bản + Cảnh trám B-Roll thông minh
            </span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer" onClick={() => setShowPricingModal(true)}>
              Bảng giá VIP
            </span>
          </div>
        </div>
      </footer>

      {/* AI Speech-to-Text Transcription Modal (Bước 1: Trích xuất lời thoại gốc) */}
      {pendingVideo && pendingAnalysis && (
        <TranscriptionModal
          isOpen={showTranscriptionModal}
          video={pendingVideo}
          initialTitle={pendingAnalysis.title}
          initialBadge={pendingAnalysis.badge}
          initialSegments={pendingAnalysis.segments}
          onConfirm={handleConfirmTranscription}
          onCancel={() => setShowTranscriptionModal(false)}
        />
      )}

      {/* AI Processing Modal Stepper */}
      {currentVideo && (
        <ProcessingModal
          isOpen={isProcessing}
          video={{ ...currentVideo, videoTitle, speakerBadge }}
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
