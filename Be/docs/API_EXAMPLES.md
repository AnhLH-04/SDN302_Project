# 📝 API Examples - Copy & Paste Ready

Các ví dụ API sẵn sàng để copy và test ngay.

## 🔐 Authentication

### 1. Đăng Ký Tài Khoản Mới
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn Test",
  "email": "test@example.com",
  "phone": "0987654321",
  "password": "123456",
  "address": "Hà Nội"
}
```

### 2. Đăng Nhập Admin
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@evplatform.com",
  "password": "Admin@123456"
}
```

### 3. Đăng Nhập Member
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "nguyenvana@gmail.com",
  "password": "123456"
}
```

### 4. Xem Thông Tin Của Tôi
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Cập Nhật Profile
```http
PUT http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Tên Mới",
  "phone": "0999888777",
  "address": "Hồ Chí Minh"
}
```

---

## 🚗 Vehicles

### 1. Xem Tất Cả Xe (Không cần login)
```http
GET http://localhost:5000/api/vehicles
```

### 2. Xem Xe Với Pagination
```http
GET http://localhost:5000/api/vehicles?page=1&limit=5
```

### 3. Lọc Xe Theo Hãng
```http
GET http://localhost:5000/api/vehicles?brand=Tesla
```

### 4. Lọc Theo Giá (500tr - 1.5 tỷ)
```http
GET http://localhost:5000/api/vehicles?price[gte]=500000000&price[lte]=1500000000
```

### 5. Lọc Theo Năm (>= 2022)
```http
GET http://localhost:5000/api/vehicles?year[gte]=2022
```

### 6. Sắp Xếp Theo Giá Tăng Dần
```http
GET http://localhost:5000/api/vehicles?sort=price
```

### 7. Sắp Xếp Theo Giá Giảm Dần
```http
GET http://localhost:5000/api/vehicles?sort=-price
```

### 8. Tìm Kiếm Text
```http
GET http://localhost:5000/api/vehicles?search=Tesla Model
```

### 9. Kết Hợp Nhiều Filter
```http
GET http://localhost:5000/api/vehicles?brand=VinFast&year[gte]=2023&price[lte]=1000000000&sort=-createdAt
```

### 10. Xem Chi Tiết 1 Xe
```http
GET http://localhost:5000/api/vehicles/674d1234567890abcdef1234
```
(Thay ID thật từ danh sách xe)

### 11. Đăng Tin Bán Xe Mới
```http
POST http://localhost:5000/api/vehicles
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Tesla Model Y 2024 - Dual Motor",
  "brand": "Tesla",
  "model": "Model Y",
  "year": 2024,
  "condition": "new",
  "mileage": 0,
  "price": 1800000000,
  "batteryCapacity": 75,
  "batteryHealth": 100,
  "range": 533,
  "color": "Trắng Ngọc Trai",
  "description": "Tesla Model Y hoàn toàn mới, chưa đăng ký, full option cao cấp nhất",
  "images": [
    "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800",
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"
  ],
  "features": [
    "Autopilot Full Self Driving",
    "7 chỗ ngồi",
    "Cốp sau tự động",
    "Sạc nhanh Supercharger",
    "Hệ thống âm thanh Premium"
  ],
  "location": "Hà Nội"
}
```

### 12. Cập Nhật Thông Tin Xe
```http
PUT http://localhost:5000/api/vehicles/YOUR_VEHICLE_ID
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "price": 1750000000,
  "description": "Giảm giá đặc biệt cuối tuần!"
}
```

### 13. Xóa Xe
```http
DELETE http://localhost:5000/api/vehicles/YOUR_VEHICLE_ID
Authorization: Bearer YOUR_TOKEN_HERE
```

### 14. Xem Xe Của Tôi
```http
GET http://localhost:5000/api/vehicles/my/vehicles
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🔋 Batteries

### 1. Xem Tất Cả Pin
```http
GET http://localhost:5000/api/batteries
```

### 2. Lọc Pin Theo Dung Lượng (>= 70kWh)
```http
GET http://localhost:5000/api/batteries?capacity[gte]=70
```

### 3. Lọc Pin Theo Độ Chai (>= 90%)
```http
GET http://localhost:5000/api/batteries?health[gte]=90
```

### 4. Đăng Tin Bán Pin
```http
POST http://localhost:5000/api/batteries
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Pin Panasonic 100kWh - Tháo từ Tesla Model S",
  "brand": "Panasonic",
  "type": "Lithium-ion",
  "capacity": 100,
  "health": 96,
  "cycleCount": 80,
  "manufactureYear": 2023,
  "condition": "excellent",
  "price": 280000000,
  "compatibleVehicles": [
    "Tesla Model S",
    "Tesla Model X"
  ],
  "warranty": "Còn 4 năm bảo hành chính hãng",
  "description": "Pin Panasonic chất lượng cao, tháo từ Tesla Model S 2023, độ chai rất thấp, còn nguyên seal.",
  "images": [
    "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800"
  ],
  "location": "Hồ Chí Minh"
}
```

### 5. Xem Pin Của Tôi
```http
GET http://localhost:5000/api/batteries/my/batteries
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 💰 Transactions

### 1. Tạo Giao Dịch Mua Xe
```http
POST http://localhost:5000/api/transactions
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "itemType": "vehicle",
  "itemId": "674d1234567890abcdef1234",
  "paymentMethod": "online",
  "notes": "Tôi muốn mua xe này, vui lòng liên hệ"
}
```

### 2. Tạo Giao Dịch Mua Pin
```http
POST http://localhost:5000/api/transactions
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "itemType": "battery",
  "itemId": "674d9876543210fedcba4321",
  "paymentMethod": "bank_transfer",
  "notes": "Thanh toán chuyển khoản"
}
```

### 3. Xem Lịch Sử Mua Của Tôi
```http
GET http://localhost:5000/api/transactions/my-transactions?type=buy
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Xem Lịch Sử Bán Của Tôi
```http
GET http://localhost:5000/api/transactions/my-transactions?type=sell
Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Xem Tất Cả Giao Dịch (Mua + Bán)
```http
GET http://localhost:5000/api/transactions/my-transactions
Authorization: Bearer YOUR_TOKEN_HERE
```

### 6. Xem Chi Tiết 1 Giao Dịch
```http
GET http://localhost:5000/api/transactions/674d5555666677778888999
Authorization: Bearer YOUR_TOKEN_HERE
```

### 7. Cập Nhật Trạng Thái Giao Dịch (Seller)
```http
PUT http://localhost:5000/api/transactions/674d5555666677778888999/status
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "status": "confirmed"
}
```

### 8. Hoàn Thành Giao Dịch
```http
PUT http://localhost:5000/api/transactions/674d5555666677778888999/status
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "status": "completed"
}
```

### 9. Hủy Giao Dịch
```http
PUT http://localhost:5000/api/transactions/674d5555666677778888999/status
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "status": "cancelled"
}
```

---

## 👨‍💼 Admin APIs

### 1. Xem Dashboard Stats
```http
GET http://localhost:5000/api/admin/stats
Authorization: Bearer ADMIN_TOKEN_HERE
```

### 2. Xem Tất Cả Users
```http
GET http://localhost:5000/api/admin/users
Authorization: Bearer ADMIN_TOKEN_HERE
```

### 3. Khóa Tài Khoản User
```http
PUT http://localhost:5000/api/admin/users/USER_ID_HERE/status
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "isActive": false
}
```

### 4. Mở Khóa Tài Khoản
```http
PUT http://localhost:5000/api/admin/users/USER_ID_HERE/status
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "isActive": true
}
```

### 5. Xóa User
```http
DELETE http://localhost:5000/api/admin/users/USER_ID_HERE
Authorization: Bearer ADMIN_TOKEN_HERE
```

### 6. Duyệt Tin Đăng Xe (Verify)
```http
PUT http://localhost:5000/api/admin/vehicles/VEHICLE_ID_HERE/verify
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "isVerified": true,
  "status": "available"
}
```

### 7. Ẩn Tin Đăng Vi Phạm
```http
PUT http://localhost:5000/api/admin/vehicles/VEHICLE_ID_HERE/verify
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "status": "hidden"
}
```

### 8. Duyệt Pin
```http
PUT http://localhost:5000/api/admin/batteries/BATTERY_ID_HERE/verify
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "isVerified": true
}
```

### 9. Xem Tất Cả Giao Dịch (Admin)
```http
GET http://localhost:5000/api/transactions
Authorization: Bearer ADMIN_TOKEN_HERE
```

### 10. Xem Tất Cả Báo Cáo
```http
GET http://localhost:5000/api/admin/reports
Authorization: Bearer ADMIN_TOKEN_HERE
```

### 11. Xử Lý Báo Cáo
```http
PUT http://localhost:5000/api/admin/reports/REPORT_ID_HERE
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "status": "resolved",
  "adminNote": "Đã xử lý và gỡ bỏ tin đăng vi phạm"
}
```

---

## 🎯 Use Cases Hoàn Chỉnh

### Use Case 1: User Mua Xe

**Bước 1:** Xem danh sách xe
```http
GET http://localhost:5000/api/vehicles
```

**Bước 2:** Xem chi tiết xe muốn mua
```http
GET http://localhost:5000/api/vehicles/674d1234567890abcdef1234
```

**Bước 3:** Đăng nhập (nếu chưa)
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "nguyenvana@gmail.com",
  "password": "123456"
}
```

**Bước 4:** Tạo giao dịch mua
```http
POST http://localhost:5000/api/transactions
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "itemType": "vehicle",
  "itemId": "674d1234567890abcdef1234",
  "paymentMethod": "online"
}
```

**Bước 5:** Xem lịch sử giao dịch
```http
GET http://localhost:5000/api/transactions/my-transactions
Authorization: Bearer YOUR_TOKEN
```

---

### Use Case 2: Seller Bán Xe

**Bước 1:** Đăng nhập
```http
POST http://localhost:5000/api/auth/login
```

**Bước 2:** Đăng tin bán xe
```http
POST http://localhost:5000/api/vehicles
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{ ... thông tin xe ... }
```

**Bước 3:** Xem xe của mình
```http
GET http://localhost:5000/api/vehicles/my/vehicles
Authorization: Bearer YOUR_TOKEN
```

**Bước 4:** Khi có người mua, xem thông báo giao dịch
```http
GET http://localhost:5000/api/transactions/my-transactions?type=sell
Authorization: Bearer YOUR_TOKEN
```

**Bước 5:** Xác nhận giao dịch
```http
PUT http://localhost:5000/api/transactions/TRANSACTION_ID/status
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Bước 6:** Hoàn thành giao dịch
```http
PUT http://localhost:5000/api/transactions/TRANSACTION_ID/status
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "status": "completed"
}
```

---

## 💡 Tips

1. **Thay YOUR_TOKEN_HERE** bằng token nhận được từ login
2. **Thay ID** (674d...) bằng ID thật từ database của bạn
3. **Test tuần tự** theo use case để hiểu flow
4. **Dùng Postman** để lưu token tự động

---

**🎉 Ready to test!**
