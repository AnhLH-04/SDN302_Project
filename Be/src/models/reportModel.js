import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
    {
        reporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reportedUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        reportedItemType: {
            type: String,
            enum: ['vehicle', 'battery', 'user'],
            required: true,
        },
        reportedItemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        reason: {
            type: String,
            required: [true, 'Vui lòng chọn lý do báo cáo'],
            enum: [
                'Spam',
                'Lừa đảo',
                'Thông tin sai lệch',
                'Hình ảnh không phù hợp',
                'Vi phạm chính sách',
                'Khác',
            ],
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'reviewing', 'resolved', 'rejected'],
            default: 'pending',
        },
        adminNote: {
            type: String,
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        resolvedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

reportSchema.index({ reporterId: 1, createdAt: -1 });
reportSchema.index({ status: 1 });

export const Report = mongoose.model('Report', reportSchema);
