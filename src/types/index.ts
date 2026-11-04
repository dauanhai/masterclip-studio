export type AspectRatio = "9:16" | "16:9" | "1:1" | "4:5";

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
  subtitleStyle: "neon" | "karaoke" | "box" | "minimal";
  bgmMood: "trending" | "chill" | "upbeat" | "dramatic" | "none";
  sampleHook: string;
  tags: string[];
}

export interface VideoSource {
  id: string;
  name: string;
  url: string;
  size: number;
  duration: number;
  isSample?: boolean;
}

export interface AdvancedSettingsConfig {
  aspectRatio: AspectRatio;
  safeZone: boolean;
  skinGlow: boolean;
  silenceThreshold: number; // in seconds
  speed: number;
  subtitlesEnabled: boolean;
  subtitleStyle: "neon" | "karaoke" | "box" | "minimal";
  musicMood: "trending" | "chill" | "upbeat" | "dramatic" | "none";
  musicVolume: number; // 0 - 100
  duckingLevel: number; // % volume reduction when speech detected
  hookOpening: boolean;
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
