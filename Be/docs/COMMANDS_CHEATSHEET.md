# 🎮 Các Lệnh Thường Dùng - Cheat Sheet

## 📦 NPM Commands

### Installation
```bash
# Cài đặt tất cả dependencies
npm install

# Cài đặt package cụ thể
npm install package-name

# Cài đặt dev dependency
npm install --save-dev package-name
```

### Running
```bash
# Chạy server (production)
npm start

# Chạy server (development - auto reload)
npm run dev

# Seed dữ liệu mẫu
npm run seed

# Xóa toàn bộ dữ liệu
npm run seed:clean
```

---

## 🗄️ MongoDB Commands

### Local MongoDB
```bash
# Khởi động MongoDB (Windows)
mongod

# Kết nối MongoDB Shell
mongosh

# Show databases
show dbs

# Sử dụng database
use ev_battery_platform

# Show collections
show collections

# Xem tất cả users
db.users.find()

# Xem tất cả vehicles
db.vehicles.find()

# Đếm số lượng
db.users.countDocuments()

# Xóa collection
db.users.deleteMany({})
```

---

## 🔧 Git Commands

```bash
# Kiểm tra status
git status

# Add tất cả changes
git add .

# Commit
git commit -m "Your message"

# Push
git push origin main

# Pull
git pull origin main

# Clone
git clone <repository-url>
```

---

## 🌐 cURL Commands (Test API)

### PowerShell

#### Login
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@evplatform.com\",\"password\":\"Admin@123456\"}'
```

#### Get Vehicles
```powershell
curl http://localhost:5000/api/vehicles
```

#### Get with Token
```powershell
$token = "your_token_here"
curl -H "Authorization: Bearer $token" http://localhost:5000/api/auth/me
```

---

## 📁 File & Directory Commands

### PowerShell
```powershell
# Di chuyển vào thư mục
cd d:\Ky7\SDN302\Project\Project_SDN

# Xem nội dung thư mục
ls
dir

# Tạo file
New-Item -Path "filename.js" -ItemType File

# Tạo thư mục
New-Item -Path "foldername" -ItemType Directory

# Xóa file
Remove-Item filename.js

# Xóa thư mục
Remove-Item -Recurse foldername

# Copy file
Copy-Item source.js destination.js

# Xem nội dung file
Get-Content filename.js
cat filename.js
```

---

## 🐛 Debug Commands

### Node.js
```bash
# Chạy với debug
node --inspect src/server.js

# Xem environment variables
echo $env:NODE_ENV        # PowerShell
printenv                  # Linux/Mac
```

### MongoDB
```bash
# Xem logs
db.adminCommand({ getLog: "global" })

# Check connection
db.adminCommand({ ping: 1 })

# Stats
db.stats()
```

---

## 🧪 Testing Commands

### Test API với curl
```powershell
# Test health check
curl http://localhost:5000

# Test vehicles
curl http://localhost:5000/api/vehicles

# Test with method
curl -X GET http://localhost:5000/api/vehicles

# Test POST
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@test.com","password":"123456"}'
```

---

## 💾 Database Backup & Restore

### MongoDB
```bash
# Backup toàn bộ database
mongodump --db ev_battery_platform --out ./backup

# Restore database
mongorestore --db ev_battery_platform ./backup/ev_battery_platform

# Export collection to JSON
mongoexport --db ev_battery_platform --collection users --out users.json

# Import collection from JSON
mongoimport --db ev_battery_platform --collection users --file users.json
```

---

## 🔑 Environment Variables

### PowerShell
```powershell
# Set environment variable (temporary)
$env:NODE_ENV = "development"
$env:PORT = "5000"

# View environment variable
echo $env:NODE_ENV

# Set multiple
$env:NODE_ENV = "production"; $env:PORT = "3000"
```

### .env file
```bash
# File .env location: project root
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ev_battery_platform
```

---

## 🚀 Production Deployment

### Build
```bash
# Install production dependencies only
npm install --production

# Set production environment
$env:NODE_ENV = "production"

# Run in production
npm start
```

### PM2 (Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start src/server.js --name ev-platform

# List processes
pm2 list

# Monitor
pm2 monit

# Logs
pm2 logs

# Restart
pm2 restart ev-platform

# Stop
pm2 stop ev-platform

# Delete
pm2 delete ev-platform
```

---

## 🔍 Search & Find

### PowerShell
```powershell
# Tìm file
Get-ChildItem -Recurse -Filter "*.js"

# Tìm text trong file
Select-String -Path "*.js" -Pattern "mongoose"

# Tìm trong tất cả file
Get-ChildItem -Recurse | Select-String -Pattern "User"
```

---

## 📊 Package Management

```bash
# Xem installed packages
npm list

# Xem outdated packages
npm outdated

# Update packages
npm update

# Update specific package
npm update package-name

# Uninstall package
npm uninstall package-name

# Clear cache
npm cache clean --force
```

---

## 🎯 Quick Shortcuts

### Development Flow
```bash
# Full setup from scratch
cd d:\Ky7\SDN302\Project\Project_SDN
npm install
npm run seed
npm run dev
```

### Reset Database
```bash
npm run seed:clean
npm run seed
```

### Test Flow
```bash
# 1. Start server
npm run dev

# 2. Test (new terminal)
curl http://localhost:5000
curl http://localhost:5000/api/vehicles
```

---

## 🔧 Troubleshooting Commands

### Check Ports
```powershell
# Xem port đang dùng
netstat -ano | findstr :5000

# Kill process on port
Stop-Process -Id <PID> -Force
```

### Check Node & NPM
```bash
node --version
npm --version
```

### Check MongoDB
```bash
mongosh --version
mongod --version
```

### Clear Everything
```bash
# Delete node_modules
Remove-Item -Recurse -Force node_modules

# Delete package-lock
Remove-Item package-lock.json

# Reinstall
npm install
```

---

## 📝 Useful Aliases (Optional)

### PowerShell Profile
```powershell
# Edit profile
notepad $PROFILE

# Add aliases
function dev { npm run dev }
function seed { npm run seed }
function clean { npm run seed:clean }
function start-server { npm start }

# Use
dev      # instead of npm run dev
seed     # instead of npm run seed
```

---

## 🎓 Tips & Tricks

### VS Code Terminal
```bash
# Split terminal: Ctrl + Shift + 5
# New terminal: Ctrl + Shift + `
# Clear: Ctrl + L
```

### Quick Edit
```bash
# Open file in VS Code
code filename.js

# Open current directory
code .
```

---

## 📚 Reference

| Command | Description |
|---------|-------------|
| `npm install` | Cài dependencies |
| `npm start` | Chạy server |
| `npm run dev` | Dev mode |
| `npm run seed` | Seed data |
| `mongosh` | MongoDB shell |
| `pm2 start` | Start with PM2 |
| `git status` | Check git status |
| `code .` | Open in VS Code |

---

**💡 Pro Tip:** Bookmark trang này để tra cứu nhanh!

**🚀 Happy Coding!**
