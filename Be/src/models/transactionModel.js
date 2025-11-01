import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        itemType: {
            type: String,
            enum: ['vehicle', 'battery'],
            required: true,
        },
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'itemType', // Dynamic reference
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        commission: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled', 'disputed'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            enum: ['stripe', 'paypal', 'cash', 'bank_transfer'],
            default: 'stripe',
        },
        paymentStatus: {
            type: String,
            enum: ['unpaid', 'paid', 'refunded'],
            default: 'unpaid',
        },
        notes: {
            type: String,
        },
        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Calculate totalAmount before save
transactionSchema.pre('save', function (next) {
    if (this.isModified('price') || this.isModified('commission')) {
        this.totalAmount = this.price + this.commission;
    }
    next();
});

// Indexes
transactionSchema.index({ buyerId: 1, createdAt: -1 });
transactionSchema.index({ sellerId: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ itemType: 1, itemId: 1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);
