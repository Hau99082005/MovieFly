# Subscription Plans API - Postman Test Collection

Base URL: `http://localhost:3000/api/subscription-plans`

---

## 1. GET All Subscription Plans
**Endpoint:** `GET /api/subscription-plans`

**Description:** Lấy tất cả gói đăng ký (cả active và inactive)

**Response Success (200):**
```json
{
  "message": "Subscription plans retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Premium",
      "slug": "premium",
      "description": "Gói cao cấp với nhiều tính năng",
      "price": 199000,
      "currency": "VND",
      "duration_days": 30,
      "max_screens": true,
      "max_downloads": 10,
      "video_quality": "4K",
      "has_ads": false,
      "is_active": true,
      "sort_order": 2,
      "createdAt": "2026-07-01T10:30:00.000Z",
      "updatedAt": "2026-07-01T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 2. GET Active Subscription Plans
**Endpoint:** `GET /api/subscription-plans/active`

**Description:** Lấy chỉ các gói đang active (is_active = true)

**Response Success (200):**
```json
{
  "message": "Active subscription plans retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Basic",
      "slug": "basic",
      "price": 49000,
      "is_active": true,
      "sort_order": 1
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Premium",
      "slug": "premium",
      "price": 199000,
      "is_active": true,
      "sort_order": 2
    }
  ],
  "total": 2
}
```

---

## 3. GET Subscription Plan By ID
**Endpoint:** `GET /api/subscription-plans/id/:id`

**Description:** Lấy thông tin gói đăng ký theo ID

**Example:** `GET /api/subscription-plans/id/507f1f77bcf86cd799439011`

**Response Success (200):**
```json
{
  "message": "Subscription plan retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Premium",
    "slug": "premium",
    "description": "Gói cao cấp với nhiều tính năng",
    "price": 199000,
    "currency": "VND",
    "duration_days": 30,
    "max_screens": true,
    "max_downloads": 10,
    "video_quality": "4K",
    "has_ads": false,
    "is_active": true,
    "sort_order": 2,
    "createdAt": "2026-07-01T10:30:00.000Z",
    "updatedAt": "2026-07-01T10:30:00.000Z"
  }
}
```

**Response Error (404):**
```json
{
  "message": "Subscription plan not found"
}
```

---

## 4. GET Subscription Plan By Slug
**Endpoint:** `GET /api/subscription-plans/slug/:slug`

**Description:** Lấy thông tin gói đăng ký theo slug

**Example:** `GET /api/subscription-plans/slug/premium`

**Response Success (200):**
```json
{
  "message": "Subscription plan retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Premium",
    "slug": "premium",
    "price": 199000,
    ...
  }
}
```

---

## 5. CREATE Subscription Plan
**Endpoint:** `POST /api/subscription-plans`

**Description:** Tạo gói đăng ký mới (tự động tạo slug từ name)

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Premium",
  "description": "Gói cao cấp với nhiều tính năng",
  "price": 199000,
  "currency": "VND",
  "duration_days": 30,
  "max_screens": true,
  "max_downloads": 10,
  "video_quality": "4K",
  "has_ads": false,
  "is_active": true,
  "sort_order": 2
}
```

**Required Fields:**
- `name` (string): Tên gói
- `price` (number): Giá (>= 0)
- `currency` (string): Đơn vị tiền tệ (VND, USD, v.v.)
- `duration_days` (number): Số ngày sử dụng (> 0)

**Optional Fields:**
- `slug` (string): Slug tùy chỉnh (nếu không có sẽ tự tạo từ name)
- `description` (string): Mô tả
- `max_screens` (boolean): Cho phép nhiều màn hình (default: false)
- `max_downloads` (number): Số lượng download tối đa (default: 0)
- `video_quality` (string): SD, HD, FHD, 4K (default: HD)
- `has_ads` (boolean): Có quảng cáo (default: false)
- `is_active` (boolean): Kích hoạt (default: true)
- `sort_order` (number): Thứ tự hiển thị (default: 0)

**Response Success (201):**
```json
{
  "message": "Subscription plan created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Premium",
    "slug": "premium",
    "description": "Gói cao cấp với nhiều tính năng",
    "price": 199000,
    "currency": "VND",
    "duration_days": 30,
    "max_screens": true,
    "max_downloads": 10,
    "video_quality": "4K",
    "has_ads": false,
    "is_active": true,
    "sort_order": 2,
    "createdAt": "2026-07-01T10:30:00.000Z",
    "updatedAt": "2026-07-01T10:30:00.000Z"
  }
}
```

**Response Error (400) - Missing Fields:**
```json
{
  "message": "name, price, currency and duration_days are required"
}
```

**Response Error (400) - Invalid Price:**
```json
{
  "message": "Price cannot be negative"
}
```

**Response Error (409) - Duplicate:**
```json
{
  "message": "Subscription plan with the same name or slug already exists"
}
```

---

## 6. UPDATE Subscription Plan
**Endpoint:** `PUT /api/subscription-plans/:id`

**Description:** Cập nhật thông tin gói đăng ký

**Example:** `PUT /api/subscription-plans/507f1f77bcf86cd799439011`

**Headers:**
```
Content-Type: application/json
```

**Request Body (tất cả optional):**
```json
{
  "price": 179000,
  "video_quality": "FHD",
  "is_active": false
}
```

**Response Success (200):**
```json
{
  "message": "Subscription plan updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Premium",
    "slug": "premium",
    "price": 179000,
    "video_quality": "FHD",
    "is_active": false,
    "updatedAt": "2026-07-01T11:00:00.000Z"
  }
}
```

**Response Error (404):**
```json
{
  "message": "Subscription plan not found"
}
```

**Response Error (400) - Invalid Video Quality:**
```json
{
  "message": "Invalid video_quality. Must be: SD, HD, FHD, or 4K"
}
```

---

## 7. DELETE Subscription Plan
**Endpoint:** `DELETE /api/subscription-plans/:id`

**Description:** Xóa gói đăng ký

**Example:** `DELETE /api/subscription-plans/507f1f77bcf86cd799439011`

**Response Success (200):**
```json
{
  "message": "Subscription plan deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Premium",
    "slug": "premium",
    "price": 199000
  }
}
```

**Response Error (404):**
```json
{
  "message": "Subscription plan not found"
}
```

---

## Sample Test Data

### 1. Free Plan (Miễn phí)
```json
{
  "name": "Free",
  "description": "Gói miễn phí với tính năng cơ bản",
  "price": 0,
  "currency": "VND",
  "duration_days": 30,
  "max_screens": false,
  "max_downloads": 0,
  "video_quality": "SD",
  "has_ads": true,
  "is_active": true,
  "sort_order": 0
}
```

### 2. Basic Plan (Cơ bản)
```json
{
  "name": "Basic",
  "description": "Gói cơ bản cho người dùng cá nhân",
  "price": 49000,
  "currency": "VND",
  "duration_days": 30,
  "max_screens": false,
  "max_downloads": 5,
  "video_quality": "HD",
  "has_ads": false,
  "is_active": true,
  "sort_order": 1
}
```

### 3. Standard Plan (Tiêu chuẩn)
```json
{
  "name": "Standard",
  "description": "Gói tiêu chuẩn với chất lượng Full HD",
  "price": 99000,
  "currency": "VND",
  "duration_days": 30,
  "max_screens": true,
  "max_downloads": 10,
  "video_quality": "FHD",
  "has_ads": false,
  "is_active": true,
  "sort_order": 2
}
```

### 4. Premium Plan (Cao cấp)
```json
{
  "name": "Premium",
  "description": "Gói cao cấp với chất lượng 4K",
  "price": 199000,
  "currency": "VND",
  "duration_days": 30,
  "max_screens": true,
  "max_downloads": 20,
  "video_quality": "4K",
  "has_ads": false,
  "is_active": true,
  "sort_order": 3
}
```

### 5. Annual Premium (Gói năm)
```json
{
  "name": "Annual Premium",
  "description": "Gói Premium trọn năm với ưu đãi đặc biệt",
  "price": 1990000,
  "currency": "VND",
  "duration_days": 365,
  "max_screens": true,
  "max_downloads": 50,
  "video_quality": "4K",
  "has_ads": false,
  "is_active": true,
  "sort_order": 4
}
```

---

## Test Flow

1. **Test CREATE:** Tạo 4-5 gói từ mẫu dữ liệu (Free, Basic, Standard, Premium)
2. **Test GET ALL:** Lấy tất cả gói đăng ký
3. **Test GET ACTIVE:** Lấy chỉ gói active
4. **Test GET BY ID:** Lấy theo ID
5. **Test GET BY SLUG:** Lấy theo slug (premium, basic, v.v.)
6. **Test UPDATE:** Cập nhật giá hoặc chất lượng video
7. **Test UPDATE is_active:** Tắt/bật một gói (is_active: false/true)
8. **Test DELETE:** Xóa một gói

---

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| name | String | Tên gói đăng ký |
| slug | String | Slug (tự động tạo từ name) |
| description | String | Mô tả chi tiết |
| price | Number | Giá (VND, USD, v.v.) |
| currency | String | Đơn vị tiền tệ |
| duration_days | Number | Số ngày sử dụng |
| max_screens | Boolean | Cho phép nhiều màn hình cùng lúc |
| max_downloads | Number | Số lượng tải về tối đa |
| video_quality | String | SD, HD, FHD, 4K |
| has_ads | Boolean | Có quảng cáo hay không |
| is_active | Boolean | Gói có đang hoạt động |
| sort_order | Number | Thứ tự hiển thị |

---

## Notes

- **Auto slug:** Tự động tạo từ name (xử lý tiếng Việt)
- **Validation:** price >= 0, duration_days > 0
- **Video quality:** Chỉ chấp nhận SD, HD, FHD, 4K
- **Sort order:** Dùng để sắp xếp hiển thị trên UI (0, 1, 2, 3, ...)
- **Active filter:** Endpoint `/active` chỉ trả về gói đang active
