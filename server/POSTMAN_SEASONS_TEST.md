# Seasons API - Postman Test Guide

## Base URL
```
http://localhost:3000/api/seasons
```

---

## 1. GET All Seasons

**Method:** GET  
**URL:** `http://localhost:3000/api/seasons`

### Query Parameters (optional):
- `movieId`: Filter by movie ID

### Example:
```
GET http://localhost:3000/api/seasons
GET http://localhost:3000/api/seasons?movieId=677349c8f1a2b3c4d5e6f7aa
```

### Response Success:
```json
{
  "message": "Seasons retrieved successfully",
  "data": [
    {
      "_id": "677349c8f1a2b3c4d5e6f7a9",
      "movieId": {
        "_id": "677349c8f1a2b3c4d5e6f7aa",
        "title": "Stranger Things",
        "type": "series",
        ...
      },
      "seasonNumber": 1,
      "title": "Season 1",
      "synopsis": "A young boy vanishes...",
      "poster_url": "https://study-videos-storage.b-cdn.net/seasons/posters/1735649736123-poster.jpg",
      "poster_path": "seasons/posters/1735649736123-poster.jpg",
      "poster_storage_zone": "study-storage-2026",
      "releaseDate": "2016-07-15T00:00:00.000Z",
      "createdAt": "2026-06-30T10:30:00.000Z",
      "updatedAt": "2026-06-30T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 2. GET Seasons by Movie ID

**Method:** GET  
**URL:** `http://localhost:3000/api/seasons/movie/:movieId`

### Example:
```
GET http://localhost:3000/api/seasons/movie/677349c8f1a2b3c4d5e6f7aa
```

### Response Success:
```json
{
  "message": "Seasons retrieved successfully",
  "data": [
    {
      "_id": "677349c8f1a2b3c4d5e6f7a9",
      "movieId": "677349c8f1a2b3c4d5e6f7aa",
      "seasonNumber": 1,
      "title": "Season 1",
      "synopsis": "A young boy vanishes...",
      "poster_url": "https://...",
      "releaseDate": "2016-07-15T00:00:00.000Z"
    },
    {
      "_id": "677349c8f1a2b3c4d5e6f7b0",
      "movieId": "677349c8f1a2b3c4d5e6f7aa",
      "seasonNumber": 2,
      "title": "Season 2",
      "synopsis": "It's been nearly a year...",
      "poster_url": "https://...",
      "releaseDate": "2017-10-27T00:00:00.000Z"
    }
  ],
  "total": 2
}
```

---

## 3. GET Season by ID

**Method:** GET  
**URL:** `http://localhost:3000/api/seasons/:id`

### Example:
```
GET http://localhost:3000/api/seasons/677349c8f1a2b3c4d5e6f7a9
```

### Response Success:
```json
{
  "message": "Season retrieved successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7a9",
    "movieId": {
      "_id": "677349c8f1a2b3c4d5e6f7aa",
      "title": "Stranger Things",
      "type": "series"
    },
    "seasonNumber": 1,
    "title": "Season 1",
    "synopsis": "A young boy vanishes into thin air...",
    "poster_url": "https://...",
    "releaseDate": "2016-07-15T00:00:00.000Z"
  }
}
```

---

## 4. CREATE Season (with poster upload)

**Method:** POST  
**URL:** `http://localhost:3000/api/seasons`  
**Content-Type:** `multipart/form-data`

### Form Data Fields:

#### Text Fields:
```
movieId: 677349c8f1a2b3c4d5e6f7aa
seasonNumber: 1
title: Season 1
synopsis: A young boy vanishes into thin air. A mother desperately searches for him. A secret government lab. Strange things are afoot in Hawkins, Indiana.
releaseDate: 2016-07-15
```

#### File Field:
```
poster: [Select image file - .jpg, .png, etc.]
```

### Postman Steps:
1. Select POST method
2. Enter URL: `http://localhost:3000/api/seasons`
3. Go to Body tab
4. Select "form-data"
5. Add all text fields as "Text" type
6. Add `poster` field as "File" type and browse to select image
7. Click Send

### Response Success:
```json
{
  "message": "Season created successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7a9",
    "movieId": {
      "_id": "677349c8f1a2b3c4d5e6f7aa",
      "title": "Stranger Things"
    },
    "seasonNumber": 1,
    "title": "Season 1",
    "synopsis": "A young boy vanishes...",
    "poster_url": "https://study-videos-storage.b-cdn.net/seasons/posters/1735649736123-poster.jpg",
    "poster_path": "seasons/posters/1735649736123-poster.jpg",
    "poster_storage_zone": "study-storage-2026",
    "releaseDate": "2016-07-15T00:00:00.000Z",
    "createdAt": "2026-06-30T10:30:00.000Z",
    "updatedAt": "2026-06-30T10:30:00.000Z"
  }
}
```

### Response Error (Duplicate):
```json
{
  "message": "Season number already exists for this movie"
}
```

---

## 5. UPDATE Season (with optional poster update)

**Method:** PUT  
**URL:** `http://localhost:3000/api/seasons/:id`  
**Content-Type:** `multipart/form-data`

### Example URL:
```
PUT http://localhost:3000/api/seasons/677349c8f1a2b3c4d5e6f7a9
```

### Form Data Fields (all optional):

#### Text Fields:
```
title: Season 1 - Updated
synopsis: Updated synopsis...
releaseDate: 2016-07-15
```

#### File Field (optional):
```
poster: [New image file]
```

### Notes:
- Only include fields you want to update
- If you upload new poster, old poster will be deleted from Bunny CDN automatically
- No poster upload = keep existing poster

### Response Success:
```json
{
  "message": "Season updated successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7a9",
    "movieId": {
      "_id": "677349c8f1a2b3c4d5e6f7aa",
      "title": "Stranger Things"
    },
    "seasonNumber": 1,
    "title": "Season 1 - Updated",
    "synopsis": "Updated synopsis...",
    "poster_url": "https://study-videos-storage.b-cdn.net/seasons/posters/1735649999999-new-poster.jpg",
    "poster_path": "seasons/posters/1735649999999-new-poster.jpg",
    "poster_storage_zone": "study-storage-2026",
    "releaseDate": "2016-07-15T00:00:00.000Z",
    "updatedAt": "2026-06-30T11:00:00.000Z"
  }
}
```

---

## 6. DELETE Season

**Method:** DELETE  
**URL:** `http://localhost:3000/api/seasons/:id`

### Example:
```
DELETE http://localhost:3000/api/seasons/677349c8f1a2b3c4d5e6f7a9
```

### Notes:
- Deletes season from MongoDB
- Automatically deletes poster from Bunny CDN

### Response Success:
```json
{
  "message": "Season deleted successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7a9",
    "movieId": "677349c8f1a2b3c4d5e6f7aa",
    "seasonNumber": 1,
    "title": "Season 1",
    "poster_path": "seasons/posters/1735649736123-poster.jpg"
  }
}
```

---

## 7. DELETE All Seasons for a Movie

**Method:** DELETE  
**URL:** `http://localhost:3000/api/seasons/movie/:movieId`

### Example:
```
DELETE http://localhost:3000/api/seasons/movie/677349c8f1a2b3c4d5e6f7aa
```

### Notes:
- Deletes all seasons for the movie
- Automatically deletes all posters from Bunny CDN

### Response Success:
```json
{
  "message": "All seasons deleted successfully",
  "deletedCount": 4
}
```

---

## Complete Test Flow

### Step 1: Create Series Movie
```
POST http://localhost:3000/api/movies
Body (form-data):
- title: Stranger Things
- original_title: Stranger Things
- type: series
- status: published
```

**Save Movie ID:** `677349c8f1a2b3c4d5e6f7aa`

---

### Step 2: Create Season 1
```
POST http://localhost:3000/api/seasons
Body (form-data):
- movieId: 677349c8f1a2b3c4d5e6f7aa
- seasonNumber: 1
- title: Season 1
- synopsis: A young boy vanishes into thin air...
- releaseDate: 2016-07-15
- poster: [image file]
```

**Response:** Status 201, poster uploaded to Bunny

---

### Step 3: Create Season 2
```
POST http://localhost:3000/api/seasons
Body (form-data):
- movieId: 677349c8f1a2b3c4d5e6f7aa
- seasonNumber: 2
- title: Season 2
- synopsis: It's been nearly a year since Will's return...
- releaseDate: 2017-10-27
- poster: [image file]
```

---

### Step 4: Get All Seasons for Movie
```
GET http://localhost:3000/api/seasons/movie/677349c8f1a2b3c4d5e6f7aa
```

**Response:** Array with 2 seasons, sorted by seasonNumber

---

### Step 5: Update Season 1
```
PUT http://localhost:3000/api/seasons/677349c8f1a2b3c4d5e6f7a9
Body (form-data):
- title: Season 1 - The Beginning
- poster: [new image file]
```

**Response:** Updated season, old poster deleted, new poster uploaded

---

### Step 6: Delete Season 2
```
DELETE http://localhost:3000/api/seasons/677349c8f1a2b3c4d5e6f7b0
```

**Response:** Status 200, season and poster deleted

---

### Step 7: Delete All Seasons
```
DELETE http://localhost:3000/api/seasons/movie/677349c8f1a2b3c4d5e6f7aa
```

**Response:** All seasons and posters deleted

---

## Sample Test Data

### Stranger Things Seasons:

**Season 1:**
```json
{
  "movieId": "677349c8f1a2b3c4d5e6f7aa",
  "seasonNumber": 1,
  "title": "Season 1",
  "synopsis": "A young boy vanishes into thin air. A mother desperately searches for him. A secret government lab. Strange things are afoot in Hawkins, Indiana.",
  "releaseDate": "2016-07-15"
}
```

**Season 2:**
```json
{
  "movieId": "677349c8f1a2b3c4d5e6f7aa",
  "seasonNumber": 2,
  "title": "Season 2",
  "synopsis": "It's been nearly a year since Will's return, but a darkness lurks just beneath the surface, threatening all of Hawkins.",
  "releaseDate": "2017-10-27"
}
```

**Season 3:**
```json
{
  "movieId": "677349c8f1a2b3c4d5e6f7aa",
  "seasonNumber": 3,
  "title": "Season 3",
  "synopsis": "It's 1985 in Hawkins, Indiana, and summer's heating up. School's out, there's a brand new mall in town, and the Hawkins crew are on the cusp of adulthood.",
  "releaseDate": "2019-07-04"
}
```

**Season 4:**
```json
{
  "movieId": "677349c8f1a2b3c4d5e6f7aa",
  "seasonNumber": 4,
  "title": "Season 4",
  "synopsis": "It's been six months since the Battle of Starcourt, which brought terror and destruction to Hawkins. Struggling with the aftermath, our group of friends are separated for the first time.",
  "releaseDate": "2022-05-27"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "movieId, seasonNumber and title are required"
}
```

### 404 Not Found
```json
{
  "message": "Season not found"
}
```
```json
{
  "message": "No seasons found for this movie"
}
```

### 409 Conflict
```json
{
  "message": "Season number already exists for this movie"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

---

## Use Cases

### 1. Series Management
```javascript
// Get all seasons for a series
const response = await fetch(`/api/seasons/movie/${movieId}`);
const seasons = response.data;
```

### 2. Season Details Page
```javascript
// Get specific season
const response = await fetch(`/api/seasons/${seasonId}`);
const season = response.data;
```

### 3. Add New Season
```javascript
const formData = new FormData();
formData.append('movieId', movieId);
formData.append('seasonNumber', 5);
formData.append('title', 'Season 5');
formData.append('synopsis', 'The final season...');
formData.append('poster', posterFile);

await fetch('/api/seasons', {
  method: 'POST',
  body: formData
});
```

### 4. Update Season Poster
```javascript
const formData = new FormData();
formData.append('poster', newPosterFile);

await fetch(`/api/seasons/${seasonId}`, {
  method: 'PUT',
  body: formData
});
```

---

## Important Notes

### 1. Model Schema
```javascript
{
  movieId: ObjectId (ref: Movie),
  seasonNumber: Number (required),
  title: String (required),
  synopsis: String,
  poster_url: String,
  poster_path: String,
  poster_storage_zone: String,
  releaseDate: Date,
  timestamps: true
}
```

### 2. Bunny CDN Integration
- Poster uploaded to `seasons/posters/` folder
- Files automatically deleted from CDN when season is updated or deleted
- Storage zone tracked for multi-zone load balancing

### 3. Duplicate Prevention
- POST endpoint checks for duplicate seasonNumber per movie
- Returns 409 if season number already exists

### 4. Sort Order
- GET by movieId sorts by `seasonNumber: 1` (ascending)
- GET all sorts by `movieId: 1, seasonNumber: 1`

### 5. File Upload
- Max file size: 10MB
- Allowed: Image files only (jpg, png, webp, etc.)
- Field name: `poster`

### 6. Cascade Delete
- When deleting all seasons by movieId, all posters are deleted from Bunny first
- Uses parallel delete for efficiency

### 7. Populate References
- GET endpoints auto-populate movieId with full movie details
- Useful for displaying series info with season

---

## Frontend Integration

### React/Vue Example:

**Create Season:**
```javascript
const createSeason = async (seasonData, posterFile) => {
  const formData = new FormData();
  formData.append('movieId', seasonData.movieId);
  formData.append('seasonNumber', seasonData.seasonNumber);
  formData.append('title', seasonData.title);
  formData.append('synopsis', seasonData.synopsis);
  formData.append('releaseDate', seasonData.releaseDate);
  
  if (posterFile) {
    formData.append('poster', posterFile);
  }

  const response = await fetch('/api/seasons', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
};
```

**Get Seasons:**
```javascript
const getSeasonsByMovie = async (movieId) => {
  const response = await fetch(`/api/seasons/movie/${movieId}`);
  const data = await response.json();
  return data.data;
};
```

**Update Season:**
```javascript
const updateSeason = async (seasonId, updates, newPoster) => {
  const formData = new FormData();
  
  if (updates.title) formData.append('title', updates.title);
  if (updates.synopsis) formData.append('synopsis', updates.synopsis);
  if (newPoster) formData.append('poster', newPoster);

  const response = await fetch(`/api/seasons/${seasonId}`, {
    method: 'PUT',
    body: formData
  });
  
  return await response.json();
};
```

---

## Summary

✅ 7 endpoints for season management
✅ Full CRUD operations
✅ Bunny CDN integration for posters
✅ Auto delete from CDN on update/delete
✅ Duplicate prevention (seasonNumber per movie)
✅ Auto populate movie details
✅ Sort by season number
✅ Batch delete with CDN cleanup
✅ File size limit: 10MB
✅ Image validation
