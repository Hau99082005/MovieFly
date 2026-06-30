# Watchlist Controller - Các Lỗi Đã Sửa

## Tổng Quan

Controller watchlist đã được sửa hoàn toàn với nhiều lỗi logic và cải tiến.

---

## Các Lỗi Đã Sửa

### 1. **addToWatchlist** - Logic ngược

**Lỗi cũ:**
```javascript
if (!existingItem) {
  return res.status(400).json({ message: "Movie already in watchlist." });
}
```

**Vấn đề:**
- Logic ngược: `!existingItem` nghĩa là KHÔNG tồn tại
- Nhưng lại báo "already in watchlist"
- Dẫn đến không thể add movie vào watchlist

**Đã sửa:**
```javascript
if (existingItem) {
  return res.status(409).json({ message: "Movie already in watchlist" });
}
```

---

### 2. **removeFromWatchlist** - Sai method

**Lỗi cũ:**
```javascript
const deletedItem = await watchlist.findByIdAndDelete({
  userId: req.userId,
  movieId: movieId,
});
```

**Vấn đề:**
- `findByIdAndDelete()` chỉ nhận `_id` parameter
- Không thể dùng `{ userId, movieId }` object
- Sẽ không tìm thấy và xóa được

**Đã sửa:**
```javascript
const deletedItem = await Watchlist.findOneAndDelete({
  userId: userIdToUse,
  movieId: movieId,
});
```

---

### 3. **getWatchlist** - Logic sai

**Lỗi cũ:**
```javascript
if (!watchlistItems) {
  return res.status(400).json({ message: "No watchlist items found for this user." });
}
```

**Vấn đề:**
- `find()` luôn trả về array, không bao giờ `null`
- Array rỗng `[]` vẫn truthy
- Logic này không bao giờ chạy

**Đã sửa:**
```javascript
const watchlistItems = await Watchlist.find({ userId })
  .populate("movieId")
  .sort({ createdAt: -1 });

return res.status(200).json({
  message: "Watchlist items retrieved successfully",
  data: watchlistItems,
  total: watchlistItems.length,
});
```

---

### 4. **getWatchlistCount** - Logic sai

**Lỗi cũ:**
```javascript
if (!count === 0 || count === null) {
  return res.status(404).json({ message: "No watchlist items found for this user." });
}
```

**Vấn đề:**
- `!count === 0` sai logic (nên là `count === 0`)
- `countDocuments()` luôn trả về number, không bao giờ `null`
- Operator precedence sai: `!count` execute trước `===`

**Đã sửa:**
```javascript
const count = await Watchlist.countDocuments({ userId: userId });

return res.status(200).json({
  message: "Watchlist count retrieved successfully",
  count: count,
});
```

---

### 5. **clearWatchlist** - Không check result

**Lỗi cũ:**
```javascript
const deletedItems = await watchlist.deleteMany({ userId: req.userId });
if (!deletedItems) {
  return res.status(404).json({ message: "No watchlist items found for this user." });
}
```

**Vấn đề:**
- `deleteMany()` luôn trả về object result, không bao giờ falsy
- Cần check `result.deletedCount` thay vì `result`

**Đã sửa:**
```javascript
const result = await Watchlist.deleteMany({ userId: userId });

if (result.deletedCount === 0) {
  return res.status(404).json({ message: "No watchlist items found for this user" });
}

return res.status(200).json({
  message: "Watchlist cleared successfully",
  deletedCount: result.deletedCount,
});
```

---

## Cải Tiến Mới

### 1. **checkInWatchlist** - Endpoint mới

Thêm endpoint để check movie có trong watchlist không:

```javascript
const checkInWatchlist = async (req, res) => {
  const existingItem = await Watchlist.findOne({
    userId: userIdToUse,
    movieId: movieId,
  });

  return res.status(200).json({
    message: "Check completed",
    inWatchlist: !!existingItem,
    data: existingItem || null,
  });
};
```

**Use case:**
- Frontend hiển thị button "Add to Watchlist" hoặc "Remove"
- Show badge "In Watchlist"

---

### 2. **Populate MovieId**

Tất cả GET endpoints tự động populate movieId:

```javascript
.populate("movieId")
```

**Kết quả:**
```json
{
  "movieId": {
    "_id": "xxx",
    "title": "Doraemon Movie",
    "poster_url": "https://...",
    "rating": 7.5,
    ...
  }
}
```

---

### 3. **Sort Order**

Watchlist sort theo mới nhất trước:

```javascript
.sort({ createdAt: -1 })
```

---

### 4. **Better Response Format**

**Trước:**
```json
{
  "message": "...",
  "data": [...]
}
```

**Sau:**
```json
{
  "message": "...",
  "data": [...],
  "total": 5
}
```

---

### 5. **Status Codes Chuẩn**

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `409`: Conflict (duplicate)
- `500`: Server Error

---

### 6. **Flexible userId**

Hỗ trợ cả authentication middleware và testing:

```javascript
const userId = req.query.userId || req.userId;
```

Cho phép:
- Test với query parameter
- Production với JWT authentication

---

### 7. **Return Populated Data**

Khi add to watchlist, return full movie details:

```javascript
const savedItem = await newWatchlistItem.save();
const populatedItem = await Watchlist.findById(savedItem._id)
  .populate("movieId");

return res.status(201).json({
  message: "Movie added to watchlist successfully",
  data: populatedItem,
});
```

---

## So Sánh Trước/Sau

### addToWatchlist

| Aspect | Trước | Sau |
|--------|-------|-----|
| Logic | Ngược | Đúng |
| Status Code | 400 | 409 (conflict) |
| Response | Basic | Populated movie |

### removeFromWatchlist

| Aspect | Trước | Sau |
|--------|-------|-----|
| Method | findByIdAndDelete | findOneAndDelete |
| Parameters | Sai format | Đúng format |
| Working | ❌ Không | ✅ Hoạt động |

### getWatchlist

| Aspect | Trước | Sau |
|--------|-------|-----|
| Empty check | Sai logic | Không cần check |
| Sort | Không | createdAt: -1 |
| Response | Basic | Có total count |

### getWatchlistCount

| Aspect | Trước | Sau |
|--------|-------|-----|
| Logic | `!count === 0` | Luôn return count |
| Error check | Sai | Không cần |
| Response | Conditional | Always success |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | / | Get all watchlist items |
| GET | /count | Get count |
| GET | /check | Check movie in watchlist |
| GET | /:id | Get item by ID |
| POST | / | Add to watchlist |
| DELETE | / | Remove from watchlist |
| DELETE | /clear | Clear all |

---

## Testing

### Test Flow:

1. **Create User & Movie**
2. **Add to Watchlist** → Status 201
3. **Add Same Movie** → Status 409 (duplicate)
4. **Get Watchlist** → Status 200, array có 1 item
5. **Check Movie** → Status 200, inWatchlist: true
6. **Get Count** → Status 200, count: 1
7. **Remove** → Status 200
8. **Get Count** → Status 200, count: 0
9. **Clear** → Status 404 (no items)

---

## Files Changed

1. `controllers/watchlist.js` - Sửa toàn bộ logic
2. `router/watchlist.js` - Tạo mới
3. `index.js` - Thêm watchlist router
4. `POSTMAN_WATCHLIST_TEST.md` - Tài liệu test

---

## Summary

✅ Sửa 5 lỗi logic nghiêm trọng
✅ Thêm 1 endpoint mới (checkInWatchlist)
✅ Auto populate movie details
✅ Sort order mới nhất trước
✅ Status codes chuẩn REST
✅ Better error handling
✅ Flexible userId support
✅ Comprehensive documentation
