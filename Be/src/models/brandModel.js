import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên thương hiệu'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['vehicle', 'battery', 'both'],
      default: 'vehicle',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

brandSchema.index({ name: 1, type: 1 }, { unique: true });

export const Brand = mongoose.model('brand', brandSchema);
