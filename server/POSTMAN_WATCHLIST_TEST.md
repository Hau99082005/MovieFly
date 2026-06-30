# Watchlist API - Postman Test Guide

## Base URL
```
http://localhost:3000/api/watchlist
```

---

## 1. GET Watchlist (Lấy danh sách watchlist của user)

**Method:** GET  
**URL:** `http://localhost:3000/api/watchlist`

### Query Parameters:
- `userId`: ID của user (required for testing)

### Example:
```
GET http://localhost:3000/api/watchlist?userId=677349c8f1a2b3c4d5e6f7a8
```

### Response Success:
```json
{
  "message": "Watchlist items retrieved successfully",
  "data": [
    {
      "_id": "677349c8f1a2b3c4d5e6f7a9",
      "userId": "677349c8f1a2b3c4d5e6f7a8",
      "movieId": {
        "_id": "677349c8f1a2b3c4d5e6f7aa",
        "title": "Doraemon: Nobita và Bản Giao Hưởng Địa Cầu",
        "poster_url": "https://...",
        "rating": 7.5,
        ...
      },
      "addedAt": "2026-06-30T10:30:00.000Z",
      "createdAt": "2026-06-30T10:30:00.000Z",
      "updatedAt": "2026-06-30T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 2. GET Watchlist Count (Đếm số lượng items)

**Method:** GET  
**URL:** `http://localhost:3000/api/watchlist/count`

### Query Parameters:
- `userId`: ID của user (required)

### Example:
```
GET http://localhost:3000/api/watchlist/count?userId=677349c8f1a2b3c4d5e6f7a8
```

### Response Success:
```json
{
  "message": "Watchlist count retrieved successfully",
  "count": 5
}
```

---

## 3. Check Movie In Watchlist (Kiểm tra movie có trong watchlist không)

**Method:** GET  
**URL:** `http://localhost:3000/api/watchlist/check`

### Query Parameters:
- `userId`: ID của user (required)
- `movieId`: ID của movie (required)

### Example:
```
GET http://localhost:3000/api/watchlist/check?userId=677349c8f1a2b3c4d5e6f7a8&movieId=677349c8f1a2b3c4d5e6f7aa
```

### Response Success (Movie trong watchlist):
```json
{
  "message": "Check completed",
  "inWatchlist": true,
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7a9",
    "userId": "677349c8f1a2b3c4d5e6f7a8",
    "movieId": "677349c8f1a2b3c4d5e6f7aa",
    "addedAt": "2026-06-30T10:30:00.000Z"
  }
}
```

### Response Success (Movie KHÔNG trong watchlist):
```json
{
  "message": "Check completed",
  "inWatchlist": false,
  "data": null
}
```

---

## 4. GET Watchlist Item by ID

**Method:** GET  
**URL:** `http://localhost:3000/api/watchlist/:id`

### Example:
```
GET http://localhost:3000/api/watchlist/677349c8f1a2b3c4d5e6f7a9
```

### Response Success:
```json
{
  "message": "Watchlist item retrieved successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7a9",
    "userId": "677349c8f1a2b3c4d5e6f7a8",
    "movieId": {
      "_id": "677349c8f1a2b3c4d5e6f7aa",
      "title": "Doraemon Movie",
      "poster_url": "https://...",
      ...
    },
    "addedAt": "2026-06-30T10:30:00.000Z"
  }
}
```

### Response Error:
```json
{
  "message": "Watchlist item not found"
}
```

---

## 5. ADD Movie to Watchlist

**Method:** POST  
**URL:** `http://localhost:3000/api/watchlist`  
**Content-Type:** `application/json`

### Body (JSON):
```json
{
  "userId": "677349c8f1a2b3c4d5e6f7a8",
  "movieId": "677349c8f1a2b3c4d5e6f7aa"
}
```

### Postman Steps:
1. Select POST method
2. Enter URL: `http://localhost:3000/api/watchlist`
3. Go to Headers tab
4. Add: `Content-Type: application/json`
5. Go to Body tab
6. Select "raw" and "JSON"
7. Paste JSON body
8. Click Send

### Response Success:
```json
{
  "message": "Movie added to watchlist successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7a9",
    "userId": "677349c8f1a2b3c4d5e6f7a8",
    "movieId": {
      "_id": "677349c8f1a2b3c4d5e6f7aa",
      "title": "Doraemon Movie",
      "poster_url": "https://...",
      ...
    },
    "addedAt": "2026-06-30T10:30:00.000Z",
    "createdAt": "2026-06-30T10:30:00.000Z",
    "updatedAt": "2026-06-30T10:30:00.000Z"
  }
}
```

### Response Error (Duplicate):
```json
{
  "message": "Movie already in watchlist"
}
```

---

## 6. REMOVE Movie from Watchlist

**Method:** DELETE  
**URL:** `http://localhost:3000/api/watchlist`  
**Content-Type:** `application/json`

### Body (JSON):
```json
{
  "userId": "677349c8f1a2b3c4d5e6f7a8",
  "movieId": "677349c8f1a2b3c4d5e6f7aa"
}
```

### Response Success:
```json
{
  "message": "Movie removed from watchlist successfully",
  "data": {
    "_id": "677349c8f1a2b3c4d5e6f7a9",
    "userId": "677349c8f1a2b3c4d5e6f7a8",
    "movieId": "677349c8f1a2b3c4d5e6f7aa",
    "addedAt": "2026-06-30T10:30:00.000Z"
  }
}
```

### Response Error:
```json
{
  "message": "Movie not found in watchlist"
}
```

---

## 7. CLEAR Entire Watchlist (Xóa tất cả)

**Method:** DELETE  
**URL:** `http://localhost:3000/api/watchlist/clear`  
**Content-Type:** `application/json`

### Body (JSON):
```json
{
  "userId": "677349c8f1a2b3c4d5e6f7a8"
}
```

### Response Success:
```json
{
  "message": "Watchlist cleared successfully",
  "deletedCount": 5
}
```

### Response Error:
```json
{
  "message": "No watchlist items found for this user"
}
```

---

## Postman Collection Order (Test theo thứ tự)

### 1. Tạo User (nếu chưa có)
```
POST http://localhost:3000/api/users/register
Body: { email, password, username, full_name }
```

### 2. Tạo Movie (nếu chưa có)
```
POST http://localhost:3000/api/movies
Body: { title, original_title, ... }
```

### 3. Add to Watchlist
```
POST http://localhost:3000/api/watchlist
Body: { userId, movieId }
```

### 4. Get Watchlist
```
GET http://localhost:3000/api/watchlist?userId=xxx
```

### 5. Check Movie
```
GET http://localhost:3000/api/watchlist/check?userId=xxx&movieId=yyy
```

### 6. Get Count
```
GET http://localhost:3000/api/watchlist/count?userId=xxx
```

### 7. Remove from Watchlist
```
DELETE http://localhost:3000/api/watchlist
Body: { userId, movieId }
```

### 8. Clear Watchlist
```
DELETE http://localhost:3000/api/watchlist/clear
Body: { userId }
```

---

## Sample Test Data

### User IDs (example):
```
user1: 677349c8f1a2b3c4d5e6f7a8
user2: 677349c8f1a2b3c4d5e6f7b0
```

### Movie IDs (example):
```
movie1: 677349c8f1a2b3c4d5e6f7aa
movie2: 677349c8f1a2b3c4d5e6f7ab
movie3: 677349c8f1a2b3c4d5e6f7ac
```

### Add Multiple Movies:
```json
POST /api/watchlist
{ "userId": "677349c8f1a2b3c4d5e6f7a8", "movieId": "677349c8f1a2b3c4d5e6f7aa" }

POST /api/watchlist
{ "userId": "677349c8f1a2b3c4d5e6f7a8", "movieId": "677349c8f1a2b3c4d5e6f7ab" }

POST /api/watchlist
{ "userId": "677349c8f1a2b3c4d5e6f7a8", "movieId": "677349c8f1a2b3c4d5e6f7ac" }
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "User ID and Movie ID are required"
}
```

### 404 Not Found
```json
{
  "message": "Watchlist item not found"
}
```
```json
{
  "message": "Movie not found in watchlist"
}
```

### 409 Conflict
```json
{
  "message": "Movie already in watchlist"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

---

## Important Notes

### 1. Model Schema
```javascript
{
  userId: ObjectId (ref: User),
  movieId: ObjectId (ref: Movie),
  addedAt: Date,
  timestamps: true
}
```

### 2. Populate MovieId
- Tất cả GET endpoints tự động populate movieId
- Trả về full movie details (title, poster, rating, etc.)

### 3. Duplicate Prevention
- POST endpoint kiểm tra duplicate trước khi add
- Response 409 nếu movie đã có trong watchlist

### 4. Sort Order
- GET watchlist sort by `createdAt: -1` (mới nhất trước)

### 5. Use Cases

**Add to Watchlist:**
- User click "Add to Watchlist" button
- Frontend call POST /api/watchlist

**Check Status:**
- Display "In Watchlist" badge
- Frontend call GET /api/watchlist/check

**Remove:**
- User click "Remove" button
- Frontend call DELETE /api/watchlist

**Count Badge:**
- Display count on watchlist icon
- Frontend call GET /api/watchlist/count

---

## Frontend Integration Examples

### React/Vue Example:

**Add to Watchlist:**
```javascript
const addToWatchlist = async (movieId) => {
  const response = await fetch('/api/watchlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      userId: currentUser.id, 
      movieId 
    })
  });
  const data = await response.json();
  console.log(data.message);
};
```

**Check Status:**
```javascript
const checkWatchlist = async (movieId) => {
  const response = await fetch(
    `/api/watchlist/check?userId=${userId}&movieId=${movieId}`
  );
  const data = await response.json();
  return data.inWatchlist;
};
```

**Get Count:**
```javascript
const getWatchlistCount = async () => {
  const response = await fetch(
    `/api/watchlist/count?userId=${userId}`
  );
  const data = await response.json();
  return data.count;
};
```

---

## Summary

✅ 7 endpoints cho watchlist management
✅ Full CRUD operations
✅ Auto populate movie details
✅ Duplicate prevention
✅ Count và check endpoints
✅ Clear all functionality
✅ Error handling đầy đủ
