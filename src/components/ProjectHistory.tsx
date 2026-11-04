import React, { useState } from "react";
import { 
  FolderGit2, 
  Star, 
  Play, 
  Clock, 
  Sparkles, 
  Trash2, 
  ArrowUpRight,
  Search,
  Filter
} from "lucide-react";
import { ProjectHistoryItem } from "../types";

interface ProjectHistoryProps {
  onOpenProject: (item: ProjectHistoryItem) => void;
}

const INITIAL_PROJECTS: ProjectHistoryItem[] = [
  {
    id: "proj-1",
    title: "Bài giảng: 3 Tư duy tài chính người giàu không bao giờ nói",
    date: "Hôm nay, 14:20",
    duration: "02:44",
    presetName: "Hero Neon Cyberpunk",
    thumbnailUrl: "/samples/sample1.mp4",
    viralScore: 97,
    isFavorite: true,
  },
  {
    id: "proj-2",
    title: "Chăm sóc da căng bóng chuẩn Hàn Quốc tại nhà",
    date: "Hôm qua, 09:15",
    duration: "01:38",
    presetName: "Korean Glow & Clean Face",
    thumbnailUrl: "/samples/sample2.mp4",
    viralScore: 95,
    isFavorite: true,
  },
  {
    id: "proj-3",
    title: "Review bộ mic thu âm không dây giá rẻ cho Creator",
    date: "28/10/2026",
    duration: "03:12",
    presetName: "High-Converting E-commerce",
    thumbnailUrl: "/samples/sample3.mp4",
    viralScore: 92,
    isFavorite: false,
  },
  {
    id: "proj-4",
    title: "Kể chuyện: Chuyến du lịch một mình và bài học cuộc đời",
    date: "25/10/2026",
    duration: "04:05",
    presetName: "Luxury & Cinematic Storytelling",
    thumbnailUrl: "/samples/sample2.mp4",
    viralScore: 89,
    isFavorite: false,
  },
];

export const ProjectHistory: React.FC<ProjectHistoryProps> = ({ onOpenProject }) => {
  const [projects, setProjects] = useState<ProjectHistoryItem[]>(INITIAL_PROJECTS);
  const [filter, setFilter] = useState<"all" | "favorite" | "recent">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.presetName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;
    if (filter === "favorite") return p.isFavorite;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <FolderGit2 className="size-4 text-brand" /> Dự Án Gần Đây Đã Xuất
          </h3>
          <p className="text-[11px] text-zinc-400">
            Xem lại các video đã xử lý, tải lại file hoặc tiếp tục chỉnh sửa
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-zinc-800 bg-panel p-0.5 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                filter === "all" ? "bg-brand text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              Tất cả ({projects.length})
            </button>
            <button
              onClick={() => setFilter("favorite")}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                filter === "favorite" ? "bg-brand text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              Yêu thích ({projects.filter((p) => p.isFavorite).length})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filtered.map((project) => (
          <div
            key={project.id}
            onClick={() => onOpenProject(project)}
            className="group relative flex flex-col rounded-xl border border-zinc-800 bg-card overflow-hidden cursor-pointer transition-all hover:border-brand/60 hover:shadow-lg"
          >
            {/* Video Thumbnail */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
              <video
                src={project.thumbnailUrl}
                muted
                className="size-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

              {/* Play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex size-9 items-center justify-center rounded-full bg-brand text-black shadow-lg">
                  <Play className="size-4 fill-black ml-0.5" />
                </div>
              </div>

              {/* Top Star Favorite */}
              <button
                onClick={(e) => toggleFavorite(project.id, e)}
                className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/60 text-zinc-400 hover:text-brand"
              >
                <Star
                  className={`size-3.5 ${
                    project.isFavorite ? "fill-brand text-brand" : ""
                  }`}
                />
              </button>

              {/* Bottom Badges */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[9px] font-semibold text-zinc-300">
                <span className="rounded bg-black/70 px-1.5 py-0.5 font-mono">{project.duration}</span>
                <span className="rounded bg-brand/20 text-brand px-1.5 py-0.5 font-bold">
                  Score {project.viralScore}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <h4 className="truncate text-xs font-bold text-zinc-200 group-hover:text-brand">
                {project.title}
              </h4>
              <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                <span>{project.presetName.split(" ")[0]}</span>
                <span>{project.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
