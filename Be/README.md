# 🚀 Hướng Dẫn Chạy Project - EV & Battery Trading Platform

[![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.x+-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Second-hand EV & Battery Trading Platform** - Nền tảng giao dịch xe điện và pin đã qua sử dụng

---

## 📖 Tài Liệu Đầy Đủ

📚 **[XEM INDEX CỦA TẤT CẢ TÀI LIỆU](docs/INDEX.md)**

### Tài liệu chính:
- 📖 [README.md](README.md) - Bạn đang đọc
- ⚡ [QUICK_START.md](QUICK_START.md) - Chạy nhanh trong 5 phút
- 📊 [SUMMARY.md](SUMMARY.md) - Tổng kết đầy đủ
- ✅ [CHECKLIST.md](CHECKLIST.md) - Kiểm tra hoàn thiện

### Tài liệu kỹ thuật:
- 🗄️ [DATABASE_DESIGN.md](docs/DATABASE_DESIGN.md) - Thiết kế database
- 📡 [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) - API docs
- 💡 [API_EXAMPLES.md](docs/API_EXAMPLES.md) - Ví dụ API
- 🧪 [TESTING_GUIDE.md](docs/TESTING_GUIDE.md) - Hướng dẫn test
- 📮 [Postman Collection](docs/Postman_Collection.json) - Import Postman

---

## 📋 Yêu Cầu Hệ Thống

- **Node.js**: >= 16.x
- **MongoDB**: >= 5.x (Local hoặc MongoDB Atlas)
- **npm** hoặc **yarn**

---

## 🔧 Cài Đặt

### 1. Clone hoặc vào thư mục project
```bash
cd d:\Ky7\SDN302\Project\Project_SDN
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
File `.env` đã được tạo sẵn với cấu hình mặc định:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ev_battery_platform
JWT_SECRET=dev_secret_key_ev_platform_2024
JWT_EXPIRE=7d
```

**Lưu ý:**
- Nếu dùng MongoDB local, đảm bảo MongoDB đang chạy
- Nếu dùng MongoDB Atlas, thay `MONGO_URI` bằng connection string của bạn

---

## 🚀 Chạy Project

### 1. Khởi động MongoDB (nếu dùng local)
```bash
# Windows - Mở MongoDB Compass hoặc chạy:
mongod
```

### 2. Seed dữ liệu mẫu (lần đầu)
```bash
npm run seed
```

**Kết quả:**
- ✅ 4 users (1 admin + 3 members)
- ✅ 4 vehicles
- ✅ 3 batteries

**Thông tin đăng nhập:**
```
ADMIN:
  Email: admin@evplatform.com
  Password: Admin@123456

MEMBER:
  Email: nguyenvana@gmail.com
  Password: 123456
```

### 3. Chạy server
```bash
# Development mode (tự động restart khi có thay đổi)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: **http://localhost:5000**

---

## 📝 Kiểm Tra API

### Cách 1: Dùng Browser
Mở trình duyệt và truy cập:
```
http://localhost:5000
```

Bạn sẽ thấy:
```json
{
  "success": true,
  "message": "🚀 EV & Battery Trading Platform API is running!",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "vehicles": "/api/vehicles",
    "batteries": "/api/batteries",
    "transactions": "/api/transactions",
    "admin": "/api/admin"
  }
}
```

### Cách 2: Dùng Postman

1. **Đăng nhập:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@evplatform.com",
  "password": "Admin@123456"
}
```

2. **Copy token** từ response

3. **Gọi API khác:**
```http
GET http://localhost:5000/api/vehicles
```

4. **Với API cần authentication:**
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <paste_token_ở_đây>
```

### Cách 3: Dùng cURL (PowerShell)
```powershell
# Đăng nhập
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@evplatform.com\",\"password\":\"Admin@123456\"}'

# Lấy danh sách xe
curl http://localhost:5000/api/vehicles
```

---

## 📂 Cấu Trúc Project

```
Project_SDN/
├── src/
│   ├── config/           # Cấu hình database
│   │   └── db.js
│   ├── controllers/      # Business logic
│   │   ├── authController.js
│   │   ├── vehicleController.js
│   │   ├── batteryController.js
│   │   ├── transactionController.js
│   │   └── adminController.js
│   ├── middlewares/      # Middleware functions
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── models/           # MongoDB schemas
│   │   ├── userModel.js
│   │   ├── vehicleModel.js
│   │   ├── batteryModel.js
│   │   ├── transactionModel.js
│   │   ├── paymentModel.js
│   │   ├── reviewModel.js
│   │   ├── favoriteModel.js
│   │   └── reportModel.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── batteryRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── adminRoutes.js
│   ├── services/         # Business services
│   ├── utils/            # Helper functions
│   │   ├── jwt.js
│   │   ├── response.js
│   │   └── queryHelper.js
│   ├── seeders/          # Seed data scripts
│   │   ├── index.js
│   │   └── clean.js
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
├── docs/                 # Documentation
│   ├── API_DOCUMENTATION.md
│   └── DATABASE_DESIGN.md
├── .env                  # Environment variables
├── .gitignore
└── package.json
```

---

## 🧪 Test Scenarios

### Scenario 1: User Flow (Member)
1. Đăng ký tài khoản mới
2. Đăng nhập
3. Xem danh sách xe
4. Đăng tin bán xe
5. Xem tin đăng của mình
6. Mua 1 xe khác
7. Xem lịch sử giao dịch

### Scenario 2: Admin Flow
1. Đăng nhập với tài khoản admin
2. Xem dashboard thống kê
3. Xem danh sách users
4. Duyệt tin đăng xe
5. Xem tất cả giao dịch

---

## 🛠️ Các Lệnh Hữu Ích

```bash
# Cài đặt dependencies
npm install

# Chạy development mode
npm run dev

# Chạy production mode
npm start

# Seed dữ liệu mẫu
npm run seed

# Xóa toàn bộ dữ liệu
npm run seed:clean
```

---

## 📊 Database

### Kết nối MongoDB Local
```
mongodb://localhost:27017/ev_battery_platform
```

### Kết nối MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster.mongodb.net/ev_battery_platform
```

### Xem database bằng MongoDB Compass
1. Mở MongoDB Compass
2. Connect đến: `mongodb://localhost:27017`
3. Chọn database: `ev_battery_platform`

---

## 🐛 Troubleshooting

### Lỗi: MongoDB connection failed
**Giải pháp:**
- Đảm bảo MongoDB đang chạy
- Kiểm tra `MONGO_URI` trong `.env`

### Lỗi: Port 5000 already in use
**Giải pháp:**
- Đổi PORT trong `.env` (ví dụ: 3000, 8000)
- Hoặc tắt ứng dụng đang dùng port 5000

### Lỗi: Module not found
**Giải pháp:**
```bash
npm install
```

---

## 📚 Tài Liệu Tham Khảo

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Database Design](./docs/DATABASE_DESIGN.md)
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Mongoose Docs](https://mongoosejs.com/)

---

## 📧 Contact & Support

Nếu gặp vấn đề, vui lòng tạo issue hoặc liên hệ.

**Happy Coding! 🚀**
