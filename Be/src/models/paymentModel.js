import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        method: {
            type: String,
            enum: ['stripe', 'paypal', 'cash', 'bank_transfer'],
            required: true,
            default: 'stripe',
        },
        status: {
            type: String,
            enum: ['pending', 'success', 'failed', 'refunded'],
            default: 'pending',
        },
        stripePaymentId: {
            type: String,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        paidAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index cho transactionId
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });

export const Payment = mongoose.model('Payment', paymentSchema);
