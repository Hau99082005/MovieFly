# Dữ liệu mẫu Video Source - Test Postman

## Cấu trúc Schema

```javascript
{
  movieId: ObjectId (ref: Movie),
  episodeId: ObjectId (ref: Episode) - optional,
  quality: Number (360, 480, 720, 1080, 2160) - auto-detected from video,
  format: String (enum: mp4, mkv, avi, mov, flv, wmv, webm, mpeg, 3gp, vob, ogv, ts, m4v),
  url: String - auto-generated from Bunny CDN,
  bunny_file_path: String - auto-generated,
  bunny_storage_zone: String - auto-generated,
  cdn_region: String (vn, sg, us, eu),
  file_size_mb: Number - auto-calculated from video,
  is_default: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 1. Tạo Video Source Mới (POST)

**Endpoint:** `POST /api/video-sources`

**Content-Type:** `multipart/form-data`

### Request Form-Data - Video cho Movie

| Key | Type | Value | Description |
|-----|------|-------|-------------|
| `video` | File | avengers-endgame-4k.mp4 | Video file (max 500MB) |
| `movieId` | Text | 507f1f77bcf86cd799439011 | Required |
| `format` | Text | mp4 | Required |
| `cdn_region` | Text | vn | Required |
| `is_default` | Text | true | Optional (default: false) |

### Request Form-Data - Video cho Episode

| Key | Type | Value | Description |
|-----|------|-------|-------------|
| `video` | File | friends-s01e01-1080p.mp4 | Video file (max 500MB) |
| `movieId` | Text | 507f1f77bcf86cd799439012 | Required |
| `episodeId` | Text | 507f1f77bcf86cd799439013 | Optional |
| `format` | Text | mp4 | Required |
| `cdn_region` | Text | sg | Required |
| `is_default` | Text | true | Optional |

### Postman Setup:
1. Select **POST** method
2. URL: `http://localhost:5000/api/video-sources`
3. Go to **Body** tab
4. Select **form-data**
5. Add fields as shown above
6. For `video` field: Select **File** type and choose video file

### cURL Example:

```bash
curl -X POST http://localhost:5000/api/video-sources \
  -F "video=@/path/to/video.mp4" \
  -F "movieId=507f1f77bcf86cd799439011" \
  -F "format=mp4" \
  -F "cdn_region=vn" \
  -F "is_default=true"
```

### Response Success (201)

```json
{
  "message": "Video source created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "movieId": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Avengers: Endgame",
      "slug": "avengers-endgame"
    },
    "episodeId": null,
    "quality": 2160,
    "format": "mp4",
    "url": "https://moviefly-cdn.b-cdn.net/videos/1735689600000-avengers-endgame-4k.mp4",
    "bunny_file_path": "videos/1735689600000-avengers-endgame-4k.mp4",
    "bunny_storage_zone": "study-storage-2026",
    "cdn_region": "vn",
    "file_size_mb": 15360,
    "is_default": true,
    "createdAt": "2026-07-01T00:00:00.000Z",
    "updatedAt": "2026-07-01T00:00:00.000Z"
  }
}
```

**Lưu ý:**
- `quality` và `file_size_mb` được tự động detect từ video file
- `url`, `bunny_file_path`, `bunny_storage_zone` được tự động generate khi upload lên Bunny CDN
- Video file phải có trong form-data với key `video`
- Max file size: 500MB
- Supported formats: mp4, mkv, avi, mov, flv, wmv, webm, mpeg, 3gp, vob, ogv, ts, m4v

---

## 2. Lấy Tất Cả Video Sources (GET)

**Endpoint:** `GET /api/video-sources`

### Response Success (200)

```json
{
  "message": "Video sources retrieved successfully",
  "total": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "movieId": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Avengers: Endgame",
        "slug": "avengers-endgame",
        "release_date": "2019-04-26"
      },
      "episodeId": null,
      "quality": 2160,
      "format": "mp4",
      "url": "https://moviefly-cdn.b-cdn.net/videos/1735689600000-avengers-endgame-4k.mp4",
      "bunny_file_path": "videos/1735689600000-avengers-endgame-4k.mp4",
      "bunny_storage_zone": "study-storage-2026",
      "cdn_region": "vn",
      "file_size_mb": 15360,
      "is_default": true,
      "createdAt": "2026-07-01T00:00:00.000Z",
      "updatedAt": "2026-07-01T00:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439021",
      "movieId": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Avengers: Endgame",
        "slug": "avengers-endgame"
      },
      "episodeId": null,
      "quality": 1080,
      "format": "mp4",
      "url": "https://moviefly-cdn.b-cdn.net/videos/1735689601000-avengers-endgame-1080p.mp4",
      "bunny_file_path": "videos/1735689601000-avengers-endgame-1080p.mp4",
      "bunny_storage_zone": "study-storage-2026",
      "cdn_region": "vn",
      "file_size_mb": 4096,
      "is_default": false,
      "createdAt": "2026-07-01T00:00:00.000Z",
      "updatedAt": "2026-07-01T00:00:00.000Z"
    }
  ]
}
```

---

## 3. Lấy Video Source Theo ID (GET)

**Endpoint:** `GET /api/video-sources/:id`

### Example URL

```
GET /api/video-sources/507f1f77bcf86cd799439020
```

### Response Success (200)

```json
{
  "message": "Video source retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "movieId": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Avengers: Endgame",
      "slug": "avengers-endgame",
      "poster_url": "https://image.tmdb.org/t/p/w500/poster.jpg",
      "release_date": "2019-04-26",
      "duration": 181
    },
    "episodeId": null,
    "quality": 2160,
    "format": "mp4",
    "url": "https://moviefly-cdn.b-cdn.net/videos/1735689600000-avengers-endgame-4k.mp4",
    "bunny_file_path": "videos/1735689600000-avengers-endgame-4k.mp4",
    "bunny_storage_zone": "study-storage-2026",
    "cdn_region": "vn",
    "file_size_mb": 15360,
    "is_default": true,
    "createdAt": "2026-07-01T00:00:00.000Z",
    "updatedAt": "2026-07-01T00:00:00.000Z"
  }
}
```

---

## 4. Lấy Video Sources Theo Movie ID (GET)

**Endpoint:** `GET /api/video-sources/movie/:movieId`

### Example URL

```
GET /api/video-sources/movie/507f1f77bcf86cd799439011
```

### Response Success (200)

```json
{
  "message": "Video sources retrieved successfully",
  "total": 4,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "movieId": "507f1f77bcf86cd799439011",
      "episodeId": null,
      "quality": 2160,
      "format": "mp4",
      "url": "https://moviefly-cdn.b-cdn.net/videos/1735689600000-avengers-endgame-4k.mp4",
      "cdn_region": "vn",
      "file_size_mb": 15360,
      "is_default": true
    },
    {
      "_id": "507f1f77bcf86cd799439021",
      "movieId": "507f1f77bcf86cd799439011",
      "episodeId": null,
      "quality": 1080,
      "format": "mp4",
      "url": "https://moviefly-cdn.b-cdn.net/videos/1735689601000-avengers-endgame-1080p.mp4",
      "cdn_region": "vn",
      "file_size_mb": 4096,
      "is_default": false
    }
  ]
}
```

---

## 5. Lấy Video Sources Theo Episode ID (GET)

**Endpoint:** `GET /api/video-sources/episode/:episodeId`

### Example URL

```
GET /api/video-sources/episode/507f1f77bcf86cd799439013
```

### Response Success (200)

```json
{
  "message": "Video sources retrieved successfully",
  "total": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439023",
      "movieId": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Friends"
      },
      "episodeId": "507f1f77bcf86cd799439013",
      "quality": 1080,
      "format": "mp4",
      "url": "https://moviefly-cdn.b-cdn.net/videos/1735689602000-friends-s01e01-1080p.mp4",
      "cdn_region": "us",
      "file_size_mb": 2048,
      "is_default": true
    }
  ]
}
```

---

## 6. Lấy Default Video Source (GET)

**Endpoint:** `GET /api/video-sources/default`

### Example URL - Lấy default cho Movie

```
GET /api/video-sources/default?movieId=507f1f77bcf86cd799439011
```

### Example URL - Lấy default cho Episode

```
GET /api/video-sources/default?movieId=507f1f77bcf86cd799439012&episodeId=507f1f77bcf86cd799439013
```

### Response Success (200)

```json
{
  "message": "Default video source retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "movieId": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Avengers: Endgame",
      "slug": "avengers-endgame"
    },
    "episodeId": null,
    "quality": 2160,
    "format": "mp4",
    "url": "https://moviefly-cdn.b-cdn.net/videos/1735689600000-avengers-endgame-4k.mp4",
    "cdn_region": "vn",
    "file_size_mb": 15360,
    "is_default": true,
    "createdAt": "2026-07-01T00:00:00.000Z",
    "updatedAt": "2026-07-01T00:00:00.000Z"
  }
}
```

### Response Not Found (404)

```json
{
  "message": "Default video source not found"
}
```

---

## 7. Lấy Video Sources Theo Quality (GET)

**Endpoint:** `GET /api/video-sources/quality/:quality`

### Example URL - Lấy tất cả video 1080p

```
GET /api/video-sources/quality/1080
```

### Response Success (200)

```json
{
  "message": "Video sources retrieved successfully",
  "total": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439021",
      "movieId": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Avengers: Endgame"
      },
      "episodeId": null,
      "quality": 1080,
      "format": "mp4",
      "url": "https://moviefly-cdn.b-cdn.net/videos/1735689601000-avengers-endgame-1080p.mp4",
      "cdn_region": "vn",
      "file_size_mb": 4096,
      "is_default": false
    }
  ]
}
```

---

## 8. Cập Nhật Video Source (PUT)

**Endpoint:** `PUT /api/video-sources/:id`

**Content-Type:** `multipart/form-data`

### Request Form-Data - Chỉ cập nhật metadata (không upload video mới)

| Key | Type | Value |
|-----|------|-------|
| `cdn_region` | Text | sg |
| `is_default` | Text | true |

### Request Form-Data - Upload video mới (replace video cũ)

| Key | Type | Value |
|-----|------|-------|
| `video` | File | avengers-endgame-4k-remastered.mp4 |
| `format` | Text | mp4 |
| `cdn_region` | Text | sg |

### Postman Setup:
1. Select **PUT** method
2. URL: `http://localhost:5000/api/video-sources/507f1f77bcf86cd799439020`
3. Go to **Body** tab
4. Select **form-data**
5. Add fields (video file is optional for update)

### cURL Example - Update metadata only:

```bash
curl -X PUT http://localhost:5000/api/video-sources/507f1f77bcf86cd799439020 \
  -F "cdn_region=sg" \
  -F "is_default=true"
```

### cURL Example - Replace video:

```bash
curl -X PUT http://localhost:5000/api/video-sources/507f1f77bcf86cd799439020 \
  -F "video=@/path/to/new-video.mp4" \
  -F "format=mp4" \
  -F "cdn_region=sg"
```

### Response Success (200)

```json
{
  "message": "Video source updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "movieId": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Avengers: Endgame"
    },
    "episodeId": null,
    "quality": 2160,
    "format": "mp4",
    "url": "https://moviefly-cdn.b-cdn.net/videos/1735689700000-avengers-endgame-4k-new.mp4",
    "bunny_file_path": "videos/1735689700000-avengers-endgame-4k-new.mp4",
    "bunny_storage_zone": "study-storage-2026",
    "cdn_region": "sg",
    "file_size_mb": 14800,
    "is_default": false,
    "createdAt": "2026-07-01T00:00:00.000Z",
    "updatedAt": "2026-07-01T10:30:00.000Z"
  }
}
```

**Lưu ý:**
- Nếu upload video mới: Video cũ trên Bunny CDN sẽ bị xóa tự động
- Quality và file_size_mb sẽ được detect lại từ video mới
- Nếu không upload video: Chỉ update metadata (cdn_region, is_default, format)

---

## 9. Xóa Video Source Theo ID (DELETE)

**Endpoint:** `DELETE /api/video-sources/:id`

### Example URL

```
DELETE /api/video-sources/507f1f77bcf86cd799439025
```

### Response Success (200)

```json
{
  "message": "Video source deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439025",
    "movieId": "507f1f77bcf86cd799439011",
    "episodeId": null,
    "quality": 480,
    "format": "mp4",
    "url": "https://moviefly-cdn.b-cdn.net/videos/1735689603000-avengers-endgame-480p.mp4",
    "cdn_region": "vn",
    "file_size_mb": 850,
    "is_default": false
  }
}
```

**Lưu ý:** Video trên Bunny CDN sẽ bị xóa đồng thời với record trong MongoDB

---

## 10. Xóa Tất Cả Video Sources Theo Movie ID (DELETE)

**Endpoint:** `DELETE /api/video-sources/movie/:movieId`

### Example URL

```
DELETE /api/video-sources/movie/507f1f77bcf86cd799439011
```

### Response Success (200)

```json
{
  "message": "Video sources deleted successfully",
  "deletedCount": 4
}
```

**Lưu ý:** Tất cả video files trên Bunny CDN của movie này sẽ bị xóa

---

## 11. Xóa Tất Cả Video Sources Theo Episode ID (DELETE)

**Endpoint:** `DELETE /api/video-sources/episode/:episodeId`

### Example URL

```
DELETE /api/video-sources/episode/507f1f77bcf86cd799439013
```

### Response Success (200)

```json
{
  "message": "Video sources deleted successfully",
  "deletedCount": 3
}
```

**Lưu ý:** Tất cả video files trên Bunny CDN của episode này sẽ bị xóa

---

## Error Responses

### 400 - Bad Request

```json
{
  "message": "movieId, format, and cdn_region are required"
}
```

```json
{
  "message": "Video file is required"
}
```

```json
{
  "message": "movieId or episodeId is required"
}
```

```json
{
  "message": "Video source ID is required"
}
```

### 404 - Not Found

```json
{
  "message": "Video source not found"
}
```

```json
{
  "message": "Default video source not found"
}
```

### 500 - Internal Server Error

```json
{
  "message": "Failed to upload video to CDN"
}
```

```json
{
  "message": "Failed to read video metadata"
}
```

```json
{
  "message": "Internal Server Error"
}
```

---

## Hướng Dẫn Test với Postman

### Setup Postman Collection

#### 1. Create Video Source (POST)
```
Method: POST
URL: http://localhost:5000/api/video-sources
Body: form-data
  - video: [Select File] → Choose .mp4 file
  - movieId: 507f1f77bcf86cd799439011
  - format: mp4
  - cdn_region: vn
  - is_default: true
```

#### 2. Get All Video Sources (GET)
```
Method: GET
URL: http://localhost:5000/api/video-sources
```

#### 3. Get Video Source by ID (GET)
```
Method: GET
URL: http://localhost:5000/api/video-sources/{{videoSourceId}}
```

#### 4. Get by Movie ID (GET)
```
Method: GET
URL: http://localhost:5000/api/video-sources/movie/{{movieId}}
```

#### 5. Get by Episode ID (GET)
```
Method: GET
URL: http://localhost:5000/api/video-sources/episode/{{episodeId}}
```

#### 6. Get Default Source (GET)
```
Method: GET
URL: http://localhost:5000/api/video-sources/default?movieId={{movieId}}
```

#### 7. Get by Quality (GET)
```
Method: GET
URL: http://localhost:5000/api/video-sources/quality/1080
```

#### 8. Update Video Source - Metadata only (PUT)
```
Method: PUT
URL: http://localhost:5000/api/video-sources/{{videoSourceId}}
Body: form-data
  - cdn_region: sg
  - is_default: true
```

#### 9. Update Video Source - Replace video (PUT)
```
Method: PUT
URL: http://localhost:5000/api/video-sources/{{videoSourceId}}
Body: form-data
  - video: [Select File] → Choose new .mp4 file
  - format: mp4
  - cdn_region: sg
```

#### 10. Delete Video Source (DELETE)
```
Method: DELETE
URL: http://localhost:5000/api/video-sources/{{videoSourceId}}
```

#### 11. Delete by Movie ID (DELETE)
```
Method: DELETE
URL: http://localhost:5000/api/video-sources/movie/{{movieId}}
```

#### 12. Delete by Episode ID (DELETE)
```
Method: DELETE
URL: http://localhost:5000/api/video-sources/episode/{{episodeId}}
```

---

## Ghi Chú Quan Trọng

### Auto-Detection Features

1. **Quality Detection**: Tự động detect dựa trên video resolution
   - 2160p (4K): height >= 2160
   - 1080p (Full HD): height >= 1080
   - 720p (HD): height >= 720
   - 480p (SD): height >= 480
   - 360p: height < 480

2. **File Size**: Tự động tính từ video buffer (in MB)

3. **Bunny CDN Integration**:
   - Upload tự động lên Bunny CDN
   - Generate CDN URL tự động
   - Lưu file path và storage zone
   - Xóa file cũ khi update hoặc delete

### Video Requirements

- **Max File Size**: 500MB
- **Supported Formats**: mp4, mkv, avi, mov, flv, wmv, webm, mpeg, 3gp, vob, ogv, ts, m4v
- **Supported MIME Types**: 
  - video/mp4
  - video/x-matroska (mkv)
  - video/avi
  - video/quicktime (mov)
  - video/x-flv
  - video/x-ms-wmv
  - video/webm
  - video/mpeg
  - video/3gpp

### is_default Behavior

- Khi set `is_default: true`, tất cả video sources khác của cùng movieId/episodeId sẽ tự động chuyển thành `false`
- Mỗi movie/episode chỉ có 1 video source default tại một thời điểm

### CDN Region Values

- `vn` - Vietnam
- `sg` - Singapore  
- `us` - United States
- `eu` - Europe
- `jp` - Japan
- `kr` - Korea

### Workflow Summary

```
1. Upload Video → Postman form-data
2. Server receives file → Read video metadata (ffmpeg)
3. Detect quality & calculate size → Auto-populate
4. Upload to Bunny CDN → Get CDN URL
5. Save to MongoDB → Include all metadata
6. Return response → With CDN URL

When Delete:
1. Get video source from MongoDB
2. Delete from Bunny CDN first
3. Delete from MongoDB
4. Return success response
```

### Testing Tips

1. **Prepare Test Videos**: Có sẵn các video với resolution khác nhau (360p, 480p, 720p, 1080p, 2160p) để test auto-detection
2. **Check Bunny CDN**: Sau khi upload, kiểm tra file đã lên Bunny CDN chưa
3. **Test Delete**: Verify file đã bị xóa khỏi Bunny CDN sau khi delete
4. **Test Update**: Upload video mới và check video cũ đã bị xóa chưa
5. **Test Default**: Tạo nhiều sources và test chỉ có 1 default

### Environment Variables Required

```env
BUNNY_STORAGE_HOST=https://storage.bunnycdn.com
BUNNY_STORAGE_API_KEY=your-api-key
BUNNY_STORAGE_ZONE=study-storage-2026
BUNNY_PULL_ZONE=moviefly-cdn
```
