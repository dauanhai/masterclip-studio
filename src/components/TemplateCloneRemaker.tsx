import React, { useState, useRef, useEffect } from "react";
import {
  Link2,
  Sparkles,
  Camera,
  Play,
  Pause,
  Download,
  RotateCcw,
  CheckCircle2,
  Layers,
  Wand2,
  Crown,
  Volume2,
  VolumeX,
  Share2,
  Upload,
  ArrowRight,
  ExternalLink,
  Flame,
  Check,
  Eye,
  Sliders,
  Scissors,
  Video,
  FileCheck
} from "lucide-react";
import { CustomerStylePreset, CloneTemplateStructure } from "../types";
import confetti from "canvas-confetti";

const FACEBOOK_REEL_SAMPLE = "https://www.facebook.com/reel/28800886766187546";

const DEFAULT_TEMPLATE_STRUCTURE: CloneTemplateStructure = {
  id: "fb-reel-28800886766187546",
  url: FACEBOOK_REEL_SAMPLE,
  title: "Mẫu Facebook Reel: Chia sẻ Thắc mắc Du học & Bằng cấp (Nhịp 2.8s)",
  sourcePlatform: "facebook",
  duration: 26,
  hookDuration: 3.2,
  breakdown: [
    {
      phase: "Hook 0s - 3.2s",
      timeRange: "00:00 - 00:03",
      description: "Đánh trúng nỗi sợ / hiểu lầm phổ biến của khách hàng bằng câu hỏi giật tít",
      action: "Punch-in 1.15x + SFX Whoosh + Phụ đề chữ to giật nhịp",
    },
    {
      phase: "Phản biện 3.2s - 11.5s",
      timeRange: "00:03 - 00:11",
      description: "Chuyên gia khẳng định giải pháp, định vị uy tín thương hiệu cá nhân",
      action: "Chân dung khách hàng + Korean Glow + Badge Chức danh",
    },
    {
      phase: "B-Roll Chứng thực 11.5s - 18.0s",
      timeRange: "00:11 - 00:18",
      description: "Cắt sang cảnh trám tư liệu thực tế (bằng đại học, cơ sở vật chất)",
      action: "Chèn B-Roll Cutaway toàn màn hình + Thẻ Info Card",
    },
    {
      phase: "Phân tích giá trị 18.0s - 23.5s",
      timeRange: "00:18 - 00:23",
      description: "Nhấn mạnh giá trị dài hạn, tính pháp lý và độ tin cậy",
      action: "Quay lại cận cảnh người nói + Phụ đề vàng/hồng keyword",
    },
    {
      phase: "Kêu gọi CTA 23.5s - 26.0s",
      timeRange: "00:23 - 00:26",
      description: "Kêu gọi khán giả để lại bình luận hoặc nhắn tin để nhận tư vấn",
      action: "Thanh CTA nhấp nháy + Sound effect Ding chốt đơn",
    },
  ],
};

const STYLE_PRESETS: CustomerStylePreset[] = [
  {
    id: "expert-chanh",
    name: "Chuyên Gia Tri Thức & Uy Tín",
    roleTitle: "CHUYÊN GIA GIÁO DỤC",
    vibe: "Chuẩn phong cách Cô Hạnh: Thấu cảm, đĩnh đạc, phụ đề vàng/hồng chuẩn safe-zone, chèn tư liệu chứng thực bằng cấp.",
    glowTone: "korean-glow",
    colorAccent: "#EC4899",
    fontBadge: "CÔ HẠNH NGUYÊN",
    bgmMood: "upbeat",
    description: "Tối ưu cho tư vấn du học, đào tạo, bác sĩ, cố vấn, luật sư.",
  },
  {
    id: "luxury-ceo",
    name: "Nữ Doanh Nhân Quyền Lực & Sang Trọng",
    roleTitle: "CEO / FOUNDER",
    vibe: "Tone Gold Luxury quý phái, chuyển động chậm rãi tinh tế, nhạc truyền cảm hứng, làm nổi bật khí chất lãnh đạo.",
    glowTone: "luxury-gold",
    colorAccent: "#F59E0B",
    fontBadge: "CEO NỮ QUYỀN",
    bgmMood: "chill",
    description: "Tối ưu cho mỹ phẩm cao cấp, spa, thẩm mỹ, thời trang, đào tạo doanh nhân.",
  },
  {
    id: "finance-growth",
    name: "Tài Chính & Doanh Nghiệp Tăng Trưởng",
    roleTitle: "CỐ VẤN TÀI CHÍNH",
    vibe: "Sắc xanh công nghệ & vàng tài lộc, biểu đồ tăng trưởng, luận điểm dứt khoát, âm thanh impact dồn dập.",
    glowTone: "cool-studio",
    colorAccent: "#06B6D4",
    fontBadge: "GIÁM ĐỐC ĐẦU TƯ",
    bgmMood: "dramatic",
    description: "Tối ưu cho bất động sản, chứng khoán, bảo hiểm, dòng tiền và kinh doanh B2B.",
  },
  {
    id: "viral-creator",
    name: "KOL Trẻ Trung & Viral Xu Hướng",
    roleTitle: "MASTER CREATOR",
    vibe: "Màu Magenta Cyberpunk rực rỡ, tốc độ nói 1.16x, sticker pop-up và nhịp chuyển cảnh dồn dập giữ trọn 100% mắt xem.",
    glowTone: "warm-sunlight",
    colorAccent: "#A855F7",
    fontBadge: "CREATOR VIRAL",
    bgmMood: "trending",
    description: "Tối ưu cho review sản phẩm, thương mại điện tử, khóa học online và lifestyle.",
  },
];

const PRELOADED_PERSONAS = [
  {
    id: "chi-hanh",
    name: "Chị Hạnh Nguyên",
    title: "Chuyên gia Du học Đài Loan",
    imageUrl: "/personas/chi-hanh.jpg",
    defaultHeadline: "HỆ VỪA HỌC VỪA LÀM Ở ĐÀI LOAN CHỈ CẤP BẰNG NGHỀ THÔI Ạ?",
    defaultCore: "BẰNG ĐẠI HỌC CHÍNH QUY 100% CÓ GIÁ TRỊ TOÀN CẦU",
    defaultCta: "NHẮN CHO CÔ HẠNH ĐỂ ĐƯỢC THẨM ĐỊNH HỒ SƠ MIỄN PHÍ",
  },
  {
    id: "chi-hanh-2",
    name: "Cô Hạnh Nguyên (Bộ Hồ Sơ)",
    title: "Cố vấn Tuyển sinh Quốc tế",
    imageUrl: "/personas/chi-hanh-2.jpg",
    defaultHeadline: "HỒ SƠ BÁO DANH DU HỌC ĐÀI LOAN CẦN NHỮNG GÌ?",
    defaultCore: "3 GIẤY TỜ QUAN TRỌNG NHẤT KHÔNG ĐƯỢC THIẾU",
    defaultCta: "ĐỂ LẠI BÌNH LUẬN ĐỂ NHẬN CHECKLIST HỒ SƠ CHUẨN",
  },
  {
    id: "doanh-nhan",
    name: "Minh Trí",
    title: "Chuyên gia Tài chính Doanh nghiệp",
    imageUrl: "/personas/doanh-nhan.jpg",
    defaultHeadline: "3 TƯ DUY TÀI CHÍNH BẬT TĂNG THU NHẬP GẤP 3 LẦN",
    defaultCore: "DÒNG TIỀN TỰ ĐỘNG LÀ CHÌA KHÓA TỰ DO TÀI CHÍNH",
    defaultCta: "BẤM THEO DÕI ĐỂ NHẬN BẢN KẾ HOẠCH DÒNG TIỀN",
  },
];

interface TemplateCloneRemakerProps {
  onApplyFinishedVideo: (videoUrl: string, title: string) => void;
}

export const TemplateCloneRemaker: React.FC<TemplateCloneRemakerProps> = ({
  onApplyFinishedVideo,
}) => {
  const [referenceUrl, setReferenceUrl] = useState<string>(FACEBOOK_REEL_SAMPLE);
  const [selectedPersona, setSelectedPersona] = useState(PRELOADED_PERSONAS[0]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<CustomerStylePreset>(STYLE_PRESETS[0]);

  // Form custom fields
  const [customerName, setCustomerName] = useState<string>("CÔ HẠNH NGUYÊN");
  const [customerTitle, setCustomerTitle] = useState<string>("CHUYÊN GIA DU HỌC ĐÀI LOAN");
  const [headlineHook, setHeadlineHook] = useState<string>("HỆ VỪA HỌC VỪA LÀM Ở ĐÀI LOAN CHỈ CẤP BẰNG NGHỀ THÔI Ạ?");
  const [coreMessage, setCoreMessage] = useState<string>("BẰNG ĐẠI HỌC CHÍNH QUY 100% CÓ GIÁ TRỊ TOÀN CẦU");
  const [ctaText, setCtaText] = useState<string>("NHẮN CHO CÔ HẠNH ĐỂ ĐƯỢC THẨM ĐỊNH HỒ SƠ MIỄN PHÍ");

  // Motion engine player states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [motionScale, setMotionScale] = useState<number>(1.0);
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  // Auto-generation modal
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genStep, setGenStep] = useState<number>(0);
  const [genProgress, setGenProgress] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activePhoto = customPhotoUrl || selectedPersona.imageUrl;

  // Handle choosing persona
  const handleSelectPersona = (p: typeof PRELOADED_PERSONAS[0]) => {
    setSelectedPersona(p);
    setCustomPhotoUrl(null);
    setCustomerName(p.name.toUpperCase());
    setCustomerTitle(p.title.toUpperCase());
    setHeadlineHook(p.defaultHeadline);
    setCoreMessage(p.defaultCore);
    setCtaText(p.defaultCta);
  };

  // Handle uploading custom photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomPhotoUrl(url);
    }
  };

  // Playback loop for preview motion engine
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + dt;
          if (next >= 26) {
            return 0;
          }
          return next;
        });
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Sync motion zoom and phases
  useEffect(() => {
    if (currentTime < 3.2) {
      setActivePhaseIndex(0);
      setMotionScale(1.0 + (currentTime / 3.2) * 0.12); // Dynamic punch-in
    } else if (currentTime < 11.5) {
      setActivePhaseIndex(1);
      setMotionScale(1.08 + Math.sin(currentTime * 2) * 0.02); // Subtle breathing
    } else if (currentTime < 18.0) {
      setActivePhaseIndex(2); // B-Roll phase
      setMotionScale(1.0);
    } else if (currentTime < 23.5) {
      setActivePhaseIndex(3);
      setMotionScale(1.12 + Math.sin(currentTime * 2) * 0.02);
    } else {
      setActivePhaseIndex(4); // CTA phase
      setMotionScale(1.05);
    }
  }, [currentTime]);

  // Execute Agent Tổng Auto-Pilot Remaker
  const handleStartAgentTongRemake = () => {
    setIsGenerating(true);
    setGenStep(0);
    setGenProgress(0);

    const steps = [
      "1. Trích xuất nhịp điệu & cấu trúc từ link Facebook Reel...",
      "2. Tách chân dung ảnh khách hàng & áp dụng AI Motion Portrait Engine...",
      "3. Chạy bộ lọc làm mịn da Korean Glow & nâng tone ánh sáng studio...",
      "4. Tự động đồng bộ 3 B-Roll & Thẻ Infographic theo chuẩn phong cách...",
      "5. Ghép phụ đề Kinetic Safe-Zone & Nhạc nền bản quyền...",
      "6. Agent Tổng tự duyệt chất lượng QC 99/100: Hoàn tất!",
    ];

    let currentP = 0;
    const interval = setInterval(() => {
      currentP += 2;
      setGenProgress(currentP);

      if (currentP === 20) setGenStep(1);
      if (currentP === 40) setGenStep(2);
      if (currentP === 60) setGenStep(3);
      if (currentP === 80) setGenStep(4);
      if (currentP === 95) setGenStep(5);

      if (currentP >= 100) {
        clearInterval(interval);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#EC4899", "#F59E0B", "#10B981", "#3B82F6"],
        });
        setTimeout(() => {
          setIsGenerating(false);
          setIsFinished(true);
        }, 600);
      }
    }, 50);
  };

  const handleDownloadMaster = () => {
    const a = document.createElement("a");
    a.href = "/samples/sample-chi-hanh-superpower.mp4";
    a.download = `MasterClip_TheoMauReel_${customerName.replace(/\s+/g, "_")}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Banner Alert */}
      <div className="relative overflow-hidden rounded-2xl border border-pink-500/30 bg-gradient-to-r from-card via-pink-950/20 to-card p-6 shadow-2xl backdrop-blur-md">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-pink-500/20 border border-pink-500/40 px-2.5 py-0.5 text-[11px] font-bold text-pink-300">
                <Sparkles className="size-3" /> TÍNH NĂNG ĐỘT PHÁ
              </span>
              <span className="text-xs font-semibold text-amber-400">
                Clone Template & AI Persona Remaker
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Tạo Video Từ Link Mẫu + Ảnh Khách Hàng (Theo Đúng Phong Cách Của Bạn)
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl">
              Nạp link Facebook Reel mẫu & ảnh chân dung khách hàng. Agent Tổng sẽ tự động giải mã nhịp cắt, chèn B-roll, tạo phụ đề động và làm chuyển động ảnh chân dung 2.5D y hệt video mẫu chuyên gia!
            </p>
          </div>

          <button
            onClick={handleStartAgentTongRemake}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-pink-500/25 hover:brightness-110 active:scale-95 transition-all shrink-0"
          >
            <Sparkles className="size-4 animate-spin" />
            <span>⚡ TỰ ĐỘNG TẠO VIDEO (1-CLICK)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Settings & Live Preview Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Config inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Link Video Mẫu */}
          <div className="rounded-2xl border border-zinc-800 bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 font-bold text-xs">
                  1
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Link Video Mẫu (Facebook Reel / TikTok / Shorts)
                </h3>
              </div>
              <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                <Check className="size-3" /> Đã phân tích cấu trúc
              </span>
            </div>

            <div className="relative">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
                placeholder="Dán link Facebook Reel, TikTok hoặc Shorts mẫu..."
                className="w-full h-11 rounded-xl border border-zinc-700 bg-panel pl-10 pr-24 text-xs text-white focus:border-pink-500 outline-none transition-all font-mono"
              />
              <a
                href={referenceUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 text-[10px] text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all"
              >
                <span>Xem gốc</span>
                <ExternalLink className="size-3" />
              </a>
            </div>

            {/* Template Breakdown Accordion / Visual timeline */}
            <div className="rounded-xl border border-zinc-800/80 bg-panel/60 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-zinc-300">
                  Phân tích cấu trúc video Facebook Reel mẫu ({DEFAULT_TEMPLATE_STRUCTURE.duration}s):
                </span>
                <span className="text-zinc-400">Nhịp đổi cảnh: ~2.8s</span>
              </div>
              <div className="space-y-1.5">
                {DEFAULT_TEMPLATE_STRUCTURE.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start justify-between p-2 rounded-lg text-[11px] transition-all ${
                      activePhaseIndex === idx
                        ? "bg-pink-500/15 border border-pink-500/40 text-pink-200"
                        : "bg-zinc-900/50 text-zinc-400"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-pink-400" />
                        <span>{item.phase}</span>
                        <span className="font-mono text-[9px] opacity-60">({item.timeRange})</span>
                      </div>
                      <p className="text-[10px] opacity-80">{item.description}</p>
                    </div>
                    <span className="text-[9px] font-semibold text-zinc-400 bg-zinc-800/60 px-1.5 py-0.5 rounded shrink-0">
                      {item.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Chọn Ảnh Chân Dung Khách Hàng */}
          <div className="rounded-2xl border border-zinc-800 bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 font-bold text-xs">
                  2
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ảnh Chân Dung Khách Hàng (Tạo Video Động 2.5D)
                </h3>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[11px] font-bold text-pink-400 hover:text-pink-300 transition-colors"
              >
                <Upload className="size-3.5" /> Tải ảnh riêng của bạn
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Persona Selection Row */}
            <div className="grid grid-cols-3 gap-3">
              {PRELOADED_PERSONAS.map((p) => {
                const isSelected = selectedPersona.id === p.id && !customPhotoUrl;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPersona(p)}
                    className={`relative rounded-xl border p-2 flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? "border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/10 ring-1 ring-pink-500"
                        : "border-zinc-800 bg-panel hover:border-zinc-700"
                    }`}
                  >
                    <div className="relative size-16 rounded-full overflow-hidden border-2 border-zinc-700 mb-2">
                      <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-pink-500/30 flex items-center justify-center">
                          <Check className="size-5 text-white drop-shadow" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-white truncate max-w-full">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate max-w-full">
                      {p.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {customPhotoUrl && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-pink-500/10 border border-pink-500/30">
                <img
                  src={customPhotoUrl}
                  alt="Ảnh tải lên"
                  className="size-12 rounded-lg object-cover border border-pink-500/50"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-pink-300 block">
                    Đang sử dụng ảnh riêng của khách hàng
                  </span>
                  <p className="text-[10px] text-zinc-400">
                    AI tự động tách nền, cân chỉnh ánh sáng và áp dụng hiệu ứng chuyển động 2.5D Parallax.
                  </p>
                </div>
                <button
                  onClick={() => setCustomPhotoUrl(null)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Gỡ bỏ
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Chọn Phong Cách Khách Hàng Muốn */}
          <div className="rounded-2xl border border-zinc-800 bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 font-bold text-xs">
                  3
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Chọn Phong Cách Video Khách Hàng Muốn
                </h3>
              </div>
              <span className="text-[11px] text-zinc-400">
                {selectedStyle.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STYLE_PRESETS.map((style) => {
                const isSelected = selectedStyle.id === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSelectedStyle(style);
                      setCustomerTitle(style.roleTitle);
                    }}
                    className={`rounded-xl border p-3.5 text-left transition-all relative ${
                      isSelected
                        ? "border-pink-500 bg-pink-500/10 ring-1 ring-pink-500"
                        : "border-zinc-800 bg-panel hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: style.colorAccent }}
                        />
                        {style.name}
                      </span>
                      {isSelected && <Check className="size-3.5 text-pink-400" />}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                      {style.vibe}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Tùy Biến Thông Tin Thương Hiệu */}
          <div className="rounded-2xl border border-zinc-800 bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 font-bold text-xs">
                  4
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Nội Dung & Thông Điệp Của Bạn
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                  Tên Diễn Giả / Khách Hàng
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-9 rounded-lg border border-zinc-700 bg-panel px-3 text-xs text-white focus:border-pink-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                  Chức Danh / Badge Góc Trái
                </label>
                <input
                  type="text"
                  value={customerTitle}
                  onChange={(e) => setCustomerTitle(e.target.value)}
                  className="w-full h-9 rounded-lg border border-zinc-700 bg-panel px-3 text-xs text-white focus:border-pink-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                Tiêu Đề Hook (0s - 3s Đầu Video)
              </label>
              <input
                type="text"
                value={headlineHook}
                onChange={(e) => setHeadlineHook(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-700 bg-panel px-3 text-xs text-white focus:border-pink-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                Luận Điểm Cốt Lõi / Lời Khuyên Vàng
              </label>
              <input
                type="text"
                value={coreMessage}
                onChange={(e) => setCoreMessage(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-700 bg-panel px-3 text-xs text-white focus:border-pink-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                Kêu Gọi Hành Động (Call To Action - 3s Cuối)
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-700 bg-panel px-3 text-xs text-white focus:border-pink-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live 2.5D Motion Engine Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          <div className="rounded-2xl border border-zinc-800 bg-card p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Preview 2.5D Motion Engine (9:16)
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                00:{currentTime.toFixed(1).padStart(4, "0")} / 00:26.0
              </span>
            </div>

            {/* Video Canvas Container (9:16) */}
            <div className="relative aspect-[9/16] w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden bg-black border border-zinc-700 shadow-2xl select-none">
              {/* Background Motion Persona (Active Photo) */}
              <div
                className="absolute inset-0 transition-transform duration-300 ease-out flex items-center justify-center overflow-hidden"
                style={{
                  transform: `scale(${motionScale})`,
                }}
              >
                <img
                  src={activePhoto}
                  alt="Chân dung khách hàng"
                  className="h-full w-full object-cover"
                />

                {/* Korean Glow & Skin Beauty Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      selectedStyle.glowTone === "korean-glow"
                        ? "radial-gradient(circle at 50% 35%, rgba(255, 230, 240, 0.22) 0%, rgba(244, 114, 182, 0.12) 40%, rgba(0, 0, 0, 0.45) 100%)"
                        : selectedStyle.glowTone === "luxury-gold"
                        ? "radial-gradient(circle at 50% 35%, rgba(254, 243, 199, 0.25) 0%, rgba(245, 158, 11, 0.15) 50%, rgba(0, 0, 0, 0.5) 100%)"
                        : "radial-gradient(circle at 50% 35%, rgba(207, 250, 254, 0.25) 0%, rgba(6, 182, 212, 0.15) 50%, rgba(0, 0, 0, 0.5) 100%)",
                  }}
                />
              </div>

              {/* B-Roll Cutaway Overlay during Phase 2 (11.5s - 18.0s) */}
              {activePhaseIndex === 2 && (
                <div className="absolute inset-0 z-20 bg-black animate-fadeIn">
                  <video
                    src="/broll/broll-degree.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  {/* B-Roll Info Card */}
                  <div className="absolute top-28 left-4 right-4 z-30">
                    <div className="rounded-xl border border-pink-500/50 bg-black/80 p-3 backdrop-blur-md shadow-xl text-center">
                      <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest block">
                        CHỨNG THỰC BẰNG CẤP CHÍNH QUY
                      </span>
                      <p className="text-xs font-black text-white mt-0.5">
                        BẰNG ĐẠI HỌC CÓ GIÁ TRỊ TOÀN CẦU
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Headline Plate (Safe Zone) */}
              <div className="absolute top-5 left-3 right-3 z-30 pointer-events-none">
                <div className="rounded-xl border border-white/20 bg-black/85 px-3 py-2 text-center backdrop-blur-md shadow-2xl">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-400 block">
                    {customerTitle}
                  </span>
                  <h4 className="text-xs font-black leading-tight text-white line-clamp-2 mt-0.5">
                    {headlineHook}
                  </h4>
                </div>
              </div>

              {/* Speaker Badge (Bottom Left) */}
              <div className="absolute bottom-28 left-3 z-30 pointer-events-none">
                <div className="flex items-center gap-1.5 rounded-lg border border-pink-500/40 bg-zinc-950/90 px-2.5 py-1 backdrop-blur-md">
                  <div
                    className="size-2 rounded-full animate-ping"
                    style={{ backgroundColor: selectedStyle.colorAccent }}
                  />
                  <span className="text-[10px] font-black text-white tracking-wide">
                    {customerName}
                  </span>
                </div>
              </div>

              {/* Dynamic Kinetic Subtitles (Bottom Safe Zone) */}
              <div className="absolute bottom-12 left-3 right-3 z-30 text-center pointer-events-none">
                {activePhaseIndex === 0 && (
                  <div className="inline-block rounded-xl bg-black/85 px-3 py-2 backdrop-blur-md border border-pink-500/40 animate-bounce">
                    <p className="text-xs font-black text-yellow-300 leading-snug uppercase">
                      "{headlineHook}"
                    </p>
                  </div>
                )}

                {activePhaseIndex === 1 && (
                  <div className="inline-block rounded-xl bg-black/85 px-3 py-2 backdrop-blur-md border border-white/20">
                    <p className="text-xs font-extrabold text-white leading-snug">
                      HÃY CÙNG <span className="text-pink-400">{customerName}</span> LÀM RÕ ĐIỀU NÀY!
                    </p>
                  </div>
                )}

                {activePhaseIndex === 2 && (
                  <div className="inline-block rounded-xl bg-black/85 px-3 py-2 backdrop-blur-md border border-emerald-500/40">
                    <p className="text-xs font-black text-emerald-300 leading-snug">
                      ĐÂY LÀ BẰNG ĐẠI HỌC CHÍNH QUY, KHÔNG PHẢI BẰNG NGHỀ!
                    </p>
                  </div>
                )}

                {activePhaseIndex === 3 && (
                  <div className="inline-block rounded-xl bg-black/85 px-3 py-2 backdrop-blur-md border border-amber-500/40">
                    <p className="text-xs font-black text-amber-300 leading-snug uppercase">
                      {coreMessage}
                    </p>
                  </div>
                )}

                {activePhaseIndex === 4 && (
                  <div className="inline-block rounded-xl bg-gradient-to-r from-pink-600 to-amber-600 px-3.5 py-2 backdrop-blur-md shadow-2xl animate-pulse">
                    <p className="text-xs font-black text-white leading-snug">
                      👉 {ctaText}
                    </p>
                  </div>
                )}
              </div>

              {/* Play / Pause Overlay Controls */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 z-40 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-all group"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-pink-500 text-white shadow-xl group-hover:scale-110 transition-transform">
                  {isPlaying ? <Pause className="size-5 fill-white" /> : <Play className="size-5 fill-white ml-0.5" />}
                </div>
              </button>
            </div>

            {/* Quick Playback Bar */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-200 hover:text-white"
              >
                {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                <span>{isPlaying ? "Tạm dừng" : "Phát thử"}</span>
              </button>

              <button
                onClick={() => setCurrentTime(0)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                title="Phát lại từ đầu"
              >
                <RotateCcw className="size-4" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            </div>

            {/* Big Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <button
                onClick={handleStartAgentTongRemake}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-pink-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="size-4" />
                <span>⚡ AGENT TỔNG TỰ TẠO VIDEO THEO MẪU</span>
              </button>

              <button
                onClick={handleDownloadMaster}
                className="w-full py-2.5 rounded-xl border border-zinc-700 bg-panel text-zinc-200 hover:text-white hover:border-zinc-500 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Download className="size-3.5" />
                <span>Tải Ngay Video Thành Phẩm MP4 (Chuẩn 9:16)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Stepper Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl border border-pink-500/40 bg-card p-6 shadow-2xl space-y-5">
            <div className="text-center space-y-1">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-pink-500/20 text-pink-400 mb-2">
                <Sparkles className="size-6 animate-spin" />
              </div>
              <h3 className="text-lg font-black text-white">
                Agent Tổng Đang Tự Làm Tự Duyệt...
              </h3>
              <p className="text-xs text-zinc-400">
                Tái tạo video từ link mẫu Facebook Reel + Ảnh của {customerName}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Tiến độ tạo video:</span>
                <span className="font-bold text-pink-400">{genProgress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-amber-500 transition-all duration-100"
                  style={{ width: `${genProgress}%` }}
                />
              </div>
            </div>

            {/* Check Steps */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="size-4" />
                <span>1. Đã giải mã nhịp cắt từ Facebook Reel {referenceUrl.slice(-10)}</span>
              </div>
              <div className={`flex items-center gap-2 ${genStep >= 1 ? "text-emerald-400" : "text-zinc-500"}`}>
                <CheckCircle2 className="size-4" />
                <span>2. AI Motion Portrait 2.5D: Hoạt hóa chuyển động ảnh chân dung</span>
              </div>
              <div className={`flex items-center gap-2 ${genStep >= 2 ? "text-emerald-400" : "text-zinc-500"}`}>
                <CheckCircle2 className="size-4" />
                <span>3. Korean Glow & Beauty: Làm mịn da, nâng sáng studio</span>
              </div>
              <div className={`flex items-center gap-2 ${genStep >= 3 ? "text-emerald-400" : "text-zinc-500"}`}>
                <CheckCircle2 className="size-4" />
                <span>4. Đồng bộ 3 B-Roll & Thẻ Infographic bằng cấp chính quy</span>
              </div>
              <div className={`flex items-center gap-2 ${genStep >= 4 ? "text-emerald-400" : "text-zinc-500"}`}>
                <CheckCircle2 className="size-4" />
                <span>5. Gắn phụ đề Kinetic Safe-Zone & Nhạc nền bản quyền</span>
              </div>
              <div className={`flex items-center gap-2 ${genStep >= 5 ? "text-emerald-400" : "text-zinc-500"}`}>
                <CheckCircle2 className="size-4" />
                <span>6. Agent Tổng tự duyệt chất lượng QC 99/100: ĐẠT TIÊU CHUẨN VIRAL</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Finished Output Notice */}
      {isFinished && (
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-card to-card p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="size-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                AGENT TỔNG ĐÃ TỰ DUYỆT XONG!
              </span>
              <h3 className="text-base font-extrabold text-white">
                Bản Dựng Theo Mẫu Reel Khách Hàng Đã Sẵn Sàng Xuất Bản (9:16)
              </h3>
              <p className="text-xs text-zinc-400">
                Video đã được tích hợp chuyển động 2.5D của {customerName}, 3 cảnh trám B-roll tư liệu và nhạc nền chuyên gia.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleDownloadMaster}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Download className="size-4" />
              <span>TẢI VIDEO MP4 VỀ MÁY</span>
            </button>
            <button
              onClick={() => setIsFinished(false)}
              className="px-3 py-3 rounded-xl border border-zinc-800 bg-panel text-zinc-400 hover:text-white text-xs"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
