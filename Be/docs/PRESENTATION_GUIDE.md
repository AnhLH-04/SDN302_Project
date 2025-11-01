# 🎤 Hướng Dẫn Presentation - Demo Project

## 📊 Chuẩn Bị Trước Khi Demo (10 phút trước)

### ✅ Checklist
- [ ] Server đang chạy (`npm run dev`)
- [ ] MongoDB đã connect
- [ ] Postman đã mở và import collection
- [ ] Browser đã mở tab `http://localhost:5000`
- [ ] MongoDB Compass đã mở và connect
- [ ] VS Code đã mở project
- [ ] Slides/Documents đã chuẩn bị

### ✅ Test Nhanh
```bash
# Test server
curl http://localhost:5000

# Test login
POST /api/auth/login (trong Postman)
```

---

## 🎯 Cấu Trúc Presentation (15-20 phút)

### Part 1: Giới Thiệu Tổng Quan (3 phút)

**Slides cần có:**
1. **Tên đề tài:** "Second-hand EV & Battery Trading Platform"
2. **Mục tiêu:** 
   - Nền tảng giao dịch xe điện & pin đã qua sử dụng
   - Hỗ trợ 3 vai trò: Guest, Member, Admin
3. **Tech Stack:**
   - Backend: Node.js + Express
   - Database: MongoDB
   - Authentication: JWT
   - Architecture: MVC + RESTful API

**Script:**
```
"Xin chào, em xin giới thiệu đề tài 'Nền tảng giao dịch xe điện và pin đã qua sử dụng'.
Hệ thống được xây dựng bằng Node.js, Express, MongoDB, với kiến trúc MVC và RESTful API.
Hệ thống hỗ trợ 3 vai trò chính: Guest (khách), Member (thành viên), và Admin (quản trị viên)."
```

---

### Part 2: Database Design (2 phút)

**Show:**
- File `DATABASE_DESIGN.md`
- ERD diagram (vẽ hoặc show text)

**Highlight 8 Models:**
1. User - Quản lý người dùng
2. Vehicle - Xe điện
3. Battery - Pin
4. Transaction - Giao dịch
5. Payment - Thanh toán
6. Review - Đánh giá
7. Favorite - Yêu thích
8. Report - Báo cáo

**Script:**
```
"Database được thiết kế với 8 models chính, bao gồm User, Vehicle, Battery, 
Transaction, Payment, Review, Favorite và Report. Các models có mối quan hệ 
rõ ràng và được index để tối ưu performance."
```

---

### Part 3: Demo Chức Năng Chính (10 phút)

#### 3.1. Guest User (1 phút)

**Demo:**
```http
1. GET http://localhost:5000/api/vehicles
   → Show danh sách xe

2. GET http://localhost:5000/api/vehicles/:id
   → Show chi tiết 1 xe

3. GET http://localhost:5000/api/vehicles?brand=Tesla&price[lte]=2000000000
   → Show filter
```

**Script:**
```
"Đầu tiên là chức năng cho Guest - khách vãng lai. Guest có thể xem danh sách 
xe, xem chi tiết, và sử dụng tính năng tìm kiếm, lọc theo nhiều tiêu chí."
```

#### 3.2. Member - Đăng Ký & Đăng Nhập (2 phút)

**Demo:**
```http
1. POST /api/auth/register
   Body: {
     "name": "Demo User",
     "email": "demo@test.com",
     "password": "123456"
   }
   → Show response với token

2. POST /api/auth/login
   Body: {
     "email": "nguyenvana@gmail.com",
     "password": "123456"
   }
   → Copy token

3. GET /api/auth/me
   Header: Authorization: Bearer {token}
   → Show user info
```

**Show MongoDB Compass:**
- Users collection → user mới được tạo
- Password đã hash

**Script:**
```
"Member có thể đăng ký tài khoản mới. Password được hash bằng bcrypt để bảo mật.
Sau khi đăng nhập, hệ thống trả về JWT token để sử dụng cho các request tiếp theo."
```

#### 3.3. Member - Đăng Tin Bán (2 phút)

**Demo:**
```http
POST /api/vehicles
Authorization: Bearer {token}
Body: {
  "title": "VinFast VF9 2024 Demo",
  "brand": "VinFast",
  "model": "VF9",
  "year": 2024,
  "price": 1500000000,
  "batteryCapacity": 123,
  "batteryHealth": 100,
  "location": "Hà Nội",
  ...
}
```

**Show:**
- Response: suggestedPrice được tự động tính
- MongoDB Compass: Vehicle mới được tạo
- GET /api/vehicles/my/vehicles → Show xe vừa đăng

**Script:**
```
"Member có thể đăng tin bán xe. Hệ thống có AI gợi ý giá dựa trên các thông số 
như năm sản xuất, số km đã đi, độ chai pin... Đây là mô phỏng đơn giản của AI pricing."
```

#### 3.4. Member - Mua Xe (2 phút)

**Demo:**
```http
1. GET /api/vehicles
   → Chọn 1 xe để mua (của người khác)

2. POST /api/transactions
   Body: {
     "itemType": "vehicle",
     "itemId": "xxx",
     "paymentMethod": "online"
   }
   → Transaction created

3. GET /api/transactions/my-transactions?type=buy
   → Show lịch sử mua

4. GET /api/transactions/my-transactions?type=sell
   → Show lịch sử bán
```

**Show MongoDB:**
- Transactions collection
- Payments collection
- Vehicle status changed to "pending"

**Script:**
```
"Member có thể mua xe bằng tính năng 'Mua ngay'. Hệ thống tự động tạo transaction,
tính phí hoa hồng 5%, tạo payment record, và cập nhật trạng thái xe."
```

#### 3.5. Admin Functions (3 phút)

**Demo:**
```http
1. Login as Admin
   POST /api/auth/login
   Body: {
     "email": "admin@evplatform.com",
     "password": "Admin@123456"
   }

2. GET /api/admin/stats
   → Show dashboard:
     - Total users
     - Total vehicles
     - Total transactions
     - Revenue & Commission

3. GET /api/admin/users
   → Show all users

4. PUT /api/admin/users/:id/status
   Body: { "isActive": false }
   → Block user

5. PUT /api/admin/vehicles/:id/verify
   Body: { 
     "isVerified": true,
     "status": "available"
   }
   → Verify listing

6. GET /api/transactions
   → Show all transactions
```

**Show:**
- Dashboard stats
- User management
- Vehicle verification
- Transaction monitoring

**Script:**
```
"Admin có dashboard thống kê tổng quan về users, vehicles, transactions, doanh thu.
Admin có thể quản lý users (khóa/mở khóa), duyệt tin đăng, và theo dõi tất cả giao dịch."
```

---

### Part 4: Highlights & Technical Points (3 phút)

**Show Code:**
1. **MVC Architecture**
   - Show folder structure
   - Controllers, Models, Routes

2. **Middleware**
   - Authentication middleware
   - Authorization (role-based)
   - Error handling

3. **Security**
   - Password hashing (bcrypt)
   - JWT token
   - Input validation

4. **Advanced Features**
   - Filter, Sort, Pagination
   - Text search
   - AI price suggestion
   - Commission calculation

**Script:**
```
"Về mặt kỹ thuật, project áp dụng MVC pattern chuẩn, có middleware cho 
authentication và authorization. Security được đảm bảo với bcrypt hash password
và JWT token. Hệ thống hỗ trợ tìm kiếm nâng cao, phân trang, và AI gợi ý giá."
```

---

### Part 5: Q&A Preparation (Dự đoán câu hỏi)

#### Q1: "Làm sao đảm bảo security?"
**A:** 
- Password hash bằng bcrypt
- JWT token authentication
- Role-based authorization
- Input validation với express-validator
- Owner-only update/delete

#### Q2: "Database có optimize không?"
**A:**
- Có indexes trên các field thường query
- Text indexes cho search
- Pagination để tránh load quá nhiều data
- Mongoose validation

#### Q3: "AI suggest price hoạt động thế nào?"
**A:**
- Hiện tại là mô phỏng đơn giản
- Tính toán dựa trên: năm sản xuất, km đã đi, độ chai pin, tình trạng
- Có thể mở rộng dùng ML models thực

#### Q4: "Có test chưa?"
**A:**
- Có manual testing đầy đủ
- Có Postman collection
- Có testing guide
- Có thể thêm unit tests (Jest) nếu cần

#### Q5: "Có thể deploy lên production không?"
**A:**
- Có, project ready for deployment
- Có thể deploy lên Heroku, Railway, Vercel
- Cần setup MongoDB Atlas
- Cần thêm environment variables

---

## 📱 Demo Flow Suggestions

### Flow 1: Complete User Journey (Recommended)
```
1. Guest xem xe
2. Đăng ký tài khoản
3. Đăng nhập
4. Đăng tin bán xe
5. Mua xe khác
6. Xem lịch sử
7. Admin duyệt tin
```

### Flow 2: Focus on Features
```
1. Authentication (register/login)
2. CRUD operations (vehicle)
3. Transaction flow
4. Admin dashboard
5. Advanced search/filter
```

### Flow 3: Technical Deep Dive
```
1. Show database design
2. Show code structure
3. Explain middleware
4. Show API endpoints
5. Demonstrate security
```

---

## 💡 Tips for Good Presentation

### DO ✅
- Test tất cả trước khi demo
- Chuẩn bị backup plan (video record)
- Speak clearly and slowly
- Explain WHAT and WHY
- Show code structure
- Highlight technical points
- Be confident

### DON'T ❌
- Don't rush
- Don't skip important parts
- Don't assume they know
- Don't read slides
- Don't forget to test beforehand
- Don't panic if error (có backup)

---

## 🎬 Backup Plan

### Nếu Server Crash
- Có video demo sẵn
- Có screenshots
- Explain từ code

### Nếu MongoDB Fail
- Show database design doc
- Explain schema
- Show seeder code

### Nếu Postman Fail
- Dùng cURL
- Dùng browser (GET requests)
- Show API docs

---

## 📸 Screenshots to Prepare

1. Dashboard stats
2. User list
3. Vehicle list with filters
4. Transaction history
5. MongoDB Compass showing data
6. Postman collection
7. Code structure in VS Code
8. Database design ERD

---

## 🎯 Key Points to Emphasize

1. **Complete CRUD operations**
2. **Role-based authorization**
3. **Secure authentication (JWT + bcrypt)**
4. **Advanced filtering & search**
5. **Transaction management**
6. **Admin dashboard**
7. **Well-documented**
8. **Production-ready**

---

## ⏱️ Time Management

| Part | Time | Content |
|------|------|---------|
| Intro | 3 min | Overview + Tech stack |
| Database | 2 min | ERD + Models |
| Demo Guest | 1 min | View + Search |
| Demo Member | 4 min | Register + Post + Buy |
| Demo Admin | 3 min | Dashboard + Manage |
| Technical | 3 min | Code + Architecture |
| Q&A | 5 min | Questions |
| **Total** | **20 min** | |

---

## 📝 Script Template

### Opening
```
"Xin chào thầy/cô và các bạn,
Em xin giới thiệu đề tài: [Tên đề tài]
Thành viên nhóm: [Tên]
Công nghệ sử dụng: [Tech stack]
```

### Main Content
```
"Hệ thống của em bao gồm [số] chức năng chính:
1. [Feature 1]
2. [Feature 2]
...

Bây giờ em xin demo hệ thống..."
```

### Closing
```
"Trên đây là demo về hệ thống của em.
Em xin cảm ơn thầy/cô và các bạn đã lắng nghe.
Em xin nhận câu hỏi từ thầy/cô."
```

---

## 🎓 Final Checklist

- [ ] Server running
- [ ] MongoDB connected
- [ ] Postman ready
- [ ] Browser tabs open
- [ ] MongoDB Compass open
- [ ] VS Code open
- [ ] Slides ready
- [ ] Screenshots ready
- [ ] Backup video ready
- [ ] Confident & prepared
- [ ] Understand all features
- [ ] Can explain code
- [ ] Ready for questions

---

**💪 Chúc bạn presentation thành công!**

**🚀 You got this!**
