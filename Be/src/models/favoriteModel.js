import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemType: {
      type: String,
      // IMPORTANT: must match the Mongoose model names for refPath to work
      enum: ['Vehicle', 'Battery'],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'itemType',
    },
  },
  {
    timestamps: true,
  }
);

// Mỗi user chỉ favorite 1 item 1 lần
favoriteSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });

export const Favorite = mongoose.model('Favorite', favoriteSchema);
