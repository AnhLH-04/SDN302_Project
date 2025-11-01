# 🧪 Hướng Dẫn Test API - EV & Battery Trading Platform

## 📝 Chuẩn Bị

### 1. Khởi động server
```bash
npm run dev
```

### 2. Seed dữ liệu mẫu (nếu chưa)
```bash
npm run seed
```

### 3. Công cụ test
- **Postman** (khuyến nghị)
- **Insomnia**
- **Thunder Client** (VS Code extension)
- **cURL** (command line)

---

## 🎯 Test Scenarios Chi Tiết

### ✅ SCENARIO 1: Guest User (Khách)

#### 1.1. Xem danh sách xe
```http
GET http://localhost:5000/api/vehicles
```

**Expected Response:**
- Status: 200
- Data: Danh sách xe available

#### 1.2. Xem chi tiết 1 xe
```http
GET http://localhost:5000/api/vehicles/{id}
```
(Copy ID từ danh sách xe ở step 1.1)

**Expected:**
- Status: 200
- ViewCount tăng lên

#### 1.3. Xem danh sách pin
```http
GET http://localhost:5000/api/batteries
```

#### 1.4. Tìm kiếm xe theo hãng
```http
GET http://localhost:5000/api/vehicles?brand=Tesla
```

#### 1.5. Lọc xe theo giá
```http
GET http://localhost:5000/api/vehicles?price[gte]=500000000&price[lte]=1500000000
```

---

### ✅ SCENARIO 2: Member (Thành viên)

#### 2.1. Đăng ký tài khoản mới
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Test",
  "email": "test@gmail.com",
  "phone": "0999888777",
  "password": "123456",
  "address": "Hà Nội"
}
```

**Expected:**
- Status: 201
- Nhận được token
- User được tạo với role "member"

#### 2.2. Đăng nhập
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "nguyenvana@gmail.com",
  "password": "123456"
}
```

**Expected:**
- Status: 200
- Nhận token
- **LƯU TOKEN** để dùng cho các bước sau

#### 2.3. Xem thông tin cá nhân
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer {YOUR_TOKEN}
```

#### 2.4. Đăng tin bán xe
```http
POST http://localhost:5000/api/vehicles
Authorization: Bearer {YOUR_TOKEN}
Content-Type: application/json

{
  "title": "VinFast VF9 2024 - Mới 100%",
  "brand": "VinFast",
  "model": "VF9",
  "year": 2024,
  "condition": "new",
  "mileage": 0,
  "price": 1500000000,
  "batteryCapacity": 123,
  "batteryHealth": 100,
  "range": 680,
  "color": "Xanh",
  "description": "VinFast VF9 hoàn toàn mới",
  "features": ["Autopilot", "7 chỗ"],
  "location": "Hà Nội"
}
```

**Expected:**
- Status: 201
- Xe được tạo với sellerId = current user
- suggestedPrice được tự động tính

#### 2.5. Xem danh sách xe của tôi
```http
GET http://localhost:5000/api/vehicles/my/vehicles
Authorization: Bearer {YOUR_TOKEN}
```

**Expected:**
- Hiển thị xe vừa đăng ở step 2.4

#### 2.6. Cập nhật thông tin xe
```http
PUT http://localhost:5000/api/vehicles/{vehicle_id}
Authorization: Bearer {YOUR_TOKEN}
Content-Type: application/json

{
  "price": 1450000000,
  "description": "Giảm giá đặc biệt"
}
```

#### 2.7. Mua 1 xe khác (của người khác)
**Bước 1:** Lấy ID của xe không phải do mình đăng
```http
GET http://localhost:5000/api/vehicles
```

**Bước 2:** Tạo transaction mua xe
```http
POST http://localhost:5000/api/transactions
Authorization: Bearer {YOUR_TOKEN}
Content-Type: application/json

{
  "itemType": "vehicle",
  "itemId": "{id_xe_muốn_mua}",
  "paymentMethod": "online",
  "notes": "Tôi muốn mua xe này"
}
```

**Expected:**
- Status: 201
- Transaction được tạo
- Xe chuyển sang status "pending"
- Payment record được tạo

#### 2.8. Xem lịch sử giao dịch
```http
# Giao dịch mua
GET http://localhost:5000/api/transactions/my-transactions?type=buy
Authorization: Bearer {YOUR_TOKEN}

# Giao dịch bán
GET http://localhost:5000/api/transactions/my-transactions?type=sell
Authorization: Bearer {YOUR_TOKEN}
```

#### 2.9. Đổi mật khẩu
```http
PUT http://localhost:5000/api/auth/change-password
Authorization: Bearer {YOUR_TOKEN}
Content-Type: application/json

{
  "currentPassword": "123456",
  "newPassword": "654321"
}
```

---

### ✅ SCENARIO 3: Admin

#### 3.1. Đăng nhập Admin
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@evplatform.com",
  "password": "Admin@123456"
}
```

**LƯU ADMIN TOKEN**

#### 3.2. Xem Dashboard thống kê
```http
GET http://localhost:5000/api/admin/stats
Authorization: Bearer {ADMIN_TOKEN}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 4,
      "totalVehicles": 5,
      "totalBatteries": 3,
      "totalTransactions": 1,
      "completedTransactions": 0,
      "pendingTransactions": 1,
      "totalRevenue": 0,
      "totalCommission": 0
    }
  }
}
```

#### 3.3. Xem tất cả users
```http
GET http://localhost:5000/api/admin/users
Authorization: Bearer {ADMIN_TOKEN}
```

#### 3.4. Khóa tài khoản user
```http
PUT http://localhost:5000/api/admin/users/{user_id}/status
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "isActive": false
}
```

**Test:** User bị khóa không thể đăng nhập

#### 3.5. Duyệt tin đăng xe (Verify)
```http
PUT http://localhost:5000/api/admin/vehicles/{vehicle_id}/verify
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "isVerified": true,
  "status": "available"
}
```

#### 3.6. Ẩn tin đăng vi phạm
```http
PUT http://localhost:5000/api/admin/vehicles/{vehicle_id}/verify
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "status": "hidden"
}
```

#### 3.7. Xem tất cả giao dịch
```http
GET http://localhost:5000/api/transactions
Authorization: Bearer {ADMIN_TOKEN}
```

---

## 🔍 Test Cases Nâng Cao

### Test 1: Không thể mua xe của chính mình
```http
POST http://localhost:5000/api/transactions
Authorization: Bearer {TOKEN_CỦA_NGƯỜI_BÁN}
Content-Type: application/json

{
  "itemType": "vehicle",
  "itemId": "{id_xe_của_chính_mình}"
}
```

**Expected:**
- Status: 400
- Message: "Bạn không thể mua sản phẩm của chính mình"

### Test 2: Chỉ owner mới được update xe
Đăng nhập user A, cố gắng update xe của user B:

```http
PUT http://localhost:5000/api/vehicles/{xe_của_B}
Authorization: Bearer {TOKEN_CỦA_A}
```

**Expected:**
- Status: 403
- Message: "Bạn không có quyền cập nhật xe này"

### Test 3: Guest không được tạo tin đăng
```http
POST http://localhost:5000/api/vehicles
# KHÔNG có Authorization header
Content-Type: application/json

{ ... }
```

**Expected:**
- Status: 401
- Message: "Vui lòng đăng nhập"

### Test 4: Tìm kiếm nâng cao
```http
# Xe Tesla, năm >= 2022, giá < 2 tỷ, sắp xếp giá tăng dần
GET http://localhost:5000/api/vehicles?brand=Tesla&year[gte]=2022&price[lte]=2000000000&sort=price
```

### Test 5: Pagination
```http
# Trang 1, 2 items/trang
GET http://localhost:5000/api/vehicles?page=1&limit=2

# Trang 2
GET http://localhost:5000/api/vehicles?page=2&limit=2
```

---

## ❌ Test Error Cases

### 1. Đăng ký với email đã tồn tại
```http
POST http://localhost:5000/api/auth/register

{
  "email": "admin@evplatform.com",  # Email đã tồn tại
  ...
}
```

**Expected:** Status 400

### 2. Đăng nhập sai password
```http
POST http://localhost:5000/api/auth/login

{
  "email": "admin@evplatform.com",
  "password": "wrong_password"
}
```

**Expected:** Status 401

### 3. Token hết hạn/không hợp lệ
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer invalid_token_here
```

**Expected:** Status 401

### 4. Thiếu required fields
```http
POST http://localhost:5000/api/vehicles
Authorization: Bearer {TOKEN}

{
  "title": "Test"
  # Thiếu brand, model, year, price...
}
```

**Expected:** Status 400 với validation errors

---

## 📊 Checklist Hoàn Chỉnh

### Authentication ✅
- [ ] Đăng ký thành công
- [ ] Đăng ký fail (email trùng)
- [ ] Đăng nhập thành công
- [ ] Đăng nhập fail (sai password)
- [ ] Lấy thông tin user
- [ ] Cập nhật profile
- [ ] Đổi mật khẩu

### Vehicles ✅
- [ ] Xem danh sách (guest)
- [ ] Xem chi tiết
- [ ] Tạo tin đăng (member)
- [ ] Cập nhật tin đăng (owner)
- [ ] Xóa tin đăng (owner)
- [ ] Tìm kiếm/lọc
- [ ] Pagination

### Batteries ✅
- [ ] CRUD operations tương tự Vehicles

### Transactions ✅
- [ ] Tạo giao dịch mua
- [ ] Xem lịch sử (mua & bán)
- [ ] Cập nhật status (seller)
- [ ] Chi tiết giao dịch

### Admin ✅
- [ ] Xem stats
- [ ] Quản lý users (list, block, delete)
- [ ] Duyệt tin đăng
- [ ] Xem tất cả giao dịch

---

## 🎓 Tips

1. **Lưu Token:** Sau khi login, copy token và lưu vào Postman environment
2. **Test Tuần Tự:** Test theo thứ tự scenario để dễ hiểu flow
3. **Check Database:** Dùng MongoDB Compass để verify data sau mỗi action
4. **Kiểm tra Console:** Xem server logs để debug

---

## 📦 Import Postman Collection

1. Mở Postman
2. Click **Import**
3. Chọn file `docs/Postman_Collection.json`
4. Set environment variable:
   - `base_url`: `http://localhost:5000`
   - `token`: (sẽ tự động set sau khi login)

---

**Happy Testing! 🚀**
