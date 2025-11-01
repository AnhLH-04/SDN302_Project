import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/userModel.js';
import { Vehicle } from '../models/vehicleModel.js';
import { Battery } from '../models/batteryModel.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for Seeding');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// Dữ liệu mẫu Users
const users = [
    {
        name: 'Admin',
        email: 'admin@evplatform.com',
        phone: '0901234567',
        password: 'Admin@123456',
        role: 'admin',
        isActive: true,
        isVerified: true,
    },
    {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        phone: '0912345678',
        password: '123456',
        role: 'member',
        isActive: true,
        isVerified: true,
        address: 'Hà Nội',
    },
    {
        name: 'Trần Thị B',
        email: 'tranthib@gmail.com',
        phone: '0923456789',
        password: '123456',
        role: 'member',
        isActive: true,
        isVerified: true,
        address: 'Hồ Chí Minh',
    },
    {
        name: 'Lê Văn C',
        email: 'levanc@gmail.com',
        phone: '0934567890',
        password: '123456',
        role: 'member',
        isActive: true,
        address: 'Đà Nẵng',
    },
];

// Dữ liệu mẫu Vehicles
const createVehicles = (userId1, userId2) => [
    {
        sellerId: userId1,
        title: 'VinFast VF8 2023 - Còn mới 95%',
        brand: 'VinFast',
        model: 'VF8',
        year: 2023,
        condition: 'like-new',
        mileage: 5000,
        price: 850000000,
        batteryCapacity: 87.7,
        batteryHealth: 98,
        range: 420,
        color: 'Xanh dương',
        description: 'Xe VinFast VF8 bản Plus, còn rất mới, ít sử dụng. Full option.',
        images: [
            'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
            'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',
        ],
        features: ['Autopilot', 'Cửa sổ trời toàn cảnh', 'Ghế massage', 'Hệ thống âm thanh cao cấp'],
        location: 'Hà Nội',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId2,
        title: 'Tesla Model 3 2022 - Long Range',
        brand: 'Tesla',
        model: 'Model 3',
        year: 2022,
        condition: 'good',
        mileage: 15000,
        price: 1200000000,
        batteryCapacity: 82,
        batteryHealth: 95,
        range: 580,
        color: 'Đen',
        description: 'Tesla Model 3 Long Range, autopilot, đã qua sử dụng 1 năm.',
        images: [
            'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
        ],
        features: ['Autopilot Full Self Driving', 'Supercharger', 'Premium Sound'],
        location: 'Hồ Chí Minh',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId1,
        title: 'BYD Atto 3 2023 - Mới 100%',
        brand: 'BYD',
        model: 'Atto 3',
        year: 2023,
        condition: 'new',
        mileage: 0,
        price: 650000000,
        batteryCapacity: 60.48,
        batteryHealth: 100,
        range: 420,
        color: 'Trắng',
        description: 'BYD Atto 3 hoàn toàn mới, chưa đăng ký.',
        images: [
            'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        ],
        features: ['Màn hình xoay 360', 'Hệ thống an toàn ADAS'],
        location: 'Hà Nội',
        status: 'available',
    },
    {
        sellerId: userId2,
        title: 'Hyundai Ioniq 5 2022',
        brand: 'Hyundai',
        model: 'Ioniq 5',
        year: 2022,
        condition: 'good',
        mileage: 8000,
        price: 920000000,
        batteryCapacity: 72.6,
        batteryHealth: 97,
        range: 481,
        color: 'Xám',
        description: 'Hyundai Ioniq 5 đời 2022, còn rất mới.',
        images: [
            'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',
        ],
        features: ['Sạc siêu nhanh 800V', 'V2L', 'Ghế thư giãn'],
        location: 'Đà Nẵng',
        status: 'available',
    },
];

// Dữ liệu mẫu Batteries
const createBatteries = (userId1, userId2) => [
    {
        sellerId: userId1,
        title: 'Pin LG Energy 82kWh - Tháo từ Tesla Model 3',
        brand: 'LG Energy',
        type: 'Lithium-ion',
        capacity: 82,
        health: 95,
        cycleCount: 150,
        manufactureYear: 2022,
        condition: 'excellent',
        price: 180000000,
        compatibleVehicles: ['Tesla Model 3', 'Tesla Model Y'],
        warranty: 'Còn 3 năm',
        description: 'Pin tháo từ xe Tesla Model 3, còn rất tốt, độ chai thấp.',
        images: [
            'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800',
        ],
        location: 'Hồ Chí Minh',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId2,
        title: 'Pin CATL LFP 60kWh - Cho VinFast VF8',
        brand: 'CATL',
        type: 'LFP',
        capacity: 60,
        health: 92,
        cycleCount: 300,
        manufactureYear: 2021,
        condition: 'good',
        price: 120000000,
        compatibleVehicles: ['VinFast VF8', 'VinFast VF9'],
        warranty: 'Còn 2 năm',
        description: 'Pin CATL LFP chất lượng cao, tuổi thọ dài.',
        images: [],
        location: 'Hà Nội',
        status: 'available',
    },
    {
        sellerId: userId1,
        title: 'Pin Samsung SDI 50kWh',
        brand: 'Samsung SDI',
        type: 'NMC',
        capacity: 50,
        health: 88,
        cycleCount: 500,
        manufactureYear: 2020,
        condition: 'fair',
        price: 80000000,
        compatibleVehicles: ['Hyundai Kona Electric', 'Kia Niro EV'],
        warranty: 'Hết bảo hành',
        description: 'Pin Samsung SDI, đã sử dụng khá nhiều nhưng vẫn hoạt động tốt.',
        images: [],
        location: 'Hà Nội',
        status: 'available',
    },
];

// Hàm seed dữ liệu
const seedData = async () => {
    try {
        await connectDB();

        // Xóa dữ liệu cũ
        console.log('🗑️  Đang xóa dữ liệu cũ...');
        await User.deleteMany({});
        await Vehicle.deleteMany({});
        await Battery.deleteMany({});

        console.log('✅ Đã xóa dữ liệu cũ');

        // Tạo Users
        console.log('👤 Đang tạo users...');
        const createdUsers = await User.create(users);
        console.log(`✅ Đã tạo ${createdUsers.length} users`);

        // Tạo Vehicles
        console.log('🚗 Đang tạo vehicles...');
        const vehicles = createVehicles(createdUsers[1]._id, createdUsers[2]._id);
        const createdVehicles = await Vehicle.create(vehicles);
        console.log(`✅ Đã tạo ${createdVehicles.length} vehicles`);

        // Tạo Batteries
        console.log('🔋 Đang tạo batteries...');
        const batteries = createBatteries(createdUsers[1]._id, createdUsers[2]._id);
        const createdBatteries = await Battery.create(batteries);
        console.log(`✅ Đã tạo ${createdBatteries.length} batteries`);

        console.log('\n🎉 SEEDING HOÀN TẤT!\n');
        console.log('📝 Thông tin đăng nhập:');
        console.log('---------------------------');
        console.log('ADMIN:');
        console.log('  Email: admin@evplatform.com');
        console.log('  Password: Admin@123456');
        console.log('\nMEMBER 1:');
        console.log('  Email: nguyenvana@gmail.com');
        console.log('  Password: 123456');
        console.log('\nMEMBER 2:');
        console.log('  Email: tranthib@gmail.com');
        console.log('  Password: 123456');
        console.log('---------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi seed dữ liệu:', error);
        process.exit(1);
    }
};

seedData();
