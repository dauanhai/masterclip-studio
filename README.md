# 🎬 MasterClip AI Studio

> Biến video dài thành hàng loạt video Short viral trên TikTok, Reels & YouTube Shorts với AI thông minh, hỗ trợ kéo thả video, chọn Preset phong cách và tùy chỉnh phụ đề real-time.

![MasterClip Banner](https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80)

## ✨ Điểm Nổi Bật

- 🚀 **Kéo thả & Dán Link video**: Hỗ trợ trực tiếp file `.mp4`, `.mov`, `.webm` với khả năng nạp video tức thì qua Web API (Client-side), không tốn băng thông chờ upload server.
- 🎨 **Bộ Preset Phong Cách Thực Chiến**:
  - 🌸 **Korean Glow & Clean Face**: Da trắng hồng căng mịn, khử mụn thâm, tôn sáng chủ thể.
  - ⚡ **Hero Neon Cyberpunk**: Subtitle to nhảy chữ Alex Hormozi phong cách Magenta/Neon Yellow.
  - 🎙️ **Podcast & Talking-Head Authority**: Tự động cắt 100% khoảng lặng, Zoom nhịp 1.2x, phụ đề Karaoke.
  - 🎬 **Luxury & Cinematic Storytelling**: Tone màu điện ảnh hoài niệm, nhạc lofi thư thái, text serif tối giản.
  - 🛍️ **High-Converting E-commerce & Review**: Khung viền Camcorder HUD, hiệu ứng CTA giỏ hàng TikTok.
- 📱 **Trình phát 9:16 Real-Time**:
  - Khung giả lập Smartphone cao cấp.
  - Tùy chọn bật/tắt **Safe-Zone Overlay** (Tránh vùng nút Like/Comment/Mô tả của TikTok che mất phụ đề).
  - Tùy chọn linh hoạt: `9:16` (TikTok/Reels), `16:9` (YouTube), `1:1` (Square), `4:5` (Social Feed).
- ⚙️ **Bộ tinh chỉnh nâng cao**:
  - Tự động cắt khoảng lặng vô nghĩa (`Silence cut` 0.3s - 0.7s).
  - Tăng tốc giọng nói thông minh (`1.1x` - `1.25x`) giữ nguyên chất giọng.
  - Kiểu phụ đề: Neon Glow, Karaoke Word-by-Word, Box Đen, Bold Minimal.
  - Chọn nhạc nền viral tự động + Smart Audio Ducking.
- ⚡ **Trình Giả Lập Render & Xuất File Short**:
  - Phân tích và trích xuất tự động 3 đoạn Short hay nhất từ video dài (Hook bùng nổ, Điểm cốt lõi, Kêu gọi hành động).
  - Chấm điểm AI Viral Score (90-98/100).
  - Tải về video MP4 hoặc xuất file phụ đề `.srt`.

---

## 🛠️ Cài Đặt & Chạy Local

Yêu cầu: Đã cài đặt [Node.js](https://nodejs.org/) (khuyến nghị v18+).

```bash
# 1. Cài đặt dependencies
npm install

# 2. Khởi chạy môi trường phát triển
npm run dev

# 3. Mở trình duyệt tại http://localhost:3000
```

---

## 🚀 Đẩy Lên GitHub & Triển Khai Lên Vercel

### Bước 1: Khởi tạo Git & Đẩy lên GitHub

```bash
git init
git add .
git commit -m "feat: initial commit MasterClip AI Studio"
git branch -M main
git remote add origin https://github.com/<tai-khoan-cua-ban>/masterclip-studio.git
git push -u origin main
```

### Bước 2: Deploy lên Vercel (Miễn phí & Cực nhanh)

1. Truy cập [vercel.com](https://vercel.com) và đăng nhập.
2. Bấm **"Add New..."** -> **"Project"**.
3. Chọn repository `masterclip-studio` vừa tạo trên GitHub.
4. Vercel sẽ tự động nhận diện framework **Vite** và file `vercel.json`.
5. Bấm **Deploy**. Sau ~30 giây, bạn sẽ có đường link trực tiếp (ví dụ: `https://masterclip-studio.vercel.app`) để gửi khách hàng trải nghiệm ngay!

---

## 👨‍💻 Bản Quyền & Phát Triển
Được phát triển và tối ưu cho Creator, Marketer và Agency sản xuất nội dung ngắn chuyên nghiệp.
