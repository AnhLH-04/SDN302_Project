import mongoose from 'mongoose';

const batterySchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Vui lòng nhập tiêu đề'],
            trim: true,
        },
        brand: {
            type: String,
            required: [true, 'Vui lòng chọn hãng pin'],
            enum: [
                'CATL',
                'LG Energy',
                'Samsung SDI',
                'Panasonic',
                'BYD',
                'SK Innovation',
                'Tesla',
                'VinFast',
                'Other',
            ],
        },
        type: {
            type: String,
            enum: ['Lithium-ion', 'LFP', 'NMC', 'LTO', 'Solid-state', 'Other'],
            default: 'Lithium-ion',
        },
        capacity: {
            type: Number, // kWh
            required: [true, 'Vui lòng nhập dung lượng pin'],
            min: 1,
        },
        health: {
            type: Number, // %
            required: [true, 'Vui lòng nhập tình trạng pin'],
            min: 0,
            max: 100,
        },
        cycleCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        manufactureYear: {
            type: Number,
            min: 2010,
            max: new Date().getFullYear(),
        },
        condition: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
            required: true,
            default: 'good',
        },
        price: {
            type: Number,
            required: [true, 'Vui lòng nhập giá'],
            min: 0,
        },
        suggestedPrice: {
            type: Number,
        },
        compatibleVehicles: {
            type: [String],
            default: [],
        },
        warranty: {
            type: String,
        },
        description: {
            type: String,
        },
        images: {
            type: [String],
            default: [],
            validate: [arrayLimit, 'Tối đa 10 ảnh'],
        },
        location: {
            type: String,
            required: [true, 'Vui lòng nhập địa chỉ'],
        },
        status: {
            type: String,
            enum: ['available', 'sold', 'pending', 'hidden'],
            default: 'available',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

function arrayLimit(val) {
    return val.length <= 10;
}

// Text index cho tìm kiếm
batterySchema.index({ title: 'text', brand: 'text' });
batterySchema.index({ sellerId: 1 });
batterySchema.index({ brand: 1, capacity: -1 });
batterySchema.index({ price: 1 });
batterySchema.index({ status: 1, createdAt: -1 });

export const Battery = mongoose.model('Battery', batterySchema);
