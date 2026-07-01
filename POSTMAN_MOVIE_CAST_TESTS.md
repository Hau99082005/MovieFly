# Movie Cast API - Postman Test Collection

Base URL: `http://localhost:3000/api/movie-cast`

---

## 1. GET All Movie Casts
**Endpoint:** `GET /api/movie-cast`

**Description:** Lấy tất cả danh sách cast của phim

**Response Success (200):**
```json
{
  "message": "Movie casts retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "movieId": {
        "_id": "507f1f77bcf86cd799439001",
        "title": "Forrest Gump"
      },
      "personId": {
        "_id": "507f1f77bcf86cd799439021",
        "full_name": "Tom Hanks",
        "avatar_url": "https://..."
      },
      "role": "actor",
      "characterName": "Forrest Gump",
      "sortOrder": 1,
      "createdAt": "2026-07-01T10:30:00.000Z",
      "updatedAt": "2026-07-01T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 2. GET Movie Cast By ID
**Endpoint:** `GET /api/movie-cast/:id`

**Description:** Lấy thông tin movie cast theo ID

**Example:** `GET /api/movie-cast/507f1f77bcf86cd799439011`

**Response Success (200):**
```json
{
  "message": "Movie cast retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "movieId": {
      "_id": "507f1f77bcf86cd799439001",
      "title": "Forrest Gump"
    },
    "personId": {
      "_id": "507f1f77bcf86cd799439021",
      "full_name": "Tom Hanks"
    },
    "role": "actor",
    "characterName": "Forrest Gump",
    "sortOrder": 1,
    "createdAt": "2026-07-01T10:30:00.000Z",
    "updatedAt": "2026-07-01T10:30:00.000Z"
  }
}
```

**Response Error (404):**
```json
{
  "message": "Movie cast not found"
}
```

---

## 3. GET Movie Casts By Movie ID
**Endpoint:** `GET /api/movie-cast/movie/:movieId`

**Description:** Lấy tất cả cast của một phim

**Example:** `GET /api/movie-cast/movie/507f1f77bcf86cd799439001`

**Response Success (200):**
```json
{
  "message": "Movie casts retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "movieId": "507f1f77bcf86cd799439001",
      "personId": {
        "_id": "507f1f77bcf86cd799439021",
        "full_name": "Tom Hanks"
      },
      "role": "actor",
      "characterName": "Forrest Gump",
      "sortOrder": 1
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "movieId": "507f1f77bcf86cd799439001",
      "personId": {
        "_id": "507f1f77bcf86cd799439022",
        "full_name": "Robert Zemeckis"
      },
      "role": "director",
      "sortOrder": 1
    }
  ],
  "total": 2
}
```

---

## 4. GET Movie Casts By Person ID
**Endpoint:** `GET /api/movie-cast/person/:personId`

**Description:** Lấy tất cả phim của một người

**Example:** `GET /api/movie-cast/person/507f1f77bcf86cd799439021`

**Response Success (200):**
```json
{
  "message": "Movie casts retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "movieId": {
        "_id": "507f1f77bcf86cd799439001",
        "title": "Forrest Gump"
      },
      "personId": "507f1f77bcf86cd799439021",
      "role": "actor",
      "characterName": "Forrest Gump",
      "sortOrder": 1
    }
  ],
  "total": 1
}
```

---

## 5. GET Movie Casts By Role
**Endpoint:** `GET /api/movie-cast/movie/:movieId/role/:role`

**Description:** Lấy cast theo vai trò (actor, director, producer, writer)

**Example:** `GET /api/movie-cast/movie/507f1f77bcf86cd799439001/role/actor`

**Response Success (200):**
```json
{
  "message": "Movie actors retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "movieId": "507f1f77bcf86cd799439001",
      "personId": {
        "_id": "507f1f77bcf86cd799439021",
        "full_name": "Tom Hanks"
      },
      "role": "actor",
      "characterName": "Forrest Gump",
      "sortOrder": 1
    }
  ],
  "total": 1
}
```

**Response Error (400) - Invalid Role:**
```json
{
  "message": "Invalid role. Must be: actor, director, producer, or writer"
}
```

---

## 6. CREATE Movie Cast
**Endpoint:** `POST /api/movie-cast`

**Description:** Tạo cast mới cho phim

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "movieId": "507f1f77bcf86cd799439001",
  "personId": "507f1f77bcf86cd799439021",
  "role": "actor",
  "characterName": "Forrest Gump",
  "sortOrder": 1
}
```

**Request Body (Director - không cần characterName):**
```json
{
  "movieId": "507f1f77bcf86cd799439001",
  "personId": "507f1f77bcf86cd799439022",
  "role": "director",
  "sortOrder": 1
}
```

**Response Success (201):**
```json
{
  "message": "Movie cast created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "movieId": {
      "_id": "507f1f77bcf86cd799439001",
      "title": "Forrest Gump"
    },
    "personId": {
      "_id": "507f1f77bcf86cd799439021",
      "full_name": "Tom Hanks"
    },
    "role": "actor",
    "characterName": "Forrest Gump",
    "sortOrder": 1,
    "createdAt": "2026-07-01T10:30:00.000Z",
    "updatedAt": "2026-07-01T10:30:00.000Z"
  }
}
```

**Response Error (400) - Missing Fields:**
```json
{
  "message": "movieId, personId, role and sortOrder are required"
}
```

**Response Error (400) - Missing Character Name for Actor:**
```json
{
  "message": "characterName is required for actor role"
}
```

**Response Error (409) - Duplicate:**
```json
{
  "message": "This person is already assigned to this movie with the same role"
}
```

---

## 7. BULK CREATE Movie Casts
**Endpoint:** `POST /api/movie-cast/bulk`

**Description:** Tạo nhiều cast cùng lúc cho một phim

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "movieId": "507f1f77bcf86cd799439001",
  "casts": [
    {
      "personId": "507f1f77bcf86cd799439021",
      "role": "actor",
      "characterName": "Forrest Gump",
      "sortOrder": 1
    },
    {
      "personId": "507f1f77bcf86cd799439022",
      "role": "actor",
      "characterName": "Jenny Curran",
      "sortOrder": 2
    },
    {
      "personId": "507f1f77bcf86cd799439023",
      "role": "director",
      "sortOrder": 1
    }
  ]
}
```

**Response Success (201):**
```json
{
  "message": "Movie casts created successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "movieId": { ... },
      "personId": { ... },
      "role": "actor",
      "characterName": "Forrest Gump",
      "sortOrder": 1
    },
    ...
  ],
  "total": 3
}
```

---

## 8. UPDATE Movie Cast
**Endpoint:** `PUT /api/movie-cast/:id`

**Description:** Cập nhật thông tin cast

**Example:** `PUT /api/movie-cast/507f1f77bcf86cd799439011`

**Headers:**
```
Content-Type: application/json
```

**Request Body (chỉ update field cần thiết):**
```json
{
  "characterName": "Updated Character Name",
  "sortOrder": 2
}
```

**Response Success (200):**
```json
{
  "message": "Movie cast updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "movieId": { ... },
    "personId": { ... },
    "role": "actor",
    "characterName": "Updated Character Name",
    "sortOrder": 2,
    "updatedAt": "2026-07-01T11:00:00.000Z"
  }
}
```

---

## 9. DELETE Movie Cast
**Endpoint:** `DELETE /api/movie-cast/:id`

**Description:** Xóa một cast

**Example:** `DELETE /api/movie-cast/507f1f77bcf86cd799439011`

**Response Success (200):**
```json
{
  "message": "Movie cast deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "movieId": "507f1f77bcf86cd799439001",
    "personId": "507f1f77bcf86cd799439021",
    "role": "actor",
    "characterName": "Forrest Gump",
    "sortOrder": 1
  }
}
```

---

## 10. DELETE All Movie Casts By Movie ID
**Endpoint:** `DELETE /api/movie-cast/movie/:movieId`

**Description:** Xóa tất cả cast của một phim

**Example:** `DELETE /api/movie-cast/movie/507f1f77bcf86cd799439001`

**Response Success (200):**
```json
{
  "message": "Movie casts deleted successfully",
  "deletedCount": 5
}
```

---

## Sample Test Data

### Scenario: Forrest Gump Movie Cast

**1. Create Actor 1:**
```json
{
  "movieId": "YOUR_MOVIE_ID",
  "personId": "YOUR_TOM_HANKS_ID",
  "role": "actor",
  "characterName": "Forrest Gump",
  "sortOrder": 1
}
```

**2. Create Actor 2:**
```json
{
  "movieId": "YOUR_MOVIE_ID",
  "personId": "YOUR_ROBIN_WRIGHT_ID",
  "role": "actor",
  "characterName": "Jenny Curran",
  "sortOrder": 2
}
```

**3. Create Director:**
```json
{
  "movieId": "YOUR_MOVIE_ID",
  "personId": "YOUR_ZEMECKIS_ID",
  "role": "director",
  "sortOrder": 1
}
```

**4. Create Producer:**
```json
{
  "movieId": "YOUR_MOVIE_ID",
  "personId": "YOUR_PRODUCER_ID",
  "role": "producer",
  "sortOrder": 1
}
```

**5. Bulk Create:**
```json
{
  "movieId": "YOUR_MOVIE_ID",
  "casts": [
    {
      "personId": "YOUR_TOM_HANKS_ID",
      "role": "actor",
      "characterName": "Forrest Gump",
      "sortOrder": 1
    },
    {
      "personId": "YOUR_ROBIN_WRIGHT_ID",
      "role": "actor",
      "characterName": "Jenny Curran",
      "sortOrder": 2
    },
    {
      "personId": "YOUR_GARY_SINISE_ID",
      "role": "actor",
      "characterName": "Lieutenant Dan",
      "sortOrder": 3
    },
    {
      "personId": "YOUR_ZEMECKIS_ID",
      "role": "director",
      "sortOrder": 1
    }
  ]
}
```

---

## Test Flow

1. **Chuẩn bị:** Tạo trước Movies và People
2. **Test CREATE single:** Tạo 1 actor cho phim
3. **Test CREATE director:** Tạo director (không cần characterName)
4. **Test BULK CREATE:** Tạo nhiều cast cùng lúc
5. **Test GET by Movie ID:** Lấy tất cả cast của phim
6. **Test GET by Person ID:** Lấy tất cả phim của một người
7. **Test GET by Role:** Lấy chỉ actors hoặc directors
8. **Test UPDATE:** Cập nhật characterName hoặc sortOrder
9. **Test DELETE single:** Xóa 1 cast
10. **Test DELETE by Movie ID:** Xóa tất cả cast của phim

---

## Notes

- **characterName bắt buộc:** Chỉ khi role = "actor"
- **role hợp lệ:** actor, director, producer, writer
- **sortOrder:** Dùng để sắp xếp thứ tự hiển thị (1, 2, 3, ...)
- **Duplicate prevention:** Không cho phép cùng người + phim + role + characterName
- **Bulk create:** Tối ưu khi cần thêm nhiều cast cùng lúc
