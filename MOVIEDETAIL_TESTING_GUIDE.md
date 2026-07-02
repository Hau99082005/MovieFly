# Hướng dẫn test trang chi tiết phim (MovieDetail)

## Trạng thái hiện tại
✅ Build thành công không lỗi TypeScript
✅ Tất cả API endpoints đã được kết nối đúng
✅ Giao diện responsive cho mobile/tablet/desktop
✅ Thiết kế chuyên nghiệp kiểu Vieon

## Cách test

### 1. Khởi động server và client

**Terminal 1 - Server:**
```bash
cd d:\MovieFly\server
npm start
```

**Terminal 2 - Client:**
```bash
cd d:\MovieFly\client
npm run dev
```

### 2. Lấy ID phim để test

Mở Postman hoặc browser và gọi API:
```
GET http://localhost:3000/api/movies
```

Lấy `_id` của một phim từ response, ví dụ: `6a4376d7e5a4e8763fbfd180`

### 3. Truy cập trang chi tiết

Mở browser và truy cập:
```
http://localhost:5173/movies/6a4376d7e5a4e8763fbfd180
```

(Thay `6a4376d7e5a4e8763fbfd180` bằng ID phim thực tế từ database của bạn)

### 4. Hoặc click từ trang chủ

Nếu có MovieCard hiển thị trên trang chủ, click vào card sẽ tự động navigate đến trang chi tiết.

## Các API được sử dụng

Trang chi tiết gọi 3 APIs song song:

1. **Chi tiết phim:** `GET /api/movies/:id`
   - Response: `{ message, data: { _id, title, poster_url, ... } }`

2. **Thể loại phim:** `GET /api/moviegenres/movie/:id`
   - Response: `{ message, data: [{ _id, movieId, genreId: { name, ... } }] }`

3. **Diễn viên & ekip:** `GET /api/movie-cast/movie/:id`
   - Response: `{ message, data: [{ _id, personId: { name, avatar_url }, role, character_name }], total }`
   - API này optional, nếu lỗi sẽ trả về mảng rỗng

## Các tính năng trên trang

### Hero Section
- ✅ Backdrop image fullscreen
- ✅ Poster hiển thị trên desktop (ẩn trên mobile)
- ✅ Rating badges (IMDb, Rating)
- ✅ Năm phát hành, thời lượng, quốc gia
- ✅ Thể loại phim (tối đa 5)
- ✅ Nút "Xem ngay" mở trailer modal
- ✅ Nút "Danh sách" (watchlist toggle)
- ✅ Nút Share

### Content Section
- ✅ Nội dung phim (synopsis)
- ✅ Grid diễn viên & ekip (tối đa 10)
- ✅ Sidebar thông tin (lượt xem, ngôn ngữ, badges)

### Trailer Modal
- ✅ HTML5 video player
- ✅ Autoplay khi mở
- ✅ Nút đóng ở góc phải trên
- ✅ Click background hoặc X để đóng

### Responsive Design
- ✅ Mobile: Hero 50vh, 1 column layout
- ✅ Tablet: Hero 60vh, grid cast 2-3 columns
- ✅ Desktop: Hero 85vh, poster sidebar, grid 5 columns

## Xử lý lỗi

### Nếu không tìm thấy phim
- Hiển thị message: "Không tìm thấy phim!"
- Nút "Về trang chủ" để quay lại

### Nếu đang loading
- Hiển thị spinner loading ở giữa màn hình

### Nếu không có cast
- Section diễn viên sẽ không hiển thị (conditional render)

### Nếu không có genres
- Section thể loại sẽ không hiển thị

## Dữ liệu hiển thị có điều kiện

- Rating badge: Chỉ hiển thị nếu `rating > 0`
- IMDb badge: Chỉ hiển thị nếu `imdb_score > 0`
- Duration: Chỉ hiển thị nếu `duration_min > 0`
- Badges "Miễn phí": Hiển thị nếu `is_free = true`
- Badges "Nổi bật": Hiển thị nếu `is_featured = true`

## Kiểm tra nếu có lỗi

### Mở Browser Console (F12)
- Không có lỗi đỏ
- Không có warning React Hooks
- Xem network requests thành công (status 200)

### Nếu gặp lỗi 404
- Kiểm tra ID phim có tồn tại trong database không
- Verify server đang chạy ở port 3000
- Kiểm tra file `.env` có `VITE_API_URL=http://localhost:3000/api`

### Nếu không load được ảnh
- Kiểm tra Bunny CDN URLs
- Verify `poster_url`, `backdrop_url` có đúng format không
- Check CORS settings

## Route configuration

File: `client/src/App.tsx`
```tsx
<Route path="/movies/:id" element={<MovieDetail />} />
```

## Next steps (Optional)

- [ ] Thêm Similar Movies section
- [ ] Thêm Comments/Reviews section
- [ ] Thêm SEO meta tags
- [ ] Thêm share functionality thực tế
- [ ] Connect watchlist API thực sự
