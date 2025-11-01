import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
            required: true,
        },
        reviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reviewedUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Vui lòng chọn đánh giá'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
        },
        images: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Một transaction chỉ được review 1 lần bởi mỗi user
reviewSchema.index({ transactionId: 1, reviewerId: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
