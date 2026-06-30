# Movie Genres API - Postman Test Guide

## Base URL
```
http://localhost:3000/api/movie-genres
```

---

## 1. GET All Movie-Genre Relations

**Method:** GET  
**URL:** `http://localhost:3000/api/movie-genres`

### Response Success:
```json
{
  "message": "Movie genres retrieved successfully",
  "data": [
    {
      "_id": "677349c8f1a2b3c4d5e6f7a9",
      "movieId": {
        "_id": "677349c8f1a2b3c4d5e6f7aa",
        "title": "Doraemon: Nobita và Bản Giao Hưởng Địa Cầu",
        "poster_url": "https://...",
        ...
      },
      "genreId": {
        "_id": "677349c8f1a2b3c4d5e6f7ab",
        "name": "Animation",
        "slug": "animation",
        ...
      },
      "createdAt": "2026-06-30T10:30:00.000Z",
      "updatedAt": "2026-06-30T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 2. GET Genres by Movie ID

**Method:** GET  
**URL:** `http://localhost:3000/api/movie-genres/movie/:movieId`

### Example:
```
GET http://localhost:3000/api/movie-genres/movie/677349c8f1a2b3c4d5e6f7aa
```

### Response Success:
```json
{
  "message": "Movie genres retrieved successfully",
  "data": [
    {
      "_id": "677349c8f1a2b3c4d5e6f7a9",
      "movieId": "677349c8f1a2b3c4d5e6f7aa",
      "genreId": {
        "_id": "677349c8f1a2b3c4d5e6f7ab",
        "name": "Animation",
        "slug": "animation"
      },
      "createdAt": "2026-06-30T10:30:00.000Z"
    },
    {
      "_id": "677349c8f1a2b3c4d5e6f7b0",
      "movieId": "677349c8f1a2b3c4d5e6f7aa",
      "genreId": {
        "_id": "677349c8f1a2b3c4d5e6f7ac",
        "name": "Adventure",
        "slug": "adventure"
      },
      "createdAt": "2026-06-30T10:35:00.000Z"
    }
  ],
  "total": 2
}
```

---

## 3. GET Movies by Genre ID

**Method:** GET  
**URL:** `http://localhost:3000/api/movie-genres/genre/:genreId`

### Example:
```
GET http://localhost:3000/api/movie-genres/genre/677349c8f1a2b3c4d5e6f7ab
```

### Response Success:
```json
{
  "message": "Movies by genre retrieved successfully",
  "data": [
    {
      "_id": "677349c8f1a2b3c4d5e6f7a9",
      "movieId": {
        "_id": "677349c8f1a2b3c4d5e6f7aa",
        "title": "Doraemon Movie",
        "poster_url": "https://...",
        "rating": 7.5
      },
      "genreId": "677349c8f1a2b3c4d5e6f7ab",
      "createdAt": "2026-06-30T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 4. GET Movie-Genre by ID

**Method:** GET  
**URL:** `http://localhost:3000/api/movie-genres/:id`

### Example:
```
GET http://localhost:3000/api/movie-genres/677349c8f1a2b3c4d5e6f7a9
```

### Response Success:
```json
{
  "message": "Movie genre retrieved successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7a9",
    "movieId": {
      "_id": "677349c8f1a2b3c4d5e6f7aa",
      "title": "Doraemon Movie"
    },
    "genreId": {
      "_id": "677349c8f1a2b3c4d5e6f7ab",
      "name": "Animation"
    }
  }
}
```

---

## 5. CREATE Single Movie-Genre Relation

**Method:** POST  
**URL:** `http://localhost:3000/api/movie-genres`  
**Content-Type:** `application/json`

### Body (JSON):
```json
{
  "movieId": "677349c8f1a2b3c4d5e6f7aa",
  "genreId": "677349c8f1a2b3c4d5e6f7ab"
}
```

### Response Success:
```json
{
  "message": "Movie genre created successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7a9",
    "movieId": {
      "_id": "677349c8f1a2b3c4d5e6f7aa",
      "title": "Doraemon Movie"
    },
    "genreId": {
      "_id": "677349c8f1a2b3c4d5e6f7ab",
      "name": "Animation"
    },
    "createdAt": "2026-06-30T10:30:00.000Z",
    "updatedAt": "2026-06-30T10:30:00.000Z"
  }
}
```

### Response Error (Duplicate):
```json
{
  "message": "This movie-genre relation already exists"
}
```

---

## 6. CREATE Multiple Movie-Genres (Bulk)

**Method:** POST  
**URL:** `http://localhost:3000/api/movie-genres/bulk`  
**Content-Type:** `application/json`

### Body (JSON):
```json
{
  "movieId": "677349c8f1a2b3c4d5e6f7aa",
  "genreIds": [
    "677349c8f1a2b3c4d5e6f7ab",
    "677349c8f1a2b3c4d5e6f7ac",
    "677349c8f1a2b3c4d5e6f7ad"
  ]
}
```

### Response Success:
```json
{
  "message": "Movie genres created successfully",
  "data": [
    {
      "_id": "677349c8f1a2b3c4d5e6f7a9",
      "movieId": {
        "_id": "677349c8f1a2b3c4d5e6f7aa",
        "title": "Doraemon Movie"
      },
      "genreId": {
        "_id": "677349c8f1a2b3c4d5e6f7ab",
        "name": "Animation"
      }
    },
    {
      "_id": "677349c8f1a2b3c4d5e6f7b0",
      "movieId": {
        "_id": "677349c8f1a2b3c4d5e6f7aa",
        "title": "Doraemon Movie"
      },
      "genreId": {
        "_id": "677349c8f1a2b3c4d5e6f7ac",
        "name": "Adventure"
      }
    }
  ],
  "created": 2,
  "skipped": 1
}
```

---

## 7. UPDATE Movie-Genre Relation

**Method:** PUT  
**URL:** `http://localhost:3000/api/movie-genres/:id`  
**Content-Type:** `application/json`

### Example URL:
```
PUT http://localhost:3000/api/movie-genres/677349c8f1a2b3c4d5e6f7a9
```

### Body (JSON):
```json
{
  "genreId": "677349c8f1a2b3c4d5e6f7ad"
}
```

### Response Success:
```json
{
  "message": "Movie genre updated successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7a9",
    "movieId": {
      "_id": "677349c8f1a2b3c4d5e6f7aa",
      "title": "Doraemon Movie"
    },
    "genreId": {
      "_id": "677349c8f1a2b3c4d5e6f7ad",
      "name": "Family"
    }
  }
}
```

---

## 8. DELETE Single Movie-Genre

**Method:** DELETE  
**URL:** `http://localhost:3000/api/movie-genres/:id`

### Example:
```
DELETE http://localhost:3000/api/movie-genres/677349c8f1a2b3c4d5e6f7a9
```

### Response Success:
```json
{
  "message": "Movie genre deleted successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7a9",
    "movieId": "677349c8f1a2b3c4d5e6f7aa",
    "genreId": "677349c8f1a2b3c4d5e6f7ab"
  }
}
```

---

## 9. DELETE All Genres for a Movie

**Method:** DELETE  
**URL:** `http://localhost:3000/api/movie-genres/movie/:movieId`

### Example:
```
DELETE http://localhost:3000/api/movie-genres/movie/677349c8f1a2b3c4d5e6f7aa
```

### Response Success:
```json
{
  "message": "All movie genres deleted successfully",
  "deletedCount": 3
}
```

---

## Complete Test Flow

### Step 1: Create Genres
```
POST http://localhost:3000/api/genres
Body:
{
  "name": "Animation",
  "description": "Animated movies"
}

POST http://localhost:3000/api/genres
Body:
{
  "name": "Adventure",
  "description": "Adventure movies"
}

POST http://localhost:3000/api/genres
Body:
{
  "name": "Family",
  "description": "Family-friendly movies"
}
```

**Save Genre IDs:**
- Animation: `677349c8f1a2b3c4d5e6f7ab`
- Adventure: `677349c8f1a2b3c4d5e6f7ac`
- Family: `677349c8f1a2b3c4d5e6f7ad`

---

### Step 2: Create Movie
```
POST http://localhost:3000/api/movies
Body (form-data):
- title: Doraemon: Nobita và Bản Giao Hưởng Địa Cầu
- original_title: Doraemon: Nobita's Earth Symphony
- type: movie
- status: published
```

**Save Movie ID:**
- Doraemon: `677349c8f1a2b3c4d5e6f7aa`

---

### Step 3: Assign Single Genre
```
POST http://localhost:3000/api/movie-genres
Body:
{
  "movieId": "677349c8f1a2b3c4d5e6f7aa",
  "genreId": "677349c8f1a2b3c4d5e6f7ab"
}
```

**Response:** Status 201, Animation assigned

---

### Step 4: Assign Multiple Genres (Bulk)
```
POST http://localhost:3000/api/movie-genres/bulk
Body:
{
  "movieId": "677349c8f1a2b3c4d5e6f7aa",
  "genreIds": [
    "677349c8f1a2b3c4d5e6f7ab",
    "677349c8f1a2b3c4d5e6f7ac",
    "677349c8f1a2b3c4d5e6f7ad"
  ]
}
```

**Response:** Created 2, Skipped 1 (Animation already exists)

---

### Step 5: Get Movie Genres
```
GET http://localhost:3000/api/movie-genres/movie/677349c8f1a2b3c4d5e6f7aa
```

**Response:** Array với 3 genres (Animation, Adventure, Family)

---

### Step 6: Get Movies by Genre
```
GET http://localhost:3000/api/movie-genres/genre/677349c8f1a2b3c4d5e6f7ab
```

**Response:** Array với all movies thuộc Animation genre

---

### Step 7: Update Genre
```
PUT http://localhost:3000/api/movie-genres/677349c8f1a2b3c4d5e6f7a9
Body:
{
  "genreId": "677349c8f1a2b3c4d5e6f7ad"
}
```

**Response:** Genre updated thành Family

---

### Step 8: Delete Single Genre
```
DELETE http://localhost:3000/api/movie-genres/677349c8f1a2b3c4d5e6f7a9
```

**Response:** Status 200, deleted successfully

---

### Step 9: Delete All Movie Genres
```
DELETE http://localhost:3000/api/movie-genres/movie/677349c8f1a2b3c4d5e6f7aa
```

**Response:** Status 200, deletedCount: 2

---

## Sample Test Data

### Vietnamese Movies with Genres:

**Movie 1: Doraemon**
```json
{
  "movieId": "677349c8f1a2b3c4d5e6f7aa",
  "genreIds": ["animation", "adventure", "family"]
}
```

**Movie 2: Mắt Biếc**
```json
{
  "movieId": "677349c8f1a2b3c4d5e6f7bb",
  "genreIds": ["drama", "romance"]
}
```

**Movie 3: Bố Già**
```json
{
  "movieId": "677349c8f1a2b3c4d5e6f7cc",
  "genreIds": ["comedy", "drama", "family"]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Movie ID and Genre ID are required"
}
```

### 404 Not Found
```json
{
  "message": "Movie genre not found"
}
```
```json
{
  "message": "No genres found for this movie"
}
```

### 409 Conflict
```json
{
  "message": "This movie-genre relation already exists"
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

### 1. Assign Genres When Creating Movie
```javascript
// Create movie first
const movie = await createMovie({...});

// Bulk assign genres
await fetch('/api/movie-genres/bulk', {
  method: 'POST',
  body: JSON.stringify({
    movieId: movie._id,
    genreIds: ['genreId1', 'genreId2', 'genreId3']
  })
});
```

### 2. Get Movies by Genre (Browse by Category)
```javascript
// Get all Action movies
const response = await fetch('/api/movie-genres/genre/action-genre-id');
const actionMovies = response.data.map(mg => mg.movieId);
```

### 3. Display Movie Genres (Movie Detail Page)
```javascript
// Get genres for a movie
const response = await fetch(`/api/movie-genres/movie/${movieId}`);
const genres = response.data.map(mg => mg.genreId);
```

### 4. Update Movie Genres
```javascript
// Delete all existing genres
await fetch(`/api/movie-genres/movie/${movieId}`, { method: 'DELETE' });

// Add new genres
await fetch('/api/movie-genres/bulk', {
  method: 'POST',
  body: JSON.stringify({ movieId, genreIds: newGenreIds })
});
```

---

## Important Notes

### 1. Many-to-Many Relationship
- 1 Movie có nhiều Genres
- 1 Genre có nhiều Movies
- Movie-Genre là bảng trung gian

### 2. Duplicate Prevention
- POST endpoint check duplicate trước khi tạo
- Bulk endpoint skip duplicates và report số lượng

### 3. Populate References
- GET endpoints tự động populate movieId và genreId
- Trả về full details thay vì chỉ IDs

### 4. Bulk Operations
- Use `/bulk` endpoint để assign nhiều genres cùng lúc
- Efficient hơn multiple single requests

### 5. Cascade Delete?
- API KHÔNG tự động xóa movie-genres khi xóa movie
- Frontend/Backend cần handle manually
- Hoặc dùng MongoDB middleware (pre remove hook)

---

## Summary

✅ 9 endpoints cho movie-genre management
✅ Many-to-many relationship
✅ Bulk assign genres
✅ Auto populate references
✅ Duplicate prevention
✅ Get by movie or genre
✅ Delete single or all
✅ Full CRUD operations
