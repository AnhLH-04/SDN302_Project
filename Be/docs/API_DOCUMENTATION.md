# 📚 API Documentation - EV & Battery Trading Platform

## Base URL
```
http://localhost:5000/api
```

## Authentication
Sử dụng JWT Token trong header:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth Endpoints

### 1. Đăng ký tài khoản
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "example@gmail.com",
  "phone": "0912345678",
  "password": "123456",
  "address": "Hà Nội"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@evplatform.com",
  "password": "Admin@123456"
}
```

### 3. Lấy thông tin user hiện tại
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 4. Cập nhật thông tin
```http
PUT /api/auth/me
Authorization: Bearer <token>

{
  "name": "Tên mới",
  "phone": "0987654321",
  "address": "Địa chỉ mới"
}
```

### 5. Đổi mật khẩu
```http
PUT /api/auth/change-password
Authorization: Bearer <token>

{
  "currentPassword": "123456",
  "newPassword": "654321"
}
```

---

## 🚗 Vehicle Endpoints

### 1. Lấy danh sách xe (có filter, sort, pagination)
```http
GET /api/vehicles?page=1&limit=10&sort=-createdAt&brand=Tesla&status=available
```

**Query Parameters:**
- `page`: Trang (default: 1)
- `limit`: Số lượng/trang (default: 10)
- `sort`: Sắp xếp (ví dụ: `-createdAt`, `price`, `-price`)
- `brand`: Lọc theo hãng
- `year`: Lọc theo năm
- `price[gte]`: Giá từ
- `price[lte]`: Giá đến
- `condition`: Tình trạng
- `search`: Tìm kiếm text

**Example:**
```
/api/vehicles?brand=Tesla&price[gte]=500000000&price[lte]=2000000000&sort=price
```

### 2. Lấy chi tiết 1 xe
```http
GET /api/vehicles/:id
```

### 3. Đăng tin bán xe
```http
POST /api/vehicles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tesla Model 3 2022",
  "brand": "Tesla",
  "model": "Model 3",
  "year": 2022,
  "condition": "good",
  "mileage": 15000,
  "price": 1200000000,
  "batteryCapacity": 82,
  "batteryHealth": 95,
  "range": 580,
  "color": "Đen",
  "description": "Xe còn mới...",
  "images": ["url1", "url2"],
  "features": ["Autopilot", "Premium Sound"],
  "location": "Hà Nội"
}
```

### 4. Cập nhật thông tin xe
```http
PUT /api/vehicles/:id
Authorization: Bearer <token>

{
  "price": 1150000000,
  "status": "available"
}
```

### 5. Xóa xe
```http
DELETE /api/vehicles/:id
Authorization: Bearer <token>
```

### 6. Lấy xe của tôi
```http
GET /api/vehicles/my/vehicles
Authorization: Bearer <token>
```

---

## 🔋 Battery Endpoints

Tương tự như Vehicle:

```http
GET /api/batteries
GET /api/batteries/:id
POST /api/batteries
PUT /api/batteries/:id
DELETE /api/batteries/:id
GET /api/batteries/my/batteries
```

**Example POST:**
```json
{
  "title": "Pin LG Energy 82kWh",
  "brand": "LG Energy",
  "type": "Lithium-ion",
  "capacity": 82,
  "health": 95,
  "cycleCount": 150,
  "manufactureYear": 2022,
  "condition": "excellent",
  "price": 180000000,
  "compatibleVehicles": ["Tesla Model 3"],
  "warranty": "Còn 3 năm",
  "description": "Pin tốt...",
  "location": "Hà Nội"
}
```

---

## 💰 Transaction Endpoints

### 1. Tạo giao dịch (Mua ngay)
```http
POST /api/transactions
Authorization: Bearer <token>

{
  "itemType": "vehicle",  // hoặc "battery"
  "itemId": "674d1234567890abcdef1234",
  "paymentMethod": "online",
  "notes": "Ghi chú nếu có"
}
```

### 2. Lấy lịch sử giao dịch của tôi
```http
GET /api/transactions/my-transactions?type=buy
```
- `type=buy`: Giao dịch mua
- `type=sell`: Giao dịch bán
- Không có type: Tất cả

### 3. Chi tiết giao dịch
```http
GET /api/transactions/:id
Authorization: Bearer <token>
```

### 4. Cập nhật trạng thái giao dịch (Seller/Admin)
```http
PUT /api/transactions/:id/status
Authorization: Bearer <token>

{
  "status": "completed"  // confirmed, completed, cancelled, disputed
}
```

### 5. Lấy tất cả giao dịch (Admin)
```http
GET /api/transactions
Authorization: Bearer <token> (Admin)
```

---

## 👨‍💼 Admin Endpoints

**Tất cả endpoints yêu cầu role Admin**

### 1. Dashboard - Thống kê
```http
GET /api/admin/stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 10,
      "totalVehicles": 25,
      "totalBatteries": 15,
      "totalTransactions": 50,
      "completedTransactions": 40,
      "pendingTransactions": 10,
      "totalRevenue": 500000000,
      "totalCommission": 25000000
    }
  }
}
```

### 2. Quản lý Users
```http
GET /api/admin/users
```

### 3. Khóa/Mở khóa User
```http
PUT /api/admin/users/:id/status

{
  "isActive": false  // false = khóa, true = mở khóa
}
```

### 4. Xóa User
```http
DELETE /api/admin/users/:id
```

### 5. Duyệt/Ẩn tin đăng xe
```http
PUT /api/admin/vehicles/:id/verify

{
  "isVerified": true,
  "status": "available"  // hoặc "hidden"
}
```

### 6. Duyệt/Ẩn tin đăng pin
```http
PUT /api/admin/batteries/:id/verify

{
  "isVerified": true,
  "status": "available"
}
```

### 7. Xem tất cả báo cáo
```http
GET /api/admin/reports
```

### 8. Xử lý báo cáo
```http
PUT /api/admin/reports/:id

{
  "status": "resolved",  // reviewing, resolved, rejected
  "adminNote": "Đã xử lý..."
}
```

---

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Lỗi mô tả",
  "errors": ["Chi tiết lỗi 1", "Chi tiết lỗi 2"]
}
```

---

## 🔑 Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (dữ liệu không hợp lệ)
- `401`: Unauthorized (chưa đăng nhập)
- `403`: Forbidden (không có quyền)
- `404`: Not Found
- `500`: Server Error

---

## 🎯 Sample Test Flow

### 1. Đăng ký & Đăng nhập
```bash
# Đăng ký
POST /api/auth/register

# Đăng nhập
POST /api/auth/login
# Lưu token nhận được
```

### 2. Xem danh sách xe
```bash
GET /api/vehicles
```

### 3. Đăng tin bán xe
```bash
POST /api/vehicles
# Với token trong header
```

### 4. Mua xe
```bash
POST /api/transactions
{
  "itemType": "vehicle",
  "itemId": "id_của_xe"
}
```

### 5. Xem lịch sử giao dịch
```bash
GET /api/transactions/my-transactions
```

---

## 🔍 Advanced Queries

### Tìm xe Tesla giá từ 500tr - 2 tỷ, sắp xếp giá tăng dần
```
GET /api/vehicles?brand=Tesla&price[gte]=500000000&price[lte]=2000000000&sort=price
```

### Tìm pin dung lượng > 70kWh, độ chai > 90%
```
GET /api/batteries?capacity[gte]=70&health[gte]=90
```

### Tìm kiếm text
```
GET /api/vehicles?search=Model 3
```
