import React, { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  Play, 
  Layers, 
  Plus, 
  Upload, 
  Check, 
  Scissors, 
  Film, 
  GraduationCap, 
  Edit3, 
  Eye, 
  Video,
  Wand2,
  Trash2,
  ClipboardPaste,
  Type,
  BadgeAlert,
  Mic
} from "lucide-react";
import { TranscriptSegment, BrollItem } from "../types";
import { formatTime } from "../lib/utils";

interface TranscriptTimelineProps {
  segments: TranscriptSegment[];
  brollList: BrollItem[];
  currentPlayTime: number;
  videoTitle: string;
  speakerBadge: string;
  onChangeTitle: (title: string) => void;
  onChangeBadge: (badge: string) => void;
  onApplyCustomScript: (scriptText: string) => void;
  onUpdateSegment: (updated: TranscriptSegment) => void;
  onSeek: (time: number) => void;
  onAutoAssignBroll: () => void;
  onUploadCustomBroll: (file: File) => void;
  onReTranscribe?: () => void;
}

export const TranscriptTimeline: React.FC<TranscriptTimelineProps> = ({
  segments,
  brollList,
  currentPlayTime,
  videoTitle,
  speakerBadge,
  onChangeTitle,
  onChangeBadge,
  onApplyCustomScript,
  onUpdateSegment,
  onSeek,
  onAutoAssignBroll,
  onUploadCustomBroll,
  onReTranscribe,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customBrollNotice, setCustomBrollNotice] = useState<string | null>(null);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [rawPastedScript, setRawPastedScript] = useState("");

  const handleFileBroll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadCustomBroll(file);
      setCustomBrollNotice(`Đã thêm cảnh trám riêng: "${file.name}"`);
      setTimeout(() => setCustomBrollNotice(null), 3000);
    }
  };

  const handleApplyScript = () => {
    if (!rawPastedScript.trim()) return;
    onApplyCustomScript(rawPastedScript);
    setShowPasteModal(false);
    setRawPastedScript("");
    setCustomBrollNotice("Đã đồng bộ toàn bộ lời thoại mới theo kịch bản!");
    setTimeout(() => setCustomBrollNotice(null), 3000);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-card/90 p-5 shadow-2xl backdrop-blur-sm space-y-4">
      {/* Dynamic Header Information: Video Title & Speaker Badge */}
      <div className="rounded-xl border border-pink-500/30 bg-pink-950/20 p-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-pink-500/30 text-pink-400 font-bold text-xs">
              ✦
            </span>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Nội dung & Định danh video đang biên tập
            </h4>
          </div>
          <span className="text-[10px] text-pink-400/90 font-medium">
            (Tự động điều chỉnh theo từng video thô hoặc sửa trực tiếp bên dưới)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Speaker Badge */}
          <div className="sm:col-span-4 space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
              <BadgeAlert className="size-3 text-pink-400" /> Huy hiệu người nói:
            </label>
            <input
              type="text"
              value={speakerBadge}
              onChange={(e) => onChangeBadge(e.target.value)}
              placeholder="VD: CÔ HẠNH CHIA SẺ, CHUYÊN GIA..."
              className="w-full rounded-lg border border-zinc-700 bg-black/70 px-3 py-1.5 text-xs font-black uppercase text-pink-300 outline-none focus:border-pink-500"
            />
          </div>

          {/* Video Title */}
          <div className="sm:col-span-8 space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
              <Type className="size-3 text-pink-400" /> Tiêu đề nổi bật (Headline Plate):
            </label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => onChangeTitle(e.target.value)}
              placeholder="Nhập tiêu đề xuất bản cho video này..."
              className="w-full rounded-lg border border-zinc-700 bg-black/70 px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400">
              <FileText className="size-4" />
            </div>
            <h3 className="text-sm font-extrabold text-white">
              Toàn Bộ Lời Thoại Gốc & Điều Phối Cảnh Trám ({segments.length} câu)
            </h3>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Bám sát từng giây theo lời thoại video gốc, tùy chọn cảnh trám minh họa cho từng luận điểm
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onReTranscribe && (
            <button
              onClick={onReTranscribe}
              className="flex items-center gap-1.5 rounded-lg border border-pink-500/40 bg-pink-950/40 px-3 py-1.5 text-xs font-bold text-pink-300 hover:bg-pink-500 hover:text-white transition-all shadow-md shadow-pink-500/10"
              title="Kích hoạt quét lại toàn bộ âm thanh & lời thoại bằng AI"
            >
              <Mic className="size-3.5 text-pink-400" />
              <span>🎙️ Quét Lại Lời Thoại AI</span>
            </button>
          )}

          <button
            onClick={() => setShowPasteModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-panel px-3 py-1.5 text-xs font-bold text-zinc-200 hover:border-pink-500 hover:text-white transition-all"
          >
            <ClipboardPaste className="size-3.5 text-pink-400" />
            <span>Dán kịch bản thoại</span>
          </button>

          <label className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-panel px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white cursor-pointer transition-all">
            <Upload className="size-3.5 text-emerald-400" />
            <span>Thêm cảnh trám (.mp4)</span>
            <input
              type="file"
              accept="video/*,image/*"
              className="hidden"
              onChange={handleFileBroll}
            />
          </label>

          <button
            onClick={onAutoAssignBroll}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-pink-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Wand2 className="size-3.5" />
            <span>AI Tự Động Phân Bổ Cảnh Trám</span>
          </button>
        </div>
      </div>

      {customBrollNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-pink-500/40 bg-pink-950/20 px-3 py-2 text-xs font-semibold text-pink-300 animate-fade-in">
          <Check className="size-3.5 text-pink-400" />
          <span>{customBrollNotice}</span>
        </div>
      )}

      {/* Paste Script Modal */}
      {showPasteModal && (
        <div className="rounded-xl border border-pink-500/50 bg-black/90 p-4 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-pink-400 uppercase tracking-wide flex items-center gap-1.5">
              <ClipboardPaste className="size-4" /> Dán Toàn Bộ Lời Thoại Gốc Của Video
            </h4>
            <button
              onClick={() => setShowPasteModal(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Đóng
            </button>
          </div>
          <p className="text-[11px] text-zinc-400">
            Dán kịch bản hoặc lời thoại (mỗi câu một dòng). AI sẽ tự động tính toán thời gian, tạo nhịp cắt và gán cảnh trám phù hợp:
          </p>
          <textarea
            rows={5}
            value={rawPastedScript}
            onChange={(e) => setRawPastedScript(e.target.value)}
            placeholder="Dán câu thoại vào đây, ví dụ:&#10;Hôm nay tôi chia sẻ cho các bạn 3 bí quyết quan trọng nhất...&#10;Sai lầm phổ biến khiến hầu hết mọi người thất bại...&#10;Cách xử lý triệt để trong 3 bước thực chiến..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-pink-500 font-mono"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowPasteModal(false)}
              className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
            >
              Hủy
            </button>
            <button
              onClick={handleApplyScript}
              className="rounded-lg bg-pink-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-pink-400"
            >
              Áp Dụng Lời Thoại Này
            </button>
          </div>
        </div>
      )}

      {/* Segments List */}
      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {segments.map((seg, idx) => {
          const isCurrent = currentPlayTime >= seg.sourceStart && currentPlayTime <= seg.sourceEnd;

          return (
            <div
              key={seg.id}
              className={`group relative rounded-xl border p-3.5 transition-all ${
                isCurrent
                  ? "border-pink-500 bg-panel shadow-lg shadow-pink-500/10 ring-1 ring-pink-500/30"
                  : "border-zinc-800 bg-panel/40 hover:border-zinc-700 hover:bg-panel/70"
              }`}
            >
              {/* Top row: Beat number, Timestamp, Jump button, Zoom level */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-pink-500/20 text-[10px] font-black text-pink-400">
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-zinc-400">
                    {formatTime(seg.sourceStart)} ➔ {formatTime(seg.sourceEnd)}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    ({(seg.sourceEnd - seg.sourceStart).toFixed(1)}s)
                  </span>
                  {isCurrent && (
                    <span className="rounded bg-pink-500 px-1.5 py-0.2 text-[9px] font-black text-white uppercase animate-pulse">
                      Đang phát
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Punch-in Zoom Picker */}
                  <div className="flex items-center gap-1 rounded bg-black/60 border border-zinc-800 px-1.5 py-0.5 text-[10px]">
                    <span className="text-zinc-500 font-medium">Punch Zoom:</span>
                    {[1.0, 1.08, 1.14].map((z) => (
                      <button
                        key={z}
                        onClick={() => onUpdateSegment({ ...seg, zoomScale: z })}
                        className={`rounded px-1 font-mono font-bold transition-all ${
                          seg.zoomScale === z
                            ? "bg-pink-500 text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {z}x
                      </button>
                    ))}
                  </div>

                  {/* Jump player button */}
                  <button
                    onClick={() => onSeek(seg.sourceStart)}
                    className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-300 hover:bg-pink-500 hover:text-white transition-all"
                  >
                    <Play className="size-2.5 fill-current" />
                    <span>Xem đoạn này</span>
                  </button>
                </div>
              </div>

              {/* Spoken Text (Editable) */}
              <div className="mb-2.5">
                {editingId === seg.id ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      defaultValue={seg.text}
                      onBlur={(e) => {
                        onUpdateSegment({ ...seg, text: e.target.value });
                        setEditingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onUpdateSegment({ ...seg, text: (e.target as HTMLInputElement).value });
                          setEditingId(null);
                        }
                      }}
                      autoFocus
                      className="w-full rounded-lg border border-pink-500 bg-black px-2.5 py-1 text-xs text-white outline-none"
                    />
                  </div>
                ) : (
                  <p
                    onClick={() => setEditingId(seg.id)}
                    className="text-xs font-semibold text-zinc-200 cursor-pointer hover:text-white transition-colors flex items-center justify-between group/text"
                  >
                    <span>{seg.text}</span>
                    <Edit3 className="size-3 text-zinc-500 opacity-0 group-hover/text:opacity-100 transition-opacity ml-2" />
                  </p>
                )}
              </div>

              {/* Meta row: Highlight word + Info card + B-roll settings */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80 text-[11px]">
                {/* Keyword highlight */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500">Từ khóa nhấn:</span>
                  <input
                    type="text"
                    value={seg.highlight}
                    onChange={(e) => onUpdateSegment({ ...seg, highlight: e.target.value })}
                    placeholder="Nhập từ khóa..."
                    className="rounded bg-black/60 border border-zinc-800 px-2 py-0.5 text-[10px] font-extrabold text-pink-400 outline-none focus:border-pink-500 max-w-[140px]"
                  />
                </div>

                {/* Info Card Pop-up Text (Optional) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500">Thẻ luận điểm:</span>
                  <input
                    type="text"
                    value={seg.infoCardText || ""}
                    onChange={(e) => onUpdateSegment({ ...seg, infoCardText: e.target.value })}
                    placeholder="VD: LUẬN ĐIỂM CHỨNG MINH..."
                    className="rounded bg-black/60 border border-zinc-800 px-2 py-0.5 text-[10px] font-bold text-amber-300 outline-none focus:border-amber-400 max-w-[150px]"
                  />
                </div>

                {/* Cảnh trám (B-Roll) Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500 font-semibold flex items-center gap-1">
                    <Film className="size-3 text-emerald-400" /> Cảnh trám:
                  </span>

                  <select
                    value={seg.brollId || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateSegment({
                        ...seg,
                        brollId: val || undefined,
                        brollMode: val ? (seg.brollMode === "none" ? "cutaway" : seg.brollMode) : "none",
                      });
                    }}
                    className="rounded bg-black/70 border border-zinc-700 px-2 py-0.5 text-[10px] font-bold text-emerald-300 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="">(Không dùng cảnh trám)</option>
                    {brollList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title}
                      </option>
                    ))}
                  </select>

                  {/* Mode toggle if B-roll is selected */}
                  {seg.brollId && (
                    <div className="flex items-center rounded bg-black/60 border border-zinc-800 p-0.5 text-[9px] font-bold">
                      <button
                        onClick={() => onUpdateSegment({ ...seg, brollMode: "cutaway" })}
                        className={`px-1.5 py-0.5 rounded transition-all ${
                          seg.brollMode === "cutaway"
                            ? "bg-emerald-500 text-black font-extrabold"
                            : "text-zinc-400 hover:text-white"
                        }`}
                        title="Tràn toàn màn hình 9:16"
                      >
                        Tràn khung
                      </button>
                      <button
                        onClick={() => onUpdateSegment({ ...seg, brollMode: "pip" })}
                        className={`px-1.5 py-0.5 rounded transition-all ${
                          seg.brollMode === "pip"
                            ? "bg-emerald-500 text-black font-extrabold"
                            : "text-zinc-400 hover:text-white"
                        }`}
                        title="Thu nhỏ dạng Picture-in-Picture"
                      >
                        Góc PiP
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
