# Payment Methods API - Postman Test Guide

## Base URL
```
http://localhost:3000/api/payments-method
```

## 1. CREATE Payment Method
**POST** `/api/payments-method`

### Request Type: `form-data`

| Key | Type | Value | Required |
|-----|------|-------|----------|
| code | text | `MOMO` | Yes |
| name | text | `MoMo E-Wallet` | Yes |
| is_active | text | `true` | No (default: true) |
| logo | file | [Select image file] | Yes |

### Example Data Sets:

#### MoMo
```
code: MOMO
name: MoMo E-Wallet
is_active: true
logo: [Upload momo logo image]
```

#### VNPay
```
code: VNPAY
name: VNPay
is_active: true
logo: [Upload vnpay logo image]
```

#### ZaloPay
```
code: ZALOPAY
name: ZaloPay
is_active: true
logo: [Upload zalopay logo image]
```

#### Banking
```
code: BANKING
name: Bank Transfer
is_active: true
logo: [Upload bank icon image]
```

#### Credit Card
```
code: CREDIT_CARD
name: Credit/Debit Card
is_active: true
logo: [Upload card icon image]
```

#### PayPal
```
code: PAYPAL
name: PayPal
is_active: false
logo: [Upload paypal logo image]
```

### Response (201):
```json
{
  "message": "Payment method created successfully",
  "data": {
    "_id": "6789abcd1234567890abcdef",
    "code": "MOMO",
    "name": "MoMo E-Wallet",
    "logo_url": "https://your-cdn.b-cdn.net/payment-logos/1234567890-momo.png",
    "is_active": true,
    "createdAt": "2026-07-02T10:30:00.000Z",
    "updatedAt": "2026-07-02T10:30:00.000Z"
  }
}
```

---

## 2. GET All Payment Methods
**GET** `/api/payments-method`

### Response (200):
```json
{
  "message": "Payment methods retrieved successfully",
  "data": [
    {
      "_id": "6789abcd1234567890abcdef",
      "code": "MOMO",
      "name": "MoMo E-Wallet",
      "logo_url": "https://your-cdn.b-cdn.net/payment-logos/1234567890-momo.png",
      "is_active": true,
      "createdAt": "2026-07-02T10:30:00.000Z",
      "updatedAt": "2026-07-02T10:30:00.000Z"
    },
    {
      "_id": "6789abcd1234567890abcde0",
      "code": "VNPAY",
      "name": "VNPay",
      "logo_url": "https://your-cdn.b-cdn.net/payment-logos/1234567891-vnpay.png",
      "is_active": true,
      "createdAt": "2026-07-02T10:31:00.000Z",
      "updatedAt": "2026-07-02T10:31:00.000Z"
    }
  ],
  "total": 2
}
```

---

## 3. GET Active Payment Methods Only
**GET** `/api/payments-method/active`

### Response (200):
```json
{
  "message": "Active payment methods retrieved successfully",
  "data": [
    {
      "_id": "6789abcd1234567890abcdef",
      "code": "MOMO",
      "name": "MoMo E-Wallet",
      "logo_url": "https://your-cdn.b-cdn.net/payment-logos/1234567890-momo.png",
      "is_active": true,
      "createdAt": "2026-07-02T10:30:00.000Z",
      "updatedAt": "2026-07-02T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 4. GET Payment Method by ID
**GET** `/api/payments-method/id/:id`

### Example:
```
GET /api/payments-method/id/6789abcd1234567890abcdef
```

### Response (200):
```json
{
  "message": "Payment method retrieved successfully",
  "data": {
    "_id": "6789abcd1234567890abcdef",
    "code": "MOMO",
    "name": "MoMo E-Wallet",
    "logo_url": "https://your-cdn.b-cdn.net/payment-logos/1234567890-momo.png",
    "is_active": true,
    "createdAt": "2026-07-02T10:30:00.000Z",
    "updatedAt": "2026-07-02T10:30:00.000Z"
  }
}
```

---

## 5. GET Payment Method by Code
**GET** `/api/payments-method/code/:code`

### Example:
```
GET /api/payments-method/code/MOMO
```

### Response (200):
```json
{
  "message": "Payment method retrieved successfully",
  "data": {
    "_id": "6789abcd1234567890abcdef",
    "code": "MOMO",
    "name": "MoMo E-Wallet",
    "logo_url": "https://your-cdn.b-cdn.net/payment-logos/1234567890-momo.png",
    "is_active": true,
    "createdAt": "2026-07-02T10:30:00.000Z",
    "updatedAt": "2026-07-02T10:30:00.000Z"
  }
}
```

---

## 6. UPDATE Payment Method
**PUT** `/api/payments-method/:id`

### Request Type: `form-data`

| Key | Type | Value | Required |
|-----|------|-------|----------|
| code | text | `MOMO_V2` | No |
| name | text | `MoMo Wallet Updated` | No |
| is_active | text | `false` | No |
| logo | file | [Select new image file] | No |

### Example (Update name and status only):
```
PUT /api/payments-method/6789abcd1234567890abcdef

Form-data:
name: MoMo E-Wallet Pro
is_active: true
```

### Example (Update with new logo):
```
PUT /api/payments-method/6789abcd1234567890abcdef

Form-data:
name: MoMo E-Wallet Pro
logo: [Upload new logo image]
```

### Response (200):
```json
{
  "message": "Payment method updated successfully",
  "data": {
    "_id": "6789abcd1234567890abcdef",
    "code": "MOMO",
    "name": "MoMo E-Wallet Pro",
    "logo_url": "https://your-cdn.b-cdn.net/payment-logos/1234567892-momo-new.png",
    "is_active": true,
    "createdAt": "2026-07-02T10:30:00.000Z",
    "updatedAt": "2026-07-02T11:00:00.000Z"
  }
}
```

---

## 7. DELETE Payment Method
**DELETE** `/api/payments-method/:id`

### Example:
```
DELETE /api/payments-method/6789abcd1234567890abcdef
```

### Response (200):
```json
{
  "message": "Payment method deleted successfully",
  "data": {
    "_id": "6789abcd1234567890abcdef",
    "code": "MOMO",
    "name": "MoMo E-Wallet",
    "logo_url": "https://your-cdn.b-cdn.net/payment-logos/1234567890-momo.png",
    "is_active": true,
    "createdAt": "2026-07-02T10:30:00.000Z",
    "updatedAt": "2026-07-02T10:30:00.000Z"
  }
}
```

---

## Error Responses

### 400 - Bad Request (Missing required fields)
```json
{
  "message": "Code and name are required"
}
```

### 400 - Bad Request (No logo file)
```json
{
  "message": "Logo file is required"
}
```

### 400 - Bad Request (Duplicate code)
```json
{
  "message": "Payment method with this code already exists"
}
```

### 404 - Not Found
```json
{
  "message": "Payment method not found"
}
```

### 500 - Server Error
```json
{
  "message": "Internal Server Error"
}
```

---

## Notes:
1. **Logo Upload**: Logo phải là file ảnh (jpg, png, gif, etc.), max 5MB
2. **Code**: Phải unique, recommend dùng UPPERCASE với underscores (VD: `MOMO`, `VNPAY`, `CREDIT_CARD`)
3. **is_active**: Dùng để enable/disable payment method mà không cần xóa
4. **CDN**: Logo được upload lên Bunny CDN tự động, khi update/delete logo cũ sẽ bị xóa
5. **Testing Order**: 
   - Tạo vài payment methods với CREATE
   - Test GET all và GET active
   - Test GET by ID và code
   - Test UPDATE (cả với và không có logo mới)
   - Test DELETE cuối cùng
