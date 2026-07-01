# Subtitles API - Postman Test Collection

Base URL: `http://localhost:3000/api/subtitles`

---

## 1. GET All Subtitles
**Endpoint:** `GET /api/subtitles`

**Description:** Lấy tất cả danh sách phụ đề

**Response Success (200):**
```json
{
  "message": "Subtitles retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "movieId": {
        "_id": "507f1f77bcf86cd799439001",
        "title": "Forrest Gump"
      },
      "episodeId": {
        "_id": "507f1f77bcf86cd799439051",
        "title": "Episode 1"
      },
      "language": "vi",
      "label": "Tiếng Việt",
      "url": "https://study-videos-storage.b-cdn.net/subtitles/1234567890-vi.srt",
      "format": "srt",
      "createdAt": "2026-07-01T10:30:00.000Z",
      "updatedAt": "2026-07-01T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 2. GET Subtitle By ID
**Endpoint:** `GET /api/subtitles/:id`

**Description:** Lấy thông tin phụ đề theo ID

**Example:** `GET /api/subtitles/507f1f77bcf86cd799439011`

**Response Success (200):**
```json
{
  "message": "Subtitle retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "movieId": {
      "_id": "507f1f77bcf86cd799439001",
      "title": "Forrest Gump"
    },
    "episodeId": {
      "_id": "507f1f77bcf86cd799439051",
      "title": "Episode 1"
    },
    "language": "vi",
    "label": "Tiếng Việt",
    "url": "https://study-videos-storage.b-cdn.net/subtitles/1234567890-vi.srt",
    "format": "srt",
    "createdAt": "2026-07-01T10:30:00.000Z",
    "updatedAt": "2026-07-01T10:30:00.000Z"
  }
}
```

**Response Error (404):**
```json
{
  "message": "Subtitle not found"
}
```

---

## 3. GET Subtitles By Movie ID
**Endpoint:** `GET /api/subtitles/movie/:movieId`

**Description:** Lấy tất cả phụ đề của một phim

**Example:** `GET /api/subtitles/movie/507f1f77bcf86cd799439001`

**Response Success (200):**
```json
{
  "message": "Subtitles retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "movieId": "507f1f77bcf86cd799439001",
      "episodeId": {
        "_id": "507f1f77bcf86cd799439051",
        "title": "Episode 1"
      },
      "language": "vi",
      "label": "Tiếng Việt",
      "url": "https://...",
      "format": "srt"
    }
  ],
  "total": 1
}
```

---

## 4. GET Subtitles By Episode ID
**Endpoint:** `GET /api/subtitles/episode/:episodeId`

**Description:** Lấy tất cả phụ đề của một episode

**Example:** `GET /api/subtitles/episode/507f1f77bcf86cd799439051`

**Response Success (200):**
```json
{
  "message": "Subtitles retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "movieId": {
        "_id": "507f1f77bcf86cd799439001",
        "title": "Forrest Gump"
      },
      "episodeId": "507f1f77bcf86cd799439051",
      "language": "vi",
      "label": "Tiếng Việt",
      "url": "https://...",
      "format": "srt"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "movieId": {
        "_id": "507f1f77bcf86cd799439001",
        "title": "Forrest Gump"
      },
      "episodeId": "507f1f77bcf86cd799439051",
      "language": "en",
      "label": "English",
      "url": "https://...",
      "format": "vtt"
    }
  ],
  "total": 2
}
```

---

## 5. CREATE Subtitle
**Endpoint:** `POST /api/subtitles`

**Description:** Tạo phụ đề mới (upload file .srt hoặc .vtt lên Bunny CDN)

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
- `movieId` (text, required): ID của phim
- `episodeId` (text, required): ID của episode
- `language` (text, required): Mã ngôn ngữ (vi, en, ja, ko, v.v.)
- `label` (text, required): Tên hiển thị (Tiếng Việt, English, 日本語, v.v.)
- `format` (text, optional): Format file (srt hoặc vtt, default: srt)
- `subtitle` (file, required): File phụ đề (.srt hoặc .vtt, max 5MB)

**Example Form Data:**
```
movieId: 507f1f77bcf86cd799439001
episodeId: 507f1f77bcf86cd799439051
language: vi
label: Tiếng Việt
format: srt
subtitle: [Select file: vietnamese.srt]
```

**Response Success (201):**
```json
{
  "message": "Subtitle created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "movieId": {
      "_id": "507f1f77bcf86cd799439001",
      "title": "Forrest Gump"
    },
    "episodeId": {
      "_id": "507f1f77bcf86cd799439051",
      "title": "Episode 1"
    },
    "language": "vi",
    "label": "Tiếng Việt",
    "url": "https://study-videos-storage.b-cdn.net/subtitles/1234567890-vietnamese.srt",
    "format": "srt",
    "createdAt": "2026-07-01T10:30:00.000Z",
    "updatedAt": "2026-07-01T10:30:00.000Z"
  }
}
```

**Response Error (400) - Missing Fields:**
```json
{
  "message": "movieId, episodeId, language and label are required"
}
```

**Response Error (400) - Missing File:**
```json
{
  "message": "Subtitle file is required"
}
```

**Response Error (400) - Invalid Format:**
```json
{
  "message": "Invalid format. Must be: srt or vtt"
}
```

---

## 6. UPDATE Subtitle
**Endpoint:** `PUT /api/subtitles/:id`

**Description:** Cập nhật phụ đề (nếu có file mới thì xóa file cũ và upload file mới)

**Example:** `PUT /api/subtitles/507f1f77bcf86cd799439011`

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data (tất cả optional):**
- `language` (text): Mã ngôn ngữ mới
- `label` (text): Tên hiển thị mới
- `format` (text): Format mới (srt hoặc vtt)
- `subtitle` (file): File phụ đề mới (nếu có sẽ xóa file cũ)

**Example Form Data:**
```
label: Vietnamese (Updated)
subtitle: [Select new file: vietnamese-updated.srt]
```

**Response Success (200):**
```json
{
  "message": "Subtitle updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "movieId": { ... },
    "episodeId": { ... },
    "language": "vi",
    "label": "Vietnamese (Updated)",
    "url": "https://study-videos-storage.b-cdn.net/subtitles/1234567891-vietnamese-updated.srt",
    "format": "srt",
    "updatedAt": "2026-07-01T11:00:00.000Z"
  }
}
```

**Response Error (404):**
```json
{
  "message": "Subtitle not found"
}
```

---

## 7. DELETE Subtitle
**Endpoint:** `DELETE /api/subtitles/:id`

**Description:** Xóa phụ đề (xóa file từ Bunny CDN trước, sau đó xóa record)

**Example:** `DELETE /api/subtitles/507f1f77bcf86cd799439011`

**Response Success (200):**
```json
{
  "message": "Subtitle deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "movieId": "507f1f77bcf86cd799439001",
    "episodeId": "507f1f77bcf86cd799439051",
    "language": "vi",
    "label": "Tiếng Việt",
    "url": "https://study-videos-storage.b-cdn.net/subtitles/1234567890-vietnamese.srt",
    "format": "srt"
  }
}
```

**Response Error (404):**
```json
{
  "message": "Subtitle not found"
}
```

---

## 8. DELETE All Subtitles By Episode ID
**Endpoint:** `DELETE /api/subtitles/episode/:episodeId`

**Description:** Xóa tất cả phụ đề của một episode (xóa tất cả files từ Bunny CDN)

**Example:** `DELETE /api/subtitles/episode/507f1f77bcf86cd799439051`

**Response Success (200):**
```json
{
  "message": "Subtitles deleted successfully",
  "deletedCount": 3
}
```

---

## Sample Test Data

### 1. Vietnamese Subtitle (SRT)
```
movieId: YOUR_MOVIE_ID
episodeId: YOUR_EPISODE_ID
language: vi
label: Tiếng Việt
format: srt
subtitle: [Upload vietnamese.srt file]
```

**Sample vietnamese.srt content:**
```
1
00:00:01,000 --> 00:00:04,000
Xin chào, tên tôi là Forrest Gump.

2
00:00:04,500 --> 00:00:08,000
Mẹ tôi luôn nói: "Đời như hộp sô-cô-la."
```

### 2. English Subtitle (VTT)
```
movieId: YOUR_MOVIE_ID
episodeId: YOUR_EPISODE_ID
language: en
label: English
format: vtt
subtitle: [Upload english.vtt file]
```

**Sample english.vtt content:**
```
WEBVTT

00:00:01.000 --> 00:00:04.000
Hello, my name is Forrest Gump.

00:00:04.500 --> 00:00:08.000
Mama always said: "Life is like a box of chocolates."
```

### 3. Japanese Subtitle
```
movieId: YOUR_MOVIE_ID
episodeId: YOUR_EPISODE_ID
language: ja
label: 日本語
format: srt
subtitle: [Upload japanese.srt file]
```

### 4. Korean Subtitle
```
movieId: YOUR_MOVIE_ID
episodeId: YOUR_EPISODE_ID
language: ko
label: 한국어
format: srt
subtitle: [Upload korean.srt file]
```

### 5. Chinese Subtitle
```
movieId: YOUR_MOVIE_ID
episodeId: YOUR_EPISODE_ID
language: zh
label: 中文
format: srt
subtitle: [Upload chinese.srt file]
```

---

## Language Codes Reference

| Code | Language |
|------|----------|
| vi | Tiếng Việt (Vietnamese) |
| en | English |
| ja | 日本語 (Japanese) |
| ko | 한국어 (Korean) |
| zh | 中文 (Chinese) |
| th | ไทย (Thai) |
| fr | Français (French) |
| de | Deutsch (German) |
| es | Español (Spanish) |
| pt | Português (Portuguese) |

---

## Test Flow

1. **Chuẩn bị:** Tạo trước Movies và Episodes
2. **Chuẩn bị files:** Tạo các file .srt hoặc .vtt để test
3. **Test CREATE:** Upload phụ đề tiếng Việt
4. **Test CREATE multiple:** Upload phụ đề tiếng Anh cho cùng episode
5. **Test GET by Episode ID:** Lấy tất cả phụ đề của episode
6. **Test GET by Movie ID:** Lấy tất cả phụ đề của phim
7. **Test UPDATE:** Cập nhật label hoặc upload file mới
8. **Test DELETE single:** Xóa 1 phụ đề
9. **Test DELETE by Episode ID:** Xóa tất cả phụ đề của episode

---

## Notes

- **Format hỗ trợ:** .srt và .vtt
- **Max file size:** 5MB
- **Folder trên Bunny:** `subtitles/`
- **Xóa file cũ:** Khi UPDATE với file mới hoặc DELETE, file cũ sẽ bị xóa khỏi Bunny CDN
- **Multiple subtitles:** Một episode có thể có nhiều phụ đề (nhiều ngôn ngữ)
- **Language code:** Dùng ISO 639-1 (2 ký tự) như vi, en, ja, ko, zh
