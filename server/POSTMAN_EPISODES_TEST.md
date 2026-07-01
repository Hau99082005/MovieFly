# Episodes API - Postman Test Guide

## Base URL
```
http://localhost:3000/api/episodes
```

---

## 1. GET All Episodes

**Method:** GET  
**URL:** `http://localhost:3000/api/episodes`

### Query Parameters (optional):
- `movieId`: Filter by movie ID
- `seasonId`: Filter by season ID

### Example:
```
GET http://localhost:3000/api/episodes
GET http://localhost:3000/api/episodes?seasonId=677349c8f1a2b3c4d5e6f7a9
GET http://localhost:3000/api/episodes?movieId=677349c8f1a2b3c4d5e6f7aa
```

### Response Success:
```json
{
  "message": "Episodes retrieved successfully",
  "data": [
    {
      "_id": "677349c8f1a2b3c4d5e6f7b1",
      "movieId": {
        "_id": "677349c8f1a2b3c4d5e6f7aa",
        "title": "Stranger Things"
      },
      "seasonId": {
        "_id": "677349c8f1a2b3c4d5e6f7a9",
        "seasonNumber": 1,
        "title": "Season 1"
      },
      "episodeNumber": 1,
      "title": "Chapter One: The Vanishing of Will Byers",
      "synopsis": "On his way home from a friend's house, young Will sees something terrifying...",
      "thumbnailUrl": "https://study-videos-storage.b-cdn.net/episodes/thumbnails/...",
      "thumbnail_path": "episodes/thumbnails/...",
      "thumbnail_storage_zone": "study-storage-2026",
      "durationSeconds": 2880,
      "releaseDate": "2016-07-15T00:00:00.000Z",
      "viewCount": 1250,
      "isFree": true,
      "createdAt": "2026-06-30T10:30:00.000Z",
      "updatedAt": "2026-06-30T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 2. GET Episodes by Season ID

**Method:** GET  
**URL:** `http://localhost:3000/api/episodes/season/:seasonId`

### Example:
```
GET http://localhost:3000/api/episodes/season/677349c8f1a2b3c4d5e6f7a9
```

### Response Success:
```json
{
  "message": "Episodes retrieved successfully",
  "data": [
    {
      "_id": "677349c8f1a2b3c4d5e6f7b1",
      "episodeNumber": 1,
      "title": "Chapter One: The Vanishing of Will Byers",
      "durationSeconds": 2880,
      "thumbnailUrl": "https://...",
      "viewCount": 1250
    },
    {
      "_id": "677349c8f1a2b3c4d5e6f7b2",
      "episodeNumber": 2,
      "title": "Chapter Two: The Weirdo on Maple Street",
      "durationSeconds": 3360,
      "thumbnailUrl": "https://...",
      "viewCount": 980
    }
  ],
  "total": 2
}
```

---

## 3. GET Episode by ID

**Method:** GET  
**URL:** `http://localhost:3000/api/episodes/:id`

### Example:
```
GET http://localhost:3000/api/episodes/677349c8f1a2b3c4d5e6f7b1
```

### Response Success:
```json
{
  "message": "Episode retrieved successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7b1",
    "movieId": {
      "_id": "677349c8f1a2b3c4d5e6f7aa",
      "title": "Stranger Things",
      "type": "series"
    },
    "seasonId": {
      "_id": "677349c8f1a2b3c4d5e6f7a9",
      "seasonNumber": 1,
      "title": "Season 1"
    },
    "episodeNumber": 1,
    "title": "Chapter One: The Vanishing of Will Byers",
    "synopsis": "On his way home from a friend's house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.",
    "thumbnailUrl": "https://...",
    "durationSeconds": 2880,
    "releaseDate": "2016-07-15T00:00:00.000Z",
    "viewCount": 1250,
    "isFree": true
  }
}
```

---

## 4. CREATE Episode (with thumbnail upload)

**Method:** POST  
**URL:** `http://localhost:3000/api/episodes`  
**Content-Type:** `multipart/form-data`

### Form Data Fields:

#### Text Fields:
```
movieId: 677349c8f1a2b3c4d5e6f7aa
seasonId: 677349c8f1a2b3c4d5e6f7a9
episodeNumber: 1
title: Chapter One: The Vanishing of Will Byers
synopsis: On his way home from a friend's house, young Will sees something terrifying...
durationSeconds: 2880
releaseDate: 2016-07-15
viewCount: 0
isFree: true
```

#### File Field:
```
thumbnail: [Select image file - .jpg, .png, etc.]
```

### Postman Steps:
1. Select POST method
2. Enter URL: `http://localhost:3000/api/episodes`
3. Go to Body tab
4. Select "form-data"
5. Add all text fields as "Text" type
6. Add `thumbnail` field as "File" type
7. Click Send

### Response Success:
```json
{
  "message": "Episode created successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7b1",
    "movieId": {
      "_id": "677349c8f1a2b3c4d5e6f7aa",
      "title": "Stranger Things"
    },
    "seasonId": {
      "_id": "677349c8f1a2b3c4d5e6f7a9",
      "seasonNumber": 1,
      "title": "Season 1"
    },
    "episodeNumber": 1,
    "title": "Chapter One: The Vanishing of Will Byers",
    "synopsis": "On his way home...",
    "thumbnailUrl": "https://study-videos-storage.b-cdn.net/episodes/thumbnails/...",
    "thumbnail_path": "episodes/thumbnails/...",
    "thumbnail_storage_zone": "study-storage-2026",
    "durationSeconds": 2880,
    "releaseDate": "2016-07-15T00:00:00.000Z",
    "viewCount": 0,
    "isFree": true,
    "createdAt": "2026-06-30T10:30:00.000Z"
  }
}
```

### Response Error (Duplicate):
```json
{
  "message": "Episode number already exists for this season"
}
```

---

## 5. UPDATE Episode

**Method:** PUT  
**URL:** `http://localhost:3000/api/episodes/:id`  
**Content-Type:** `multipart/form-data`

### Example URL:
```
PUT http://localhost:3000/api/episodes/677349c8f1a2b3c4d5e6f7b1
```

### Form Data Fields (all optional):
```
title: Chapter One: The Vanishing of Will Byers - Updated
synopsis: Updated synopsis...
durationSeconds: 3000
viewCount: 1500
thumbnail: [New image file - optional]
```

### Response Success:
```json
{
  "message": "Episode updated successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7b1",
    "title": "Chapter One: The Vanishing of Will Byers - Updated",
    "thumbnailUrl": "https://...",
    "viewCount": 1500,
    "updatedAt": "2026-06-30T11:00:00.000Z"
  }
}
```

---

## 6. INCREMENT View Count

**Method:** PATCH  
**URL:** `http://localhost:3000/api/episodes/:id/view`

### Example:
```
PATCH http://localhost:3000/api/episodes/677349c8f1a2b3c4d5e6f7b1/view
```

### Notes:
- No body required
- Increments viewCount by 1
- Use when user watches episode

### Response Success:
```json
{
  "message": "View count incremented",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7b1",
    "title": "Chapter One: The Vanishing of Will Byers",
    "viewCount": 1251
  }
}
```

---

## 7. DELETE Episode

**Method:** DELETE  
**URL:** `http://localhost:3000/api/episodes/:id`

### Example:
```
DELETE http://localhost:3000/api/episodes/677349c8f1a2b3c4d5e6f7b1
```

### Notes:
- Deletes episode from MongoDB
- Automatically deletes thumbnail from Bunny CDN

### Response Success:
```json
{
  "message": "Episode deleted successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7b1",
    "episodeNumber": 1,
    "title": "Chapter One: The Vanishing of Will Byers"
  }
}
```

---

## 8. DELETE All Episodes for a Season

**Method:** DELETE  
**URL:** `http://localhost:3000/api/episodes/season/:seasonId`

### Example:
```
DELETE http://localhost:3000/api/episodes/season/677349c8f1a2b3c4d5e6f7a9
```

### Notes:
- Deletes all episodes for the season
- Automatically deletes all thumbnails from Bunny CDN

### Response Success:
```json
{
  "message": "All episodes deleted successfully",
  "deletedCount": 8
}
```

---

## Complete Test Flow (Stranger Things Example)

### Step 1: Create Series Movie
```
POST http://localhost:3000/api/movies
Body: title, type: series, status: published
Save movieId: 677349c8f1a2b3c4d5e6f7aa
```

### Step 2: Create Season 1
```
POST http://localhost:3000/api/seasons
Body: movieId, seasonNumber: 1, title: Season 1
Save seasonId: 677349c8f1a2b3c4d5e6f7a9
```

### Step 3: Create Episode 1
```
POST http://localhost:3000/api/episodes
Body (form-data):
- movieId: 677349c8f1a2b3c4d5e6f7aa
- seasonId: 677349c8f1a2b3c4d5e6f7a9
- episodeNumber: 1
- title: Chapter One: The Vanishing of Will Byers
- synopsis: On his way home from a friend's house...
- durationSeconds: 2880
- releaseDate: 2016-07-15
- isFree: true
- thumbnail: [image file]
```

### Step 4: Create Episode 2-8
Repeat step 3 with different episodeNumbers and titles

### Step 5: Get All Episodes for Season 1
```
GET http://localhost:3000/api/episodes/season/677349c8f1a2b3c4d5e6f7a9
```

### Step 6: Increment View Count (User watches episode)
```
PATCH http://localhost:3000/api/episodes/677349c8f1a2b3c4d5e6f7b1/view
```

### Step 7: Update Episode
```
PUT http://localhost:3000/api/episodes/677349c8f1a2b3c4d5e6f7b1
Body: title, synopsis, new thumbnail
```

### Step 8: Delete Episode
```
DELETE http://localhost:3000/api/episodes/677349c8f1a2b3c4d5e6f7b1
```

---

## Sample Test Data (Stranger Things Season 1)

### Episode 1:
```json
{
  "movieId": "677349c8f1a2b3c4d5e6f7aa",
  "seasonId": "677349c8f1a2b3c4d5e6f7a9",
  "episodeNumber": 1,
  "title": "Chapter One: The Vanishing of Will Byers",
  "synopsis": "On his way home from a friend's house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.",
  "durationSeconds": 2880,
  "releaseDate": "2016-07-15",
  "isFree": true
}
```

### Episode 2:
```json
{
  "movieId": "677349c8f1a2b3c4d5e6f7aa",
  "seasonId": "677349c8f1a2b3c4d5e6f7a9",
  "episodeNumber": 2,
  "title": "Chapter Two: The Weirdo on Maple Street",
  "synopsis": "Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about an unsettling phone call.",
  "durationSeconds": 3360,
  "releaseDate": "2016-07-15",
  "isFree": true
}
```

### Episode 3:
```json
{
  "movieId": "677349c8f1a2b3c4d5e6f7aa",
  "seasonId": "677349c8f1a2b3c4d5e6f7a9",
  "episodeNumber": 3,
  "title": "Chapter Three: Holly, Jolly",
  "synopsis": "An increasingly concerned Nancy looks for Barb and finds out what Jonathan's been up to. Joyce is convinced Will is trying to talk to her.",
  "durationSeconds": 3060,
  "releaseDate": "2016-07-15",
  "isFree": false
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "movieId, seasonId, episodeNumber and title are required"
}
```

### 404 Not Found
```json
{
  "message": "Episode not found"
}
```

### 409 Conflict
```json
{
  "message": "Episode number already exists for this season"
}
```

---

## Use Cases

### 1. List Episodes for Season
```javascript
const response = await fetch(`/api/episodes/season/${seasonId}`);
const episodes = response.data;
```

### 2. Watch Episode (Increment View)
```javascript
await fetch(`/api/episodes/${episodeId}/view`, { method: 'PATCH' });
```

### 3. Create Episode with Thumbnail
```javascript
const formData = new FormData();
formData.append('movieId', movieId);
formData.append('seasonId', seasonId);
formData.append('episodeNumber', 1);
formData.append('title', 'Episode 1');
formData.append('durationSeconds', 2880);
formData.append('thumbnail', thumbnailFile);

await fetch('/api/episodes', {
  method: 'POST',
  body: formData
});
```

---

## Important Notes

### 1. Model Schema
- movieId, seasonId, episodeNumber, title: Required
- durationSeconds: In seconds (e.g., 2880 = 48 minutes)
- viewCount: Auto-increment with PATCH endpoint
- isFree: Boolean for free/premium episodes

### 2. Bunny CDN
- Thumbnails upload to `episodes/thumbnails/` folder
- Auto-delete from CDN on update/delete

### 3. Duplicate Prevention
- Unique episodeNumber per season
- Returns 409 if episode exists

### 4. Sort Order
- By season: episodeNumber ascending
- All episodes: seasonId + episodeNumber ascending

### 5. View Tracking
- Use PATCH /:id/view to increment viewCount
- Called when user plays episode

---

## Summary

✅ 8 endpoints for episode management
✅ Full CRUD operations
✅ Bunny CDN for thumbnails
✅ View count tracking
✅ Duplicate prevention
✅ Auto populate movie & season
✅ Batch delete by season
✅ Duration tracking in seconds
