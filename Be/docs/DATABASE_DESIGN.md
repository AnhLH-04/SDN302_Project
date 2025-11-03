# 📊 Database Design - EV & Battery Trading Platform

## Entity Relationship Diagram (ERD)

### ERD Diagram (Mermaid)
```mermaid
erDiagram
	User ||--o{ Vehicle : "owns/sells"
	User ||--o{ Battery : "owns/sells"
	User ||--o{ Transaction : "buys"
	User ||--o{ Transaction : "sells"
	Transaction ||--|| Payment : "has"
	User ||--o{ Favorite : "favorites"
	Vehicle ||--o{ Favorite : "favorited"
	Battery ||--o{ Favorite : "favorited"
	User ||--o{ Review : "writes"
	User ||--o{ Report : "creates"

	%% Report subject (generic via reportedItemType/Id)
	Vehicle ||--o{ Report : "subject_of"
	Battery ||--o{ Report : "subject_of"
	User ||--o{ Report : "subject_is_user"

	%% Transaction subject (via itemType/itemId)
	Vehicle ||--o{ Transaction : "subject_of"
	Battery ||--o{ Transaction : "subject_of"

	%% Brand lookup relationships (by name string on Vehicle/Battery)
	Brand ||--o{ Vehicle : "brand lookup"
	Brand ||--o{ Battery : "brand lookup"

	User {
		ObjectId _id PK
		string name "required"
		string email "UNIQUE, required, lowercase, pattern"
		string phone "UNIQUE, sparse"
		string password "Hashed, required, select:false"
		enum role "guest|member|admin, default:member"
		boolean isActive "default:true"
		boolean isVerified "default:false"
		string avatar "URL, default:placeholder"
		string address
		number avgRating "0-5, default:0"
		number reviewCount "default:0"
		timestamp createdAt
		timestamp updatedAt
	}

	Brand {
		ObjectId _id PK
		string name "required, unique with type"
		enum type "vehicle|battery|both, default:vehicle"
		boolean isActive "default:true"
		ObjectId createdBy FK "ref:User"
		timestamp createdAt
		timestamp updatedAt
	}

	Vehicle {
		ObjectId _id PK
		ObjectId sellerId FK "ref:User, required"
		string title "required"
		string brand "required (string, lookup Brand)"
		string model "required"
		number year "required, min:2010"
		enum condition "new|like-new|good|fair, default:good"
		number mileage "default:0"
		number batteryCapacity "kWh, required"
		number batteryHealth "0-100, default:100"
		number range
		number price "required"
		number suggestedPrice
		string color "default:White"
		string description
		string[] images "max:10"
		string[] features
		string location "required"
		enum status "available|pending|sold|hidden, default:available"
		number viewCount "default:0"
		boolean isVerified "default:false"
		timestamp createdAt
		timestamp updatedAt
	}

	Battery {
		ObjectId _id PK
		ObjectId sellerId FK "ref:User, required"
		string title "required"
		string brand "required (string, lookup Brand)"
		enum type "Lithium-ion|LFP|NMC|LTO|Solid-state|Other, default:Lithium-ion"
		number capacity "kWh, required"
		number health "0-100, required"
		number cycleCount "default:0"
		number manufactureYear "min:2010"
		enum condition "excellent|good|fair|poor, default:good"
		number price "required"
		number suggestedPrice
		string[] compatibleVehicles
		string warranty
		string description
		string[] images "max:10"
		string location "required"
		enum status "available|pending|sold|hidden, default:available"
		boolean isVerified "default:false"
		timestamp createdAt
		timestamp updatedAt
	}

	Transaction {
		ObjectId _id PK
		ObjectId buyerId FK "ref:User, required"
		ObjectId sellerId FK "ref:User, required"
		enum itemType "vehicle|battery, required"
		ObjectId itemId FK "ref:Vehicle|Battery (refPath), required"
		number price "required"
		number commission "default:0 (~5% BE sets)"
		number totalAmount "required"
		enum status "pending|confirmed|completed|cancelled|disputed, default:pending"
		enum paymentMethod "stripe|paypal|cash|bank_transfer, default:stripe"
		enum paymentStatus "unpaid|paid|refunded, default:unpaid"
		string notes
		timestamp completedAt
		timestamp createdAt
		timestamp updatedAt
	}

	Payment {
		ObjectId _id PK
		ObjectId transactionId FK "ref:Transaction, required, UNIQUE (1-1)"
		number amount "required"
		enum method "stripe|paypal|cash|bank_transfer, default:stripe"
		enum status "pending|success|failed|refunded, default:pending"
		string stripePaymentId
		json metadata
		timestamp paidAt
		timestamp createdAt
		timestamp updatedAt
	}

	Report {
		ObjectId _id PK
		ObjectId reporterId FK "ref:User, required"
		enum reportedItemType "vehicle|battery|user, required"
		ObjectId reportedItemId "required"
		ObjectId reportedUserId FK "ref:User"
		enum reason "Spam|Lừa đảo|Thông tin sai lệch|Hình ảnh không phù hợp|Vi phạm chính sách|Khác, required"
		string description
		enum status "pending|reviewing|resolved|rejected, default:pending"
		string adminNote
		ObjectId resolvedBy FK "ref:User"
		timestamp resolvedAt
		timestamp createdAt
		timestamp updatedAt
	}

	Review {
		ObjectId _id PK
		ObjectId transactionId FK "ref:Transaction, required (unique with reviewerId)"
		ObjectId reviewerId FK "ref:User, required"
		ObjectId reviewedUserId FK "ref:User, required"
		number rating "1-5, required"
		string comment
		string[] images
		object sellerResponse "optional { comment, respondedAt }"
		timestamp createdAt
		timestamp updatedAt
	}

	Favorite {
		ObjectId _id PK
		ObjectId userId FK "ref:User, required"
		enum itemType "Vehicle|Battery, required (stored PascalCase)"
		ObjectId itemId FK "ref:Vehicle|Battery (refPath), required"
		timestamp createdAt
		timestamp updatedAt
	}
```

> Notes:
> - Brand hiện là danh mục tra cứu; Vehicle/Battery lưu `brand` dạng string (không FK). Có thể nâng cấp bằng `brandId` nếu muốn ràng buộc cứng.
> - Favorite.itemType đang lưu PascalCase ('Vehicle'|'Battery') để phù hợp refPath; controller đã hỗ trợ nhận lowercase từ FE.
> - Payment–Transaction là 1–1 theo nghiệp vụ; nên enforce unique index trên `transactionId` để đúng với ERD.

### **1. User (Người dùng)**

```
- _id: ObjectId (Primary Key)
- name: String (required)
- email: String (required, unique)
- phone: String (unique)
- password: String (required, hashed)
- role: String (enum: ['guest', 'member', 'admin'], default: 'member')
- avatar: String (URL)
- address: String
- isActive: Boolean (default: true)
- isVerified: Boolean (default: false)
- avgRating: Number (0-5, default: 0)
- reviewCount: Number (default: 0)
- createdAt: Date
- updatedAt: Date
```

### Brand (Thương hiệu)

```
- _id: ObjectId (Primary Key)
- name: String (required)
- type: String (enum: ['vehicle', 'battery', 'both'], default: 'vehicle')
- isActive: Boolean (default: true)
- createdBy: ObjectId (ref: User)
- createdAt: Date
- updatedAt: Date
```

### **2. Vehicle (Xe điện)**

```
- _id: ObjectId (Primary Key)
- sellerId: ObjectId (ref: User, required)
- title: String (required)
- brand: String (required) // Hãng xe: Tesla, VinFast, BYD...
- model: String (required) // Model xe
- year: Number (required) // Năm sản xuất
- condition: String (enum: ['new', 'like-new', 'good', 'fair'], required)
- mileage: Number (km đã đi)
- price: Number (required)
- suggestedPrice: Number (AI suggest)
- batteryCapacity: Number (kWh)
- batteryHealth: Number (%) // Tình trạng pin
- range: Number (km) // Phạm vi hoạt động
- color: String
- description: String
- images: [String] // Mảng URL hình ảnh
- features: [String] // Tính năng đặc biệt
- location: String
- status: String (enum: ['available', 'sold', 'pending', 'hidden'], default: 'available')
- viewCount: Number (default: 0)
- isVerified: Boolean (default: false) // Admin đã kiểm định
- createdAt: Date
- updatedAt: Date
```

### **3. Battery (Pin riêng lẻ)**

```
- _id: ObjectId (Primary Key)
- sellerId: ObjectId (ref: User, required)
- title: String (required)
- brand: String (required)
- type: String // Loại pin: Lithium-ion, LFP...
- capacity: Number (kWh, required)
- health: Number (%, required) // Độ chai pin
- cycleCount: Number // Số chu kỳ sạc
- manufactureYear: Number
- condition: String (enum: ['excellent', 'good', 'fair', 'poor'], required)
- price: Number (required)
- suggestedPrice: Number
- compatibleVehicles: [String] // Xe tương thích
- warranty: String // Bảo hành còn lại
- description: String
- images: [String]
- location: String
- status: String (enum: ['available', 'sold', 'pending', 'hidden'], default: 'available')
- isVerified: Boolean (default: false)
- createdAt: Date
- updatedAt: Date
```

### **4. Transaction (Giao dịch)**

```
- _id: ObjectId (Primary Key)
- buyerId: ObjectId (ref: User, required)
- sellerId: ObjectId (ref: User, required)
- itemType: String (enum: ['vehicle', 'battery'], required)
- itemId: ObjectId (required) // ID của Vehicle hoặc Battery (refPath theo itemType)
- price: Number (required)
- commission: Number // Phí hoa hồng
- totalAmount: Number // Tổng tiền = price + commission
- status: String (enum: ['pending', 'confirmed', 'completed', 'cancelled', 'disputed'], default: 'pending')
- paymentMethod: String (enum: ['stripe', 'paypal', 'cash', 'bank_transfer'], default: 'stripe')
- paymentStatus: String (enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid')
- notes: String
- completedAt: Date
- createdAt: Date
- updatedAt: Date
```

### **5. Review (Đánh giá)**

```
- _id: ObjectId (Primary Key)
- transactionId: ObjectId (ref: Transaction, required)
- reviewerId: ObjectId (ref: User, required) // Người đánh giá
- reviewedUserId: ObjectId (ref: User, required) // Người được đánh giá
- rating: Number (min: 1, max: 5, required)
- comment: String
- images: [String]
- sellerResponse: { comment: String, respondedAt: Date } (optional)
- createdAt: Date
- updatedAt: Date
```

### **6. Payment (Thanh toán)**

```
- _id: ObjectId (Primary Key)
- transactionId: ObjectId (ref: Transaction, required, UNIQUE) // 1-1 với Transaction
- amount: Number (required)
- method: String (enum: ['stripe', 'paypal', 'cash', 'bank_transfer'], required)
- status: String (enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending')
- stripePaymentId: String // ID từ Stripe
- metadata: Object // Dữ liệu thêm từ payment gateway
- paidAt: Date
- createdAt: Date
- updatedAt: Date
```

### **7. Favorite (Danh sách yêu thích)**

```
- _id: ObjectId (Primary Key)
- userId: ObjectId (ref: User, required)
- itemType: String (enum: ['vehicle', 'battery'], required)
- itemId: ObjectId (required)
- createdAt: Date
```

### **8. Report (Báo cáo/Khiếu nại)**

```
- _id: ObjectId (Primary Key)
- reporterId: ObjectId (ref: User, required)
- reportedUserId: ObjectId (ref: User)
- reportedItemType: String (enum: ['vehicle', 'battery', 'user'])
- reportedItemId: ObjectId
- reason: String (required)
- description: String
- status: String (enum: ['pending', 'reviewing', 'resolved', 'rejected'], default: 'pending')
- adminNote: String
- resolvedBy: ObjectId (ref: User)
- resolvedAt: Date
- createdAt: Date
- updatedAt: Date
```

---

## 📌 Mối quan hệ (Relationships)

1. **User - Vehicle**: 1-N (Một user có thể bán nhiều xe)
2. **User - Battery**: 1-N (Một user có thể bán nhiều pin)
3. **User - Transaction**: 1-N (Buyer & Seller)
4. **Transaction - Review**: 1-N (Một giao dịch có thể có nhiều review)
5. **Transaction - Payment**: 1-1 (Một giao dịch có một thanh toán)
6. **User - Favorite**: 1-N (Một user có nhiều favorite)
7. **User - Report**: 1-N (Một user có thể tạo nhiều report)
8. **Brand - Vehicle**: 1-N (Quan hệ danh mục theo tên; hiện Vehicle.brand là string lookup)
9. **Brand - Battery**: 1-N (Quan hệ danh mục theo tên; hiện Battery.brand là string lookup)

---

## 🎯 Indexes (Để tối ưu tìm kiếm)

### Vehicle Collection

- `{ sellerId: 1 }`
- `{ brand: 1, year: -1 }`
- `{ price: 1 }`
- `{ status: 1, createdAt: -1 }`
- `{ brand: 'text', model: 'text', title: 'text' }` (Text search)

### Battery Collection

- `{ sellerId: 1 }`
- `{ brand: 1, capacity: -1 }`
- `{ price: 1 }`
- `{ status: 1, createdAt: -1 }`

### Transaction Collection

- `{ buyerId: 1, createdAt: -1 }`
- `{ sellerId: 1, createdAt: -1 }`
- `{ status: 1 }`

### Brand Collection

- `{ name: 1, type: 1 }` (unique)
- `{ isActive: 1 }`

### User Collection

- `{ email: 1 }` (unique)
- `{ phone: 1 }` (unique)
- `{ role: 1 }`
