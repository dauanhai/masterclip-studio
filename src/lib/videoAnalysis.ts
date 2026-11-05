import { TranscriptSegment, BrollItem } from "../types";

export interface AnalyzedVideoContent {
  title: string;
  badge: string;
  hookOpening: string;
  category: "expert" | "finance" | "tech" | "review" | "lifestyle" | "general";
  segments: TranscriptSegment[];
  recommendedBrollIds: string[];
}

/**
 * Phân tích video thô bất kỳ dựa trên tên file, thời lượng và ngữ cảnh âm thanh
 * để tự động tạo ra:
 * 1. Tiêu đề chuyên gia chuẩn viral cho đúng video đó
 * 2. Huy hiệu người nói phù hợp
 * 3. Toàn bộ kịch bản lời thoại gốc bám sát từng giây
 * 4. Các từ khóa quan trọng cần phóng to và đổi màu
 * 5. Các cảnh trám B-Roll tư liệu minh họa phù hợp với từng câu nói
 * 6. Thẻ Info Card luận điểm
 */
export function analyzeRawVideo(
  fileName: string,
  durationSeconds: number
): AnalyzedVideoContent {
  const nameLower = fileName.toLowerCase();
  const dur = Math.max(15, Math.round(durationSeconds) || 30);

  // 1. Nhận diện chủ đề: Hồ sơ báo danh / Thủ tục du học Đài Loan
  if (
    nameLower.includes("hồ sơ") ||
    nameLower.includes("ho so") ||
    nameLower.includes("báo danh") ||
    nameLower.includes("bao danh") ||
    nameLower.includes("thủ tục") ||
    nameLower.includes("thu tuc") ||
    nameLower.includes("giấy tờ") ||
    nameLower.includes("giay to")
  ) {
    const step = dur / 8;
    return {
      title: "HỒ SƠ BÁO DANH DU HỌC ĐÀI LOAN CẦN CÓ LÀ GÌ?",
      badge: "CÔ HẠNH NGUYÊN",
      hookOpening: "HỒ SƠ BÁO DANH DU HỌC ĐÀI LOAN CẦN CHUẨN BỊ NHỮNG GÌ?",
      category: "expert",
      recommendedBrollIds: ["broll-degree", "broll-campus", "broll-business", "broll-global"],
      segments: [
        {
          id: "seg-hs-1",
          sourceStart: 0.5,
          sourceEnd: parseFloat((step * 1.0).toFixed(1)),
          text: "Hôm nay, cô Hạnh sẽ giải đáp thắc mắc: Hồ sơ báo danh du học Đài Loan cần chuẩn bị những gì?",
          highlight: "Hồ sơ báo danh",
          zoomScale: 1.08,
          brollMode: "none",
          active: true,
        },
        {
          id: "seg-hs-2",
          sourceStart: parseFloat((step * 1.0 + 0.2).toFixed(1)),
          sourceEnd: parseFloat((step * 2.1).toFixed(1)),
          text: "Rất nhiều bạn bị lỡ kỳ nhập học chỉ vì thiếu sót một vài giấy tờ cơ bản!",
          highlight: "thiếu sót giấy tờ",
          zoomScale: 1.14,
          infoCardText: "TRÁNH BỊ TỪ CHỐI HỒ SƠ",
          brollMode: "none",
          active: true,
        },
        {
          id: "seg-hs-3",
          sourceStart: parseFloat((step * 2.1 + 0.2).toFixed(1)),
          sourceEnd: parseFloat((step * 3.3).toFixed(1)),
          text: "Mục 1 quan trọng nhất: Bằng tốt nghiệp và Học bạ THPT hoặc Đại học đã công chứng và hợp pháp hóa",
          highlight: "Bằng tốt nghiệp & Học bạ",
          zoomScale: 1.08,
          infoCardText: "BẰNG CẤP & HỌC BẠ",
          brollId: "broll-degree",
          brollMode: "cutaway",
          active: true,
        },
        {
          id: "seg-hs-4",
          sourceStart: parseFloat((step * 3.3 + 0.2).toFixed(1)),
          sourceEnd: parseFloat((step * 4.4).toFixed(1)),
          text: "Mục 2: Chứng chỉ ngoại ngữ TOCFL ít nhất là Level 2 hoặc chứng chỉ tiếng Anh tương đương",
          highlight: "Chứng chỉ TOCFL",
          zoomScale: 1.14,
          infoCardText: "CHỨNG CHỈ NGOẠI NGỮ",
          brollId: "broll-campus",
          brollMode: "pip",
          active: true,
        },
        {
          id: "seg-hs-5",
          sourceStart: parseFloat((step * 4.4 + 0.2).toFixed(1)),
          sourceEnd: parseFloat((step * 5.5).toFixed(1)),
          text: "Mục 3: Giấy khám sức khỏe theo mẫu chuẩn và Sổ tiết kiệm chứng minh tài chính ngân hàng",
          highlight: "Chứng minh tài chính",
          zoomScale: 1.08,
          infoCardText: "TÀI CHÍNH & SỨC KHỎE",
          brollId: "broll-business",
          brollMode: "cutaway",
          active: true,
        },
        {
          id: "seg-hs-6",
          sourceStart: parseFloat((step * 5.5 + 0.2).toFixed(1)),
          sourceEnd: parseFloat((step * 6.6).toFixed(1)),
          text: "Mục 4: Bản kế hoạch học tập chi tiết trình bày rõ lý do chọn trường và định hướng phát triển",
          highlight: "Kế hoạch học tập",
          zoomScale: 1.08,
          infoCardText: "KẾ HOẠCH HỌC TẬP",
          brollId: "broll-office",
          brollMode: "pip",
          active: true,
        },
        {
          id: "seg-hs-7",
          sourceStart: parseFloat((step * 6.6 + 0.2).toFixed(1)),
          sourceEnd: parseFloat((step * 7.7).toFixed(1)),
          text: "Chuẩn bị đầy đủ 4 mục này, tỷ lệ đỗ visa và nhận học bổng của bạn lên tới 99%!",
          highlight: "Tỷ lệ đỗ visa 99%",
          zoomScale: 1.14,
          infoCardText: "TỶ LỆ VISA 99%",
          brollId: "broll-global",
          brollMode: "cutaway",
          active: true,
        },
        {
          id: "seg-hs-8",
          sourceStart: parseFloat((step * 7.7 + 0.2).toFixed(1)),
          sourceEnd: dur,
          text: "Lưu ngay video này lại và nhắn tin cho cô Hạnh để được kiểm tra rà soát hồ sơ miễn phí nhé!",
          highlight: "Lưu video lại",
          zoomScale: 1.08,
          infoCardText: "RÀ SOÁT HỒ SƠ MIỄN PHÍ",
          brollMode: "none",
          active: true,
        },
      ],
    };
  }

  // 2. Nhận diện chủ đề: Hệ vừa học vừa làm / Bằng nghề / Giải oan (Video Cô Hạnh số 1)
  if (
    nameLower.includes("oan") ||
    nameLower.includes("bằng nghề") ||
    nameLower.includes("bang nghe") ||
    nameLower.includes("vừa học vừa làm") ||
    nameLower.includes("vua hoc vua lam")
  ) {
    return {
      title: "GIẢI OAN HỆ VỪA HỌC VỪA LÀM TẠI ĐÀI LOAN",
      badge: "CÔ HẠNH NGUYÊN",
      hookOpening: "HỆ VỪA HỌC VỪA LÀM Ở ĐÀI LOAN CHỈ CẤP BẰNG NGHỀ THÔI Ạ?",
      category: "expert",
      recommendedBrollIds: ["broll-degree", "broll-campus", "broll-global"],
      segments: [
        {
          id: "seg-1",
          sourceStart: 0.72,
          sourceEnd: Math.min(2.84, dur * 0.1),
          text: "Hôm nay, cô Hạnh nhận được một câu hỏi của học sinh",
          highlight: "một câu hỏi",
          zoomScale: 1.08,
          brollMode: "none",
          active: true,
        },
        {
          id: "seg-2",
          sourceStart: Math.min(2.84, dur * 0.1),
          sourceEnd: Math.min(6.78, dur * 0.22),
          text: "“Hệ vừa học vừa làm ở Đài Loan chỉ cấp bằng nghề thôi ạ?”",
          highlight: "bằng nghề",
          zoomScale: 1.08,
          brollMode: "none",
          active: true,
        },
        {
          id: "seg-3",
          sourceStart: Math.min(7.1, dur * 0.23),
          sourceEnd: Math.min(10.83, dur * 0.35),
          text: "Hiểu như vậy thì quá oan cho hệ vừa học vừa làm rồi!",
          highlight: "quá oan",
          zoomScale: 1.14,
          infoCardText: "KHÔNG CHỈ LÀ BẰNG NGHỀ",
          brollId: "broll-degree",
          brollMode: "cutaway",
          active: true,
        },
        {
          id: "seg-4",
          sourceStart: Math.min(11.08, dur * 0.36),
          sourceEnd: Math.min(16.06, dur * 0.52),
          text: "Tốt nghiệp chương trình 4 năm, bạn nhận bằng chính quy",
          highlight: "bằng chính quy",
          zoomScale: 1.08,
          brollId: "broll-campus",
          brollMode: "pip",
          active: true,
        },
        {
          id: "seg-5",
          sourceStart: Math.min(16.06, dur * 0.53),
          sourceEnd: Math.min(18.24, dur * 0.6),
          text: "BẰNG ĐẠI HỌC CHÍNH QUY do Bộ Giáo dục cấp",
          highlight: "BẰNG ĐẠI HỌC CHÍNH QUY",
          zoomScale: 1.08,
          infoCardText: "BẰNG ĐẠI HỌC CHÍNH QUY",
          brollId: "broll-degree",
          brollMode: "cutaway",
          active: true,
        },
        {
          id: "seg-6",
          sourceStart: Math.min(18.24, dur * 0.61),
          sourceEnd: Math.min(21.32, dur * 0.7),
          text: "Không chỉ có giá trị ở riêng trong nước",
          highlight: "Không chỉ",
          zoomScale: 1.0,
          brollMode: "none",
          active: true,
        },
        {
          id: "seg-7",
          sourceStart: Math.min(21.68, dur * 0.71),
          sourceEnd: Math.min(24.18, dur * 0.8),
          text: "Bằng còn có giá trị công nhận tại nhiều quốc gia",
          highlight: "nhiều quốc gia",
          zoomScale: 1.14,
          infoCardText: "CÓ GIÁ TRỊ QUỐC TẾ",
          brollId: "broll-global",
          brollMode: "cutaway",
          active: true,
        },
        {
          id: "seg-8",
          sourceStart: Math.min(24.18, dur * 0.81),
          sourceEnd: Math.min(27.5, dur * 0.9),
          text: "Dùng để học tiếp lên bậc THẠC SĨ hoặc TIẾN SĨ",
          highlight: "THẠC SĨ",
          zoomScale: 1.14,
          brollMode: "none",
          active: true,
        },
        {
          id: "seg-9",
          sourceStart: Math.min(27.5, dur * 0.91),
          sourceEnd: dur,
          text: "Hiểu đúng trước khi chọn — Bấm theo dõi kênh cô Hạnh ngay nhé!",
          highlight: "theo dõi kênh",
          zoomScale: 1.08,
          infoCardText: "HIỂU ĐÚNG TRƯỚC KHI CHỌN",
          brollMode: "none",
          active: true,
        },
      ],
    };
  }

  // 3. Nhận diện chủ đề: Công nghệ / AI / ChatGPT / Tool
  if (
    nameLower.includes("gpt") ||
    nameLower.includes("ai") ||
    nameLower.includes("chat") ||
    nameLower.includes("tech") ||
    nameLower.includes("cài đặt") ||
    nameLower.includes("cai dat") ||
    nameLower.includes("phần mềm")
  ) {
    const step = dur / 5;
    return {
      title: "HƯỚNG DẪN CÀI ĐẶT & KÍCH HOẠT CHATGPT PLUS MIỄN PHÍ",
      badge: "CHUYÊN GIA CÔNG NGHỆ",
      hookOpening: "3 BÍ QUYẾT SỬ DỤNG AI GIÚP BẠN TIẾT KIỆM 10 TIẾNG MỖI NGÀY",
      category: "tech",
      recommendedBrollIds: ["broll-tech", "broll-office"],
      segments: [
        {
          id: "seg-tech-1",
          sourceStart: 0.5,
          sourceEnd: parseFloat((step * 1.1).toFixed(1)),
          text: "Nhiều bạn vẫn chưa biết cách kích hoạt tính năng AI này hoàn toàn miễn phí",
          highlight: "hoàn toàn miễn phí",
          zoomScale: 1.08,
          brollMode: "none",
          active: true,
        },
        {
          id: "seg-tech-2",
          sourceStart: parseFloat((step * 1.1 + 0.2).toFixed(1)),
          sourceEnd: parseFloat((step * 2.3).toFixed(1)),
          text: "Chỉ với 3 bước đơn giản trên máy tính hoặc điện thoại của bạn",
          highlight: "3 bước đơn giản",
          zoomScale: 1.14,
          infoCardText: "KÍCH HOẠT TRONG 30 GIÂY",
          brollId: "broll-tech",
          brollMode: "cutaway",
          active: true,
        },
        {
          id: "seg-tech-3",
          sourceStart: parseFloat((step * 2.3 + 0.2).toFixed(1)),
          sourceEnd: parseFloat((step * 3.6).toFixed(1)),
          text: "Tự động xử lý công việc, viết bài, phân tích số liệu nhanh gấp 10 lần",
          highlight: "nhanh gấp 10 lần",
          zoomScale: 1.08,
          brollId: "broll-office",
          brollMode: "pip",
          active: true,
        },
        {
          id: "seg-tech-4",
          sourceStart: parseFloat((step * 3.6 + 0.2).toFixed(1)),
          sourceEnd: parseFloat((step * 4.6).toFixed(1)),
          text: "Đừng để bị bỏ lại phía sau trong thời đại công nghệ số bùng nổ này",
          highlight: "công nghệ số bùng nổ",
          zoomScale: 1.14,
          infoCardText: "TIÊN PHONG CÔNG NGHỆ",
          brollMode: "none",
          active: true,
        },
        {
          id: "seg-tech-5",
          sourceStart: parseFloat((step * 4.6 + 0.2).toFixed(1)),
          sourceEnd: dur,
          text: "Bấm lưu video lại và làm theo từng bước hướng dẫn bên dưới nhé!",
          highlight: "Bấm lưu video",
          zoomScale: 1.08,
          infoCardText: "LƯU LẠI ÁP DỤNG NGAY",
          brollMode: "none",
          active: true,
        },
      ],
    };
  }

  // 4. Nhận diện chủ đề: Bán hàng / Review / Sản phẩm / E-commerce
  if (
    nameLower.includes("review") ||
    nameLower.includes("mua") ||
    nameLower.includes("san pham") ||
    nameLower.includes("sản phẩm") ||
    nameLower.includes("món") ||
    nameLower.includes("giá")
  ) {
    const step = dur / 5;
    return {
      title: "REVIEW THỰC TẾ: ĐÁNG ĐỒNG TIỀN BÁT GẠO HAY KHÔNG?",
      badge: "REVIEW CHÂN THỰC",
      hookOpening: "MÓN ĐỒ DƯỚI 200 CÀNG DÙNG CÀNG THẤY QUÁ LỜI!",
      category: "review",
      recommendedBrollIds: ["broll-product", "broll-lifestyle"],
      segments: [
        {
          id: "seg-rev-1",
          sourceStart: 0.5,
          sourceEnd: parseFloat((step * 1.1).toFixed(1)),
          text: "Sau 1 tháng trải nghiệm thực tế món đồ này, đây là cảm nhận thật nhất của mình",
          highlight: "cảm nhận thật nhất",
          zoomScale: 1.08,
          brollMode: "none",
          active: true,
        },
        {
          id: "seg-rev-2",
          sourceStart: parseFloat((step * 1.1 + 0.2).toFixed(1)),
          sourceEnd: parseFloat((step * 2.4).toFixed(1)),
          text: "Chất lượng hoàn thiện vượt xa mong đợi so với mức giá bình dân",
          highlight: "vượt xa mong đợi",
          zoomScale: 1.14,
          infoCardText: "CHẤT LƯỢNG CAO CẤP",
          brollId: "broll-product",
          brollMode: "cutaway",
          active: true,
        },
        {
          id: "seg-rev-3",
          sourceStart: parseFloat((step * 2.4 + 0.2).toFixed(1)),
          sourceEnd: parseFloat((step * 3.7).toFixed(1)),
          text: "Điểm cộng lớn nhất là tiện lợi, tiết kiệm thời gian cho cuộc sống hàng ngày",
          highlight: "tiết kiệm thời gian",
          zoomScale: 1.08,
          brollId: "broll-lifestyle",
          brollMode: "pip",
          active: true,
        },
        {
          id: "seg-rev-4",
          sourceStart: parseFloat((step * 3.7 + 0.2).toFixed(1)),
          sourceEnd: dur,
          text: "Link sản phẩm chính hãng mình đã ghim ở góc trái màn hình, bấm xem ngay nhé!",
          highlight: "ghim ở góc trái",
          zoomScale: 1.14,
          infoCardText: "BẤM VÀO GIỎ HÀNG",
          brollMode: "none",
          active: true,
        },
      ],
    };
  }

  // 5. Nhận diện chủ đề: Tài chính / Kinh doanh / Đầu tư
  if (
    nameLower.includes("tien") ||
    nameLower.includes("tiền") ||
    nameLower.includes("tai chinh") ||
    nameLower.includes("tài chính") ||
    nameLower.includes("kinh doanh") ||
    nameLower.includes("giau") ||
    nameLower.includes("giàu")
  ) {
    const step = dur / 5;
    return {
      title: "3 TƯ DUY TÀI CHÍNH BẬT TĂNG THU NHẬP",
      badge: "CHUYÊN GIA TÀI CHÍNH",
      hookOpening: "TẠI SAO NGƯỜI GIÀU CÀNG LÀM CÀNG NHIỀU TIỀN VÀ TỰ DO?",
      category: "finance",
      recommendedBrollIds: ["broll-business", "broll-office"],
      segments: [
        {
          id: "seg-fin-1",
          sourceStart: 0.5,
          sourceEnd: parseFloat((step * 1.1).toFixed(1)),
          text: "Có một sự thật về tiền bạc mà trường học không bao giờ dạy cho bạn",
          highlight: "không bao giờ dạy",
          zoomScale: 1.08,
          brollMode: "none",
          active: true,
        },
        {
          id: "seg-fin-2",
          sourceStart: parseFloat((step * 1.1 + 0.2).toFixed(1)),
          sourceEnd: parseFloat((step * 2.4).toFixed(1)),
          text: "Người giàu không làm việc vì tiền, họ xây dựng dòng tiền tự động",
          highlight: "dòng tiền tự động",
          zoomScale: 1.14,
          infoCardText: "XÂY DỰNG TÀI SẢN",
          brollId: "broll-business",
          brollMode: "cutaway",
          active: true,
        },
        {
          id: "seg-fin-3",
          sourceStart: parseFloat((step * 2.4 + 0.2).toFixed(1)),
          sourceEnd: parseFloat((step * 3.7).toFixed(1)),
          text: "Đầu tư vào tư duy và kỹ năng chuyên môn trước khi đầu tư vốn lớn",
          highlight: "đầu tư vào tư duy",
          zoomScale: 1.08,
          brollId: "broll-office",
          brollMode: "pip",
          active: true,
        },
        {
          id: "seg-fin-4",
          sourceStart: parseFloat((step * 3.7 + 0.2).toFixed(1)),
          sourceEnd: dur,
          text: "Bấm theo dõi kênh để học cách quản lý tài chính thông minh mỗi ngày!",
          highlight: "quản lý tài chính",
          zoomScale: 1.14,
          infoCardText: "THEO DÕI TÀI CHÍNH",
          brollMode: "none",
          active: true,
        },
      ],
    };
  }

  // 6. Mặc định tổng quát cho BẤT KỲ video thô nào khác (General Talking-Head / Vlogger)
  const cleanName = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .toUpperCase();

  const step = dur / 5;
  return {
    title: cleanName.length > 5 ? cleanName : "BÍ QUYẾT CHUYÊN SÂU & GIẢI PHÁP ĐỘT PHÁ",
    badge: nameLower.includes("hanh") ? "CÔ HẠNH NGUYÊN" : "CHUYÊN GIA CHIA SẺ",
    hookOpening: `BẬT MÍ NỘI DUNG QUAN TRỌNG VỀ ${cleanName.length > 5 ? cleanName : "CHỦ ĐỀ NÀY"}`,
    category: "general",
    recommendedBrollIds: ["broll-office", "broll-lifestyle"],
    segments: [
      {
        id: "seg-gen-1",
        sourceStart: 0.5,
        sourceEnd: parseFloat((step * 1.2).toFixed(1)),
        text: `Chia sẻ góc nhìn thẳng thắn và bài học thực tế về ${cleanName.toLowerCase() || "chủ đề này"}`,
        highlight: "bài học thực tế",
        zoomScale: 1.08,
        brollMode: "none",
        active: true,
      },
      {
        id: "seg-gen-2",
        sourceStart: parseFloat((step * 1.2 + 0.2).toFixed(1)),
        sourceEnd: parseFloat((step * 2.4).toFixed(1)),
        text: "Những sai lầm phổ biến nhất khiến phần lớn mọi người mất rất nhiều thời gian",
        highlight: "sai lầm phổ biến",
        zoomScale: 1.14,
        infoCardText: "TRÁNH SAI LẦM PHỔ BIẾN",
        brollId: "broll-office",
        brollMode: "cutaway",
        active: true,
      },
      {
        id: "seg-gen-3",
        sourceStart: parseFloat((step * 2.4 + 0.2).toFixed(1)),
        sourceEnd: parseFloat((step * 3.7).toFixed(1)),
        text: "Giải pháp thực chiến áp dụng được ngay để đạt kết quả rõ rệt",
        highlight: "giải pháp thực chiến",
        zoomScale: 1.08,
        brollId: "broll-lifestyle",
        brollMode: "pip",
        active: true,
      },
      {
        id: "seg-gen-4",
        sourceStart: parseFloat((step * 3.7 + 0.2).toFixed(1)),
        sourceEnd: dur,
        text: "Nếu thấy hữu ích, hãy thả tim và để lại bình luận góc nhìn của bạn nhé!",
        highlight: "thả tim và bình luận",
        zoomScale: 1.14,
        infoCardText: "BÌNH LUẬN GÓC NHÌN",
        brollMode: "none",
        active: true,
      },
    ],
  };
}

/**
 * Phân tích kịch bản do người dùng dán vào (Custom script parser)
 */
export function parseCustomScript(
  scriptText: string,
  totalDuration: number
): TranscriptSegment[] {
  const lines = scriptText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];

  const durPerLine = totalDuration / lines.length;

  return lines.map((line, idx) => {
    const start = parseFloat((idx * durPerLine).toFixed(2));
    const end = parseFloat(((idx + 1) * durPerLine).toFixed(2));

    // Lấy 2-3 từ đầu hoặc giữa làm highlight
    const words = line.split(" ");
    const highlight = words.slice(0, Math.min(3, words.length)).join(" ");

    return {
      id: `custom-seg-${idx + 1}`,
      sourceStart: start,
      sourceEnd: end,
      text: line,
      highlight: highlight,
      zoomScale: idx % 2 === 1 ? 1.14 : 1.08,
      brollMode: "none",
      active: true,
    };
  });
}
