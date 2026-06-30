# Movies API - Postman Test Guide

## Base URL
```
http://localhost:3000/api/movies
```

---

## 1. GET All Movies (with pagination and filters)

**Method:** GET  
**URL:** `http://localhost:3000/api/movies`

### Query Parameters (all optional):
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (draft/published/archived)
- `type`: Filter by type (movie/series)
- `is_featured`: Filter featured (true/false)
- `is_free`: Filter free content (true/false)

### Example URLs:
```
GET http://localhost:3000/api/movies?page=1&limit=5
GET http://localhost:3000/api/movies?status=published&type=movie
GET http://localhost:3000/api/movies?is_featured=true&is_free=false
```

---

## 2. GET Movie by ID

**Method:** GET  
**URL:** `http://localhost:3000/api/movies/:id`

### Example:
```
GET http://localhost:3000/api/movies/677349c8f1a2b3c4d5e6f7a8
```

---

## 3. CREATE Movie (with file uploads)

**Method:** POST  
**URL:** `http://localhost:3000/api/movies`  
**Content-Type:** `multipart/form-data`

### Form Data Fields:

#### Text Fields (in Body > form-data):
```
title: Doraemon: Nobita và Bản Giao Hưởng Địa Cầu
original_title: Doraemon: Nobita's Earth Symphony
type: movie
status: published
synopsis: Nobita và những người bạn khám phá sức mạnh của âm nhạc để cứu Trái Đất
tagline: Hòa nhạc vũ trụ bắt đầu
release_date: 2024-03-01
country_code: JP
language: vi
duration_min: 115
rating: 7.5
imdb_id: tt28623912
imdb_score: 7.8
is_featured: true
is_free: false
```

#### File Fields (in Body > form-data, select "File" type):
- `poster`: [Select image file - .jpg, .png, etc.]
- `backdrop`: [Select image file - .jpg, .png, etc.]
- `trailer`: [Select video file - .mp4, .mov, etc.]

### Postman Steps:
1. Select POST method
2. Enter URL: `http://localhost:3000/api/movies`
3. Go to Body tab
4. Select "form-data"
5. Add all text fields as "Text" type
6. Add file fields as "File" type and browse to select files
7. Click Send

---

## 4. UPDATE Movie (with optional file updates)

**Method:** PUT  
**URL:** `http://localhost:3000/api/movies/:id`  
**Content-Type:** `multipart/form-data`

### Example URL:
```
PUT http://localhost:3000/api/movies/677349c8f1a2b3c4d5e6f7a8
```

### Form Data Fields (all optional):

#### Text Fields:
```
title: Doraemon: Nobita và Bản Giao Hưởng Địa Cầu - Updated
status: archived
rating: 8.0
is_featured: false
```

#### File Fields (optional, only if you want to update):
- `poster`: [New image file]
- `backdrop`: [New image file]
- `trailer`: [New video file]

### Notes:
- Only include fields you want to update
- If you upload new files, old files will be deleted from Bunny CDN automatically
- Slug auto-generates if you update title

---

## 5. DELETE Movie

**Method:** DELETE  
**URL:** `http://localhost:3000/api/movies/:id`

### Example:
```
DELETE http://localhost:3000/api/movies/677349c8f1a2b3c4d5e6f7a8
```

### Notes:
- Deletes movie from MongoDB
- Automatically deletes poster, backdrop, and trailer from Bunny CDN

---

## Sample Response Formats

### Success Response (GET All):
```json
{
  "message": "Movies retrieved successfully",
  "data": [
    {
      "_id": "677349c8f1a2b3c4d5e6f7a8",
      "title": "Doraemon: Nobita và Bản Giao Hưởng Địa Cầu",
      "original_title": "Doraemon: Nobita's Earth Symphony",
      "slug": "doraemon-nobita-va-ban-giao-huong-dia-cau",
      "type": "movie",
      "status": "published",
      "synopsis": "Nobita và những người bạn khám phá sức mạnh của âm nhạc để cứu Trái Đất",
      "tagline": "Hòa nhạc vũ trụ bắt đầu",
      "poster_url": "https://study-videos-storage.b-cdn.net/movies/posters/1735649736123-poster.jpg",
      "poster_path": "movies/posters/1735649736123-poster.jpg",
      "backdrop_url": "https://study-videos-storage.b-cdn.net/movies/backdrops/1735649736124-backdrop.jpg",
      "backdrop_path": "movies/backdrops/1735649736124-backdrop.jpg",
      "trailer_url": "https://study-videos-storage.b-cdn.net/movies/trailers/1735649736125-trailer.mp4",
      "trailer_path": "movies/trailers/1735649736125-trailer.mp4",
      "release_date": "2024-03-01T00:00:00.000Z",
      "country_code": "JP",
      "language": "vi",
      "duration_min": 115,
      "rating": 7.5,
      "imdb_id": "tt28623912",
      "imdb_score": 7.8,
      "view_count": 0,
      "like_count": 0,
      "is_featured": true,
      "is_free": false,
      "createdAt": "2026-06-30T10:30:00.000Z",
      "updatedAt": "2026-06-30T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Success Response (CREATE):
```json
{
  "message": "Movie created successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7a8",
    "title": "Doraemon: Nobita và Bản Giao Hưởng Địa Cầu",
    "slug": "doraemon-nobita-va-ban-giao-huong-dia-cau",
    "poster_url": "https://study-videos-storage.b-cdn.net/movies/posters/1735649736123-poster.jpg",
    ...
  }
}
```

### Error Response:
```json
{
  "message": "Movie with the same slug already exists"
}
```

---

## Important Notes

1. **File Size Limits:**
   - Max file size: 100MB per file
   - Poster/Backdrop: Image files only (jpg, png, webp, etc.)
   - Trailer: Video files only (mp4, mov, avi, etc.)

2. **Slug Generation:**
   - Auto-generated from title if not provided
   - Handles Vietnamese characters (đ→d, removes accents)
   - Example: "Doraemon: Nobita và Bản Giao Hưởng" → "doraemon-nobita-va-ban-giao-huong"

3. **File Upload to Bunny CDN:**
   - Poster → `movies/posters/` folder
   - Backdrop → `movies/backdrops/` folder
   - Trailer → `movies/trailers/` folder
   - Files automatically deleted from CDN when movie is updated or deleted

4. **Default Values:**
   - type: "movie"
   - status: "draft"
   - All numeric fields: 0
   - is_featured: false
   - is_free: false

5. **Enum Values:**
   - **type:** "movie" or "series"
   - **status:** "draft", "published", or "archived"
