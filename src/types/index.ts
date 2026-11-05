export type AspectRatio = "9:16" | "16:9" | "1:1" | "4:5";

export type TransitionType =
  | "zoom-punch"
  | "flash-cut"
  | "glitch"
  | "whip-pan"
  | "film-dissolve";

export type VfxType =
  | "shake"
  | "flash"
  | "korean-glow"
  | "film-grain"
  | "rgb-split";

export interface Asset3DTrigger {
  id: string;
  triggerWord: string;
  emoji: string;
  label: string;
  color: string;
  sfx: "pop" | "cash" | "ding" | "bassdrop" | "whoosh";
}

export interface BrollItem {
  id: string;
  title: string;
  category: "education" | "business" | "lifestyle" | "technology" | "custom";
  url: string;
  thumbnail?: string;
  duration: number;
  isCustom?: boolean;
}

export interface TranscriptSegment {
  id: string;
  sourceStart: number;
  sourceEnd: number;
  text: string;
  highlight: string;
  zoomScale: number; // 1.0, 1.08, 1.14
  infoCardText?: string;
  brollId?: string; // matched B-roll
  brollMode: "cutaway" | "pip" | "none";
  active: boolean;
}

export interface Preset {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  iconName: string;
  accentColor: string;
  skinGlowEnabled: boolean;
  speed: number;
  autoSilenceCut: boolean;
  subtitleStyle: "chanh" | "neon" | "karaoke" | "box" | "minimal";
  bgmMood: "trending" | "chill" | "upbeat" | "dramatic" | "none";
  sampleHook: string;
  tags: string[];
  recommendedTransition: TransitionType;
  recommendedVfx: VfxType[];
  hologramDefault: boolean;
  highlightKeywordColor: "yellow" | "red" | "green" | "magenta" | "rose";
  keyWords: string[];
  activeAssets3D: Asset3DTrigger[];
  // Chuyên gia C Hạnh features
  headlineText?: string;
  expertBadge?: string;
  defaultSegments?: TranscriptSegment[];
}

export interface VideoSource {
  id: string;
  name: string;
  url: string;
  size: number;
  duration: number;
  isSample?: boolean;
  isChanhSample?: boolean;
  transcript?: TranscriptSegment[];
  videoTitle?: string;
  speakerBadge?: string;
  hookOpening?: string;
}

export interface AdvancedSettingsConfig {
  aspectRatio: AspectRatio;
  safeZone: boolean;
  hologramUI: boolean;
  transition: TransitionType;
  vfxShake: boolean;
  vfxFlash: boolean;
  skinGlow: boolean;
  vfxRgbGlitch: boolean;
  vfxFilmGrain: boolean;
  silenceThreshold: number; // in seconds
  speed: number;
  subtitlesEnabled: boolean;
  subtitleStyle: "chanh" | "neon" | "karaoke" | "box" | "minimal";
  highlightKeywordColor: "yellow" | "red" | "green" | "magenta" | "rose";
  zoomKeywords: boolean;
  pop3dAssets: boolean;
  sfxEnabled: boolean;
  musicMood: "trending" | "chill" | "upbeat" | "dramatic" | "none";
  musicVolume: number; // 0 - 100
  duckingLevel: number; // % volume reduction when speech detected
  hookOpening: boolean;
  // C Hạnh specific
  headlineText: string;
  showHeadlinePlate: boolean;
  showInfoCards: boolean;
  enableDynamicZoomLadder: boolean;
  enableBrollCutaways: boolean;
}

export interface ShortClip {
  id: string;
  title: string;
  duration: number;
  startTime: number;
  endTime: number;
  viralScore: number;
  hookText: string;
  summary: string;
  videoUrl: string;
  aspectRatio: AspectRatio;
  tags: string[];
  appliedEffects: string[];
  isMasterCut?: boolean;
}

export interface ProjectHistoryItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  presetName: string;
  thumbnailUrl: string;
  viralScore: number;
  isFavorite: boolean;
}
