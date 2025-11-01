import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/userModel.js';
import { Vehicle } from '../models/vehicleModel.js';
import { Battery } from '../models/batteryModel.js';
import { Transaction } from '../models/transactionModel.js';
import { Payment } from '../models/paymentModel.js';
import { Review } from '../models/reviewModel.js';
import { Favorite } from '../models/favoriteModel.js';
import { Report } from '../models/reportModel.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

const cleanDatabase = async () => {
    try {
        await connectDB();

        console.log('🗑️  Đang xóa toàn bộ dữ liệu...');

        await User.deleteMany({});
        await Vehicle.deleteMany({});
        await Battery.deleteMany({});
        await Transaction.deleteMany({});
        await Payment.deleteMany({});
        await Review.deleteMany({});
        await Favorite.deleteMany({});
        await Report.deleteMany({});

        console.log('✅ Đã xóa toàn bộ dữ liệu thành công!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi xóa dữ liệu:', error);
        process.exit(1);
    }
};

cleanDatabase();
