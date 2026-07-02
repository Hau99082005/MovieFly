# Hướng dẫn test trang chi tiết phim kiểu VieON

## Trạng thái
✅ Build thành công
✅ Thiết kế giống hệt VieON từ hình
✅ Responsive đầy đủ
✅ Tích hợp tất cả APIs

## Các tính năng chính

### 1. Hero Section (Fullscreen)
- ✅ Video/Backdrop fullscreen
- ✅ Logo phim ở góc trái trên
- ✅ Nút đóng (X) ở góc phải trên
- ✅ Nút bật/tắt âm thanh (Volume) ở góc phải dưới
- ✅ Overlay gradient từ dưới lên
- ✅ Tiêu đề phim lớn
- ✅ Tagline/slogan
- ✅ Nút "Xem ngay" (trắng)
- ✅ Nút "Danh sách" (trong suốt viền trắng)
- ✅ Thông tin: Lượt xem, Rating 5 sao, Age rating (T16), Năm, Quốc gia, Số phần/thời lượng, Chất lượng (Full HD)
- ✅ Mô tả ngắn (3 dòng)
- ✅ Icons: Yêu thích (Heart + số lượng), Bình luận, Chia sẻ
- ✅ Thông tin chi tiết: Diễn viên, Đạo diễn, Thể loại

### 2. Danh sách tập (cho Series)
- ✅ Hiển thị khi type = "series"
- ✅ Tab chọn phần (Season selector)
- ✅ Grid episodes với thumbnail
- ✅ Mỗi episode: Thumbnail, Play icon, Số tập + Tên, Age rating, Quality, Duration, Synopsis
- ✅ Hover effect
- ✅ Click để xem tập

### 3. Video liên quan
- ✅ Hiển thị trailer
- ✅ Thumbnail với play icon
- ✅ Thông tin: Tiêu đề, Age rating, Quality
- ✅ Click để mở modal xem trailer

### 4. Đề xuất cho bạn
- ✅ Grid similar movies (2-5 columns responsive)
- ✅ Poster với aspect ratio 2:3
- ✅ Badges: TOP 10 (nếu featured), PRO (nếu không free)
- ✅ Thông tin: Năm, Age rating, Quốc gia, Số phần, Quality, Synopsis
- ✅ Hover scale effect
- ✅ Click navigate

### 5. Bình luận
- ✅ Input thêm bình luận mới
- ✅ Avatar người dùng (circle với initial)
- ✅ Danh sách comments với avatar, username, timestamp, content
- ✅ Nút like/reply cho mỗi comment
- ✅ Nested replies

### 6. Trailer Modal
- ✅ Fullscreen overlay
- ✅ HTML5 video player
- ✅ Autoplay
- ✅ Nút đóng (X)
- ✅ Mute/unmute control

## APIs được gọi

### Chính
1. `GET /api/movies/:id` - Chi tiết phim
2. `GET /api/moviegenres/movie/:id` - Thể loại
3. `GET /api/movie-cast/movie/:id` - Diễn viên & đạo diễn
4. `GET /api/comments/movie/:id` - Bình luận

### Cho Series
5. `GET /api/seasons/movie/:id` - Danh sách seasons
6. `GET /api/episodes/season/:seasonId` - Episodes theo season

### Đề xuất
7. `GET /api/movies?limit=8` - Similar movies

## Cấu trúc response

### Movies
```json
{
  "message": "Movie retrieved successfully",
  "data": {
    "_id": "...",
    "title": "...",
    "type": "movie" | "series",
    "synopsis": "...",
    "backdrop_url": "...",
    "poster_url": "...",
    "trailer_url": "...",
    "rating": 4.9,
    "view_count": 364134,
    "release_date": "2026-...",
    "duration_min": 120,
    "country_code": "vi",
    "is_free": true,
    "is_featured": true
  }
}
```

### Seasons
```json
{
  "message": "Seasons retrieved successfully",
  "data": [
    {
      "_id": "...",
      "seasonNumber": 1,
      "title": "Phần 1"
    }
  ]
}
```

### Episodes
```json
{
  "message": "Episodes retrieved successfully",
  "data": [
    {
      "_id": "...",
      "episodeNumber": 1,
      "title": "Lần gặp đầu",
      "synopsis": "...",
      "thumbnailUrl": "...",
      "durationSeconds": 1440,
      "viewCount": 0,
      "isFree": true
    }
  ]
}
```

### Comments
```json
{
  "message": "Comments retrieved successfully",
  "data": [
    {
      "_id": "...",
      "userId": {
        "_id": "...",
        "username": "yingying",
        "avatar_url": "..."
      },
      "content": "hay gaaaa",
      "like_count": 0,
      "createdAt": "2026-06-28T22:46:00.000Z",
      "replies": []
    }
  ]
}
```

## Cách test

### 1. Start server và client
```bash
# Terminal 1 - Server
cd d:\MovieFly\server
npm start

# Terminal 2 - Client
cd d:\MovieFly\client
npm run dev
```

### 2. Test với movie type = "movie"
```
Lấy movie ID từ: GET http://localhost:3000/api/movies
Truy cập: http://localhost:5173/movies/{MOVIE_ID}
```

Sẽ thấy:
- Hero section
- Video liên quan (trailer)
- Đề xuất cho bạn
- Bình luận
- KHÔNG có "Danh sách tập"

### 3. Test với movie type = "series"
```
Lấy series ID (type: "series")
Truy cập: http://localhost:5173/movies/{SERIES_ID}
```

Sẽ thấy thêm:
- Danh sách tập section
- Tab chọn phần (nếu có nhiều seasons)
- Grid episodes

### 4. Test responsive
- Mobile: 1 column episodes, 2 columns similar movies
- Tablet: 2-3 columns
- Desktop: 4-5 columns similar movies

### 5. Test interactions
- Click "Xem ngay" → Mở trailer modal
- Click "Danh sách" → Toggle watchlist state
- Click Heart icon → Toggle favorite
- Click episode → Có thể thêm navigation sau
- Click similar movie → Navigate đến chi tiết phim đó
- Click X ở hero → Navigate về home

## Style đặc trưng VieON

### Colors
- Background: `bg-black`
- Text primary: `text-white`
- Text secondary: `text-gray-300` / `text-gray-400`
- Accent: `bg-primary` (cyan)
- Overlay: `bg-black/95`, `bg-black/50`, `bg-white/10`

### Typography
- Hero title: `text-4xl md:text-6xl font-bold`
- Section title: `text-2xl font-bold`
- Body: `text-sm md:text-base`
- Meta info: `text-xs text-gray-400`

### Components
- Buttons: `rounded` (not `rounded-full`)
- Cards: `rounded-lg`
- Badges: Border style `border border-white/40`
- Age rating: `T16` in bordered badge
- Quality: `Full HD` text

### Spacing
- Section padding: `py-12`
- Container: `max-w-7xl mx-auto px-6`
- Gap: `gap-4`, `gap-6`

## Điểm khác biệt với trang cũ

| Feature | Trang cũ (MovieDetail) | Trang mới (MovieDetailVieON) |
|---------|------------------------|------------------------------|
| Layout | Hero 85vh | Hero fullscreen |
| Poster | Sidebar desktop | Không có poster riêng |
| Title position | Bottom left overlay | Bottom left fullscreen |
| Buttons | Rounded-full | Rounded |
| Cast section | Grid lớn | Text inline (chỉ 3 tên) |
| Episodes | Không có | Có đầy đủ |
| Comments | Không có | Có đầy đủ |
| Similar movies | Không có | Có grid đẹp |
| Video | Modal | Modal + hero background |
| Close button | Trong modal | Trong hero + modal |

## Known limitations
- User authentication chưa có (dùng mock user cho comments)
- Like/unlike comment chưa persist
- Watchlist chưa save vào database
- Episode playback chưa implement
- Share functionality chưa có

## Next steps (Optional)
- [ ] Implement user authentication
- [ ] Connect watchlist API
- [ ] Implement episode player
- [ ] Add share functionality
- [ ] Add SEO meta tags
- [ ] Load more episodes (pagination)
- [ ] Filter comments by newest/oldest
