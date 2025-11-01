# ⚡ Quick Start Guide - 5 Phút Chạy Được Project

## 🎯 Mục Tiêu
Giúp bạn chạy được project và test API trong **5 phút**.

---

## ✅ Checklist Trước Khi Bắt Đầu

- [ ] Đã cài **Node.js** (>= 16.x)
- [ ] Đã cài **MongoDB** (hoặc có MongoDB Atlas account)
- [ ] MongoDB đang chạy (nếu dùng local)

---

## 🚀 3 Bước Nhanh

### Bước 1: Cài Đặt (1 phút)
```bash
cd d:\Ky7\SDN302\Project\Project_SDN
npm install
```

### Bước 2: Seed Dữ Liệu (30 giây)
```bash
npm run seed
```

**Kết quả:**
```
✅ Đã tạo 4 users
✅ Đã tạo 4 vehicles
✅ Đã tạo 3 batteries
```

### Bước 3: Chạy Server (10 giây)
```bash
npm run dev
```

**Thấy message này là OK:**
```
🚀 Server is running at http://localhost:5000
✅ MongoDB Connected Successfully!
```

---

## 🧪 Test Ngay (2 phút)

### Test 1: Health Check
Mở browser, truy cập:
```
http://localhost:5000
```

**Kết quả:** Thấy JSON response với message "API is running!"

### Test 2: Xem Danh Sách Xe
```
http://localhost:5000/api/vehicles
```

**Kết quả:** Thấy 4 xe điện

### Test 3: Đăng Nhập Bằng Postman/Thunder Client

**Request:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@evplatform.com",
  "password": "Admin@123456"
}
```

**Response:** Nhận được token
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
}
```

**COPY TOKEN** này để dùng cho bước tiếp theo!

### Test 4: Gọi API Cần Authentication

**Request:**
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <paste_token_vào_đây>
```

**Response:** Thông tin user đang đăng nhập

---

## 📝 Tài Khoản Test Sẵn

### Admin (Đầy đủ quyền)
```
Email: admin@evplatform.com
Password: Admin@123456
```

### Member (User thường)
```
Email: nguyenvana@gmail.com
Password: 123456
```

---

## 🎯 Demo Scenarios (10 phút)

### Scenario 1: Xem Xe (Guest)
1. GET `/api/vehicles` - Xem tất cả xe
2. GET `/api/vehicles/:id` - Chi tiết 1 xe
3. GET `/api/vehicles?brand=Tesla` - Lọc theo hãng
4. GET `/api/vehicles?price[lte]=1000000000` - Lọc theo giá

### Scenario 2: Member Đăng Tin & Mua
1. POST `/api/auth/login` - Đăng nhập member
2. POST `/api/vehicles` - Đăng tin bán xe
3. GET `/api/vehicles/my/vehicles` - Xem xe của tôi
4. POST `/api/transactions` - Mua 1 xe khác
5. GET `/api/transactions/my-transactions` - Xem lịch sử

### Scenario 3: Admin Quản Lý
1. POST `/api/auth/login` - Đăng nhập admin
2. GET `/api/admin/stats` - Xem dashboard
3. GET `/api/admin/users` - Quản lý users
4. PUT `/api/admin/vehicles/:id/verify` - Duyệt tin đăng

---

## 🛠️ Troubleshooting Nhanh

### ❌ Lỗi: MongoDB connection failed
**Fix:**
```bash
# Kiểm tra MongoDB có chạy không
# Windows: Mở MongoDB Compass
# hoặc chạy: mongod
```

### ❌ Lỗi: Port 5000 already in use
**Fix:** Sửa file `.env`
```env
PORT=3000
```

### ❌ Lỗi: Module not found
**Fix:**
```bash
npm install
```

---

## 📚 Đọc Thêm

- **Chi tiết API:** `docs/API_DOCUMENTATION.md`
- **Hướng dẫn test:** `docs/TESTING_GUIDE.md`
- **Database design:** `docs/DATABASE_DESIGN.md`
- **README đầy đủ:** `README.md`

---

## 🎓 Postman Collection

**Import nhanh:**
1. Mở Postman
2. Import file: `docs/Postman_Collection.json`
3. Set variable `base_url = http://localhost:5000`
4. Chạy request "Login" → Token tự động lưu
5. Test các API khác

---

## ✅ Checklist Demo Cho Giảng Viên

- [ ] Server chạy được
- [ ] Có dữ liệu mẫu
- [ ] Đăng nhập Admin thành công
- [ ] Xem được dashboard stats
- [ ] Tạo được tin đăng mới
- [ ] Mua được sản phẩm
- [ ] Xem được lịch sử giao dịch
- [ ] Admin duyệt được tin đăng

---

## 💡 Tips

1. **Dùng Thunder Client** (VS Code extension) để test nhanh ngay trong VS Code
2. **Mở MongoDB Compass** để xem real-time data trong database
3. **Xem server logs** để debug nếu có lỗi
4. **Seed lại** nếu data bị lỗi: `npm run seed:clean` rồi `npm run seed`

---

**🎉 Xong! Giờ bạn đã sẵn sàng demo project!**
