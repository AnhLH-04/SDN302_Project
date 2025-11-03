import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
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
      required: [true, 'Vui lòng chọn hãng xe'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Vui lòng nhập model xe'],
    },
    year: {
      type: Number,
      required: [true, 'Vui lòng nhập năm sản xuất'],
      min: 2010,
      max: new Date().getFullYear() + 1,
    },
    condition: {
      type: String,
      enum: ['new', 'like-new', 'good', 'fair'],
      required: true,
      default: 'good',
    },
    mileage: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá'],
      min: 0,
    },
    suggestedPrice: {
      type: Number,
    },
    batteryCapacity: {
      type: Number, // kWh
      required: true,
    },
    batteryHealth: {
      type: Number, // %
      min: 0,
      max: 100,
      default: 100,
    },
    range: {
      type: Number, // km
    },
    color: {
      type: String,
      default: 'White',
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
      validate: [arrayLimit, 'Tối đa 10 ảnh'],
    },
    features: {
      type: [String],
      default: [],
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
    viewCount: {
      type: Number,
      default: 0,
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
vehicleSchema.index({ title: 'text', brand: 'text', model: 'text' });
vehicleSchema.index({ sellerId: 1 });
vehicleSchema.index({ brand: 1, year: -1 });
vehicleSchema.index({ price: 1 });
vehicleSchema.index({ status: 1, createdAt: -1 });

export const Vehicle = mongoose.model('vehicle', vehicleSchema);
