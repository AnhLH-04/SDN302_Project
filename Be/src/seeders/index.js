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
            'https://files01.danhgiaxe.com/s0Ei4WHp112fkbeMbkBc1OpZz7c=/fit-in/2560x0/20221211/vinfast-vf8-anh-7-223602.jpg',
            'https://htd.net.vn/wp-content/uploads/2025/03/luoi-tan-nhiet-Vinfast-VF8-2025.jpg',
        ],
        features: ['Autopilot', 'Cửa sổ trời toàn cảnh', 'Ghế massage', 'Hệ thống âm thanh cao cấp'],
        location: 'Hà Nội',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId1,
        title: 'VinFast VF3 2024 - Mới 100%',
        brand: 'VinFast',
        model: 'VF3',
        year: 2024,
        condition: 'new',
        mileage: 50,
        price: 350000000,
        batteryCapacity: 32,
        batteryHealth: 100,
        range: 210,
        color: 'Trắng',
        description: 'VinFast VF3 mới hoàn toàn, xe nhỏ gọn, phù hợp di chuyển trong đô thị.',
        images: [
            'https://tse4.mm.bing.net/th/id/OIP.1dfXvQARXQeHCC6DV_thIgHaFj?rs=1&pid=ImgDetMain&o=7&rm=3',
        ],
        features: ['Màn hình cảm ứng 7 inch', 'Camera lùi', 'Hỗ trợ phanh ABS'],
        location: 'Hồ Chí Minh',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId2,
        title: 'VinFast VF5 Plus 2023 - Đã qua sử dụng 10.000km',
        brand: 'VinFast',
        model: 'VF5',
        year: 2023,
        condition: 'good',
        mileage: 10000,
        price: 480000000,
        batteryCapacity: 37.2,
        batteryHealth: 95,
        range: 280,
        color: 'Vàng cát',
        description: 'VinFast VF5 Plus màu vàng cát nổi bật, nội thất còn rất mới.',
        images: [
            'https://tse2.mm.bing.net/th/id/OIP.79oyGqu2YxaU8YMBK8cQrwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3',
        ],
        features: ['Màn hình 8 inch', 'Kết nối Bluetooth', 'Cruise Control'],
        location: 'Đà Nẵng',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId1,
        title: 'VinFast VF6 Eco 2024 - Siêu tiết kiệm',
        brand: 'VinFast',
        model: 'VF6',
        year: 2024,
        condition: 'new',
        mileage: 0,
        price: 640000000,
        batteryCapacity: 59.6,
        batteryHealth: 100,
        range: 399,
        color: 'Đen bóng',
        description: 'VF6 Eco phiên bản mới nhất, tiết kiệm năng lượng và an toàn tối đa.',
        images: [
            'https://images2.thanhnien.vn/528068263637045248/2023/7/3/vinfast-vf6-4-16883537800551169457526.jpg',
        ],
        features: ['Cảnh báo điểm mù', 'Phanh khẩn cấp tự động', 'Apple CarPlay'],
        location: 'Hà Nội',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId2,
        title: 'VinFast VF7 Plus 2023 - Sang trọng, thể thao',
        brand: 'VinFast',
        model: 'VF7',
        year: 2023,
        condition: 'like-new',
        mileage: 7000,
        price: 850000000,
        batteryCapacity: 75,
        batteryHealth: 97,
        range: 450,
        color: 'Xanh dương',
        description: 'VF7 bản Plus, thiết kế thể thao, cabin hiện đại, vận hành êm ái.',
        images: [
            'https://tse1.mm.bing.net/th/id/OIP.mdIRdQbJu8n7UbqNORBZ_wHaFk?w=2048&h=1542&rs=1&pid=ImgDetMain&o=7&rm=3',
        ],
        features: ['Cửa sổ trời', 'Tự động giữ làn đường', 'Ghế chỉnh điện 8 hướng'],
        location: 'Nha Trang',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId1,
        title: 'VinFast VF8 Eco 2023 - Còn mới 95%',
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
        description: 'Xe VinFast VF8 bản Eco, còn rất mới, full option, chạy êm.',
        images: [
            'https://tse1.mm.bing.net/th/id/OIP.TRwYwhZv2I0hKrgRHl-KXAHaD4?w=1200&h=628&rs=1&pid=ImgDetMain&o=7&rm=3',
        ],
        features: ['Autopilot', 'Cửa sổ trời toàn cảnh', 'Ghế massage'],
        location: 'Hà Nội',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId2,
        title: 'VinFast VF9 Plus 2024 - Cao cấp nhất',
        brand: 'VinFast',
        model: 'VF9',
        year: 2024,
        condition: 'new',
        mileage: 0,
        price: 1300000000,
        batteryCapacity: 123,
        batteryHealth: 100,
        range: 550,
        color: 'Bạc ánh kim',
        description: 'VinFast VF9 Plus, SUV điện 7 chỗ, công nghệ cao cấp, nội thất da Nappa.',
        images: [
            'https://vinfastgiare.vn/public/images/1735740426-Vinfast-VF9-Plus-mau-bac.jpg',
        ],
        features: ['Ghế massage toàn thân', 'HUD hiển thị thông tin', 'Tự động đỗ xe'],
        location: 'Hồ Chí Minh',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId1,
        title: 'VinFast VF5 Eco 2024 - Gọn nhẹ, giá tốt',
        brand: 'VinFast',
        model: 'VF5',
        year: 2024,
        condition: 'new',
        mileage: 100,
        price: 460000000,
        batteryCapacity: 37.2,
        batteryHealth: 100,
        range: 280,
        color: 'Đỏ đô',
        description: 'VF5 Eco màu đỏ nổi bật, thiết kế trẻ trung, cực kỳ tiết kiệm điện.',
        images: [
            'https://tse4.mm.bing.net/th/id/OIP.jk2X4nWGxVNz1Eiqvc6mAgHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
        ],
        features: ['Màn hình trung tâm 8 inch', 'Camera 360', 'Điều hòa tự động'],
        location: 'Cần Thơ',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId2,
        title: 'VinFast VF6 Plus 2023 - Lướt 3.000km',
        brand: 'VinFast',
        model: 'VF6',
        year: 2023,
        condition: 'like-new',
        mileage: 3000,
        price: 690000000,
        batteryCapacity: 59.6,
        batteryHealth: 97,
        range: 400,
        color: 'Trắng ngọc trai',
        description: 'VF6 Plus bản cao cấp, chạy cực êm, tiết kiệm điện, bảo dưỡng định kỳ.',
        images: [
            'https://img1.oto.com.vn/2022/09/15/20220915164536-2089_wm.jpg',
        ],
        features: ['Cảnh báo va chạm', 'Hỗ trợ giữ làn', 'Camera hành trình'],
        location: 'Hải Phòng',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId1,
        title: 'VinFast VF8 Plus 2024 - Full option',
        brand: 'VinFast',
        model: 'VF8',
        year: 2024,
        condition: 'new',
        mileage: 0,
        price: 970000000,
        batteryCapacity: 87.7,
        batteryHealth: 100,
        range: 470,
        color: 'Đen ánh kim',
        description: 'Bản VF8 Plus cao cấp nhất, full option, nội thất sang trọng.',
        images: [
            'https://vinfastquangninh.com.vn/wp-content/uploads/2024/07/5-min-1.png',
        ],
        features: ['Tự động phanh khẩn cấp', 'Giữ làn chủ động', 'Ghế sưởi & làm mát'],
        location: 'Hồ Chí Minh',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId2,
        title: 'VinFast VF9 Eco 2023 - Xe gia đình 7 chỗ',
        brand: 'VinFast',
        model: 'VF9',
        year: 2023,
        condition: 'like-new',
        mileage: 8000,
        price: 1200000000,
        batteryCapacity: 123,
        batteryHealth: 96,
        range: 520,
        color: 'Xám bạc',
        description: 'VF9 Eco màu xám bạc, phù hợp gia đình, nội thất rộng rãi, hiện đại.',
        images: [
            'https://i0.wp.com/vinfastonline.com/wp-content/uploads/2023/05/danh-gia-xe-vinfast-2023-1.jpg?w=1020&ssl=1',
        ],
        features: ['Cửa sổ trời toàn cảnh', 'Màn hình HUD', 'Camera 360'],
        location: 'Đà Nẵng',
        status: 'available',
        isVerified: true,
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
        description: 'Pin tháo từ Tesla Model 3, dung lượng lớn, hiệu suất cao, sạc nhanh.',
        images: ['https://solarsongda.com/wp-content/uploads/2022/02/pin-lg-solar.jpg'],
        location: 'Hồ Chí Minh',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId2,
        title: 'Pin CATL 75kWh - Cho VinFast VF8 / VF9',
        brand: 'CATL',
        type: 'LFP',
        capacity: 75,
        health: 98,
        cycleCount: 50,
        manufactureYear: 2024,
        condition: 'excellent',
        price: 210000000,
        compatibleVehicles: ['VinFast VF8', 'VinFast VF9'],
        warranty: '5 năm chính hãng',
        description: 'Pin CATL mới 100%, an toàn, độ bền cao, tương thích nhiều dòng VinFast.',
        images: ['https://th.bing.com/th/id/OIP.wbsXi_Qwq2X5Br3yE2Tb4gHaEK?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3'],
        location: 'Hà Nội',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId1,
        title: 'Pin Panasonic 68kWh - Dùng cho Tesla Model S',
        brand: 'Panasonic',
        type: 'NMC',
        capacity: 68,
        health: 92,
        cycleCount: 230,
        manufactureYear: 2021,
        condition: 'good',
        price: 150000000,
        compatibleVehicles: ['Tesla Model S', 'Lucid Air'],
        warranty: 'Còn 1 năm',
        description: 'Pin tháo xe Tesla, hiệu suất tốt, dòng xả ổn định, hoạt động ổn định.',
        images: ['https://tse4.mm.bing.net/th/id/OIP.5P8WWg4DM_UUeefcKU6aRQHaD3?rs=1&pid=ImgDetMain&o=7&rm=3'],
        location: 'Đà Nẵng',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId2,
        title: 'Pin BYD Blade 60kWh - Cho xe điện cỡ nhỏ',
        brand: 'BYD',
        type: 'LFP',
        capacity: 60,
        health: 99,
        cycleCount: 20,
        manufactureYear: 2024,
        condition: 'excellent',
        price: 165000000,
        compatibleVehicles: ['BYD Dolphin', 'VinFast VF6'],
        warranty: '6 năm chính hãng',
        description: 'Pin BYD Blade nổi tiếng an toàn, chống cháy nổ, tuổi thọ cao.',
        images: ['https://images2.thanhnien.vn/528068263637045248/2024/9/27/pin-byd-9-17274469987231013092184.jpg'],
        location: 'Hồ Chí Minh',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId1,
        title: 'Pin LG Chem 45kWh - Cho xe điện đô thị',
        brand: 'LG Energy',
        type: 'Lithium-ion',
        capacity: 45,
        health: 97,
        cycleCount: 100,
        manufactureYear: 2023,
        condition: 'excellent',
        price: 125000000,
        compatibleVehicles: ['VinFast VF3', 'Honda e'],
        warranty: 'Còn 4 năm',
        description: 'Pin LG Chem nhỏ gọn, hiệu suất cao, phù hợp xe điện cỡ nhỏ.',
        images: ['https://tse1.mm.bing.net/th/id/OIP.0qW7hWtBqYhIH-9rn6OcjwHaFY?rs=1&pid=ImgDetMain&o=7&rm=3'],
        location: 'Cần Thơ',
        status: 'available',
        isVerified: true,
    },
    {
        sellerId: userId2,
        title: 'Pin EVE Energy 90kWh - Nhập khẩu mới 2025',
        brand: 'Other',
        type: 'LFP',
        capacity: 90,
        health: 100,
        cycleCount: 0,
        manufactureYear: 2025,
        condition: 'excellent',
        price: 260000000,
        compatibleVehicles: ['VinFast VF9', 'BYD Tang EV'],
        warranty: '5 năm chính hãng',
        description: 'Pin EVE Energy mới nhập khẩu, dung lượng lớn, an toàn tuyệt đối.',
        images: ['https://tse3.mm.bing.net/th/id/OIP.1yDHkYQphJXXuiCbQ_ijXAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'],
        location: 'Đà Nẵng',
        status: 'available',
        isVerified: true,
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
