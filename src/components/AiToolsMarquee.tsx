import React from "react";
import { 
  Film, 
  Music2, 
  AudioLines, 
  Sparkles, 
  Clapperboard, 
  Download, 
  WandSparkles, 
  Captions, 
  Scissors, 
  ImageIcon, 
  FileAudio, 
  Gauge 
} from "lucide-react";

interface AiToolItem {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  tip: string;
}

const AI_TOOLS: AiToolItem[] = [
  { icon: Film, label: "Tái Bản Video AI", sublabel: "Định dạng 9:16", tip: "Tự động crop và giữ chủ thể ở giữa khung hình dọc" },
  { icon: Music2, label: "Đồng Bộ Nhạc", sublabel: "Thông minh", tip: "Tự bắt beat nhạc khớp với từng câu nói đắt giá" },
  { icon: AudioLines, label: "Khử Ồn & Cân Bằng", sublabel: "Studio Voice", tip: "Tách tạp âm môi trường, tăng độ trầm ấm giọng nói" },
  { icon: Sparkles, label: "AI Chấm Điểm", sublabel: "Viral Score", tip: "Quét kịch bản và dự đoán độ lan tỏa trên TikTok" },
  { icon: Clapperboard, label: "Video Dài →", sublabel: "Nhiều Short", tip: "1 video 30 phút tự trích xuất thành 5-10 clip ngắn" },
  { icon: Download, label: "Nhập Từ", sublabel: "YouTube/Drive", tip: "Chỉ cần dán link là nạp video xử lý ngay" },
  { icon: WandSparkles, label: "Hook Mở Đầu", sublabel: "3 Giây Đầu", tip: "Gợi ý câu mở đầu giữ chân người xem 80%" },
  { icon: Captions, label: "Phụ Đề Động", sublabel: "Karaoke Realtime", tip: "Tự động nhận diện tiếng Việt chính xác 98%" },
  { icon: Scissors, label: "Cắt Khoảng Lặng", sublabel: "Tự Động 0.3s", tip: "Loại bỏ thời gian chết giúp video dồn dập, cuốn hút" },
  { icon: ImageIcon, label: "B-roll & Nhãn Dán", sublabel: "Chèn Tự Động", tip: "Chèn hình ảnh minh họa theo từ khóa trong lời nói" },
  { icon: FileAudio, label: "Audio Ducking", sublabel: "Nhạc Tự Nhỏ", tip: "Khi có tiếng người nói, nhạc nền tự động giảm 85%" },
  { icon: Gauge, label: "Tăng Tốc Giọng", sublabel: "1.1x - 1.25x", tip: "Đẩy nhanh nhịp nói mà không bị méo tiếng" },
];

export const AiToolsMarquee: React.FC<{ onSelectTool?: (tool: string) => void }> = ({ onSelectTool }) => {
  return (
    <div className="relative w-full overflow-hidden py-4 border-y border-zinc-800/80 bg-card/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 mb-2 text-center">
        <span className="text-[10px] font-extrabold tracking-[0.2em] text-zinc-500 uppercase">
          ✦ Công Nghệ AI Tự Động Hóa Dựng Video Đột Phá ✦
        </span>
      </div>

      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-track flex w-max items-center gap-6 py-2">
          {/* Duplicate 2 times for seamless loop */}
          {[...AI_TOOLS, ...AI_TOOLS].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => onSelectTool?.(item.label)}
                title={item.tip}
                className="group flex items-center gap-2.5 rounded-full border border-zinc-800 bg-panel/80 px-3.5 py-1.5 transition-all hover:border-brand/60 hover:bg-brand/10 hover:shadow-lg hover:shadow-brand/10 cursor-pointer"
              >
                <div className="flex size-7 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700/60 text-brand group-hover:bg-brand group-hover:text-black transition-colors">
                  <Icon className="size-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {item.label}
                  </div>
                  {item.sublabel && (
                    <div className="text-[9px] text-zinc-500 group-hover:text-brand/80 transition-colors">
                      {item.sublabel}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
