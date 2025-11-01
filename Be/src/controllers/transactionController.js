import { Transaction } from '../models/transactionModel.js';
import { Vehicle } from '../models/vehicleModel.js';
import { Battery } from '../models/batteryModel.js';
import { Payment } from '../models/paymentModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * @desc    Tạo giao dịch mua (Mua ngay)
 * @route   POST /api/transactions
 * @access  Private (Member, Admin)
 */
export const createTransaction = async (req, res) => {
    try {
        const { itemType, itemId, paymentMethod, notes } = req.body;

        // Validate itemType
        if (!['vehicle', 'battery'].includes(itemType)) {
            return errorResponse(res, 400, 'Loại sản phẩm không hợp lệ');
        }

        // Validate paymentMethod
        const validPaymentMethods = ['stripe', 'paypal', 'cash', 'bank_transfer'];
        if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
            return errorResponse(
                res,
                400,
                `Phương thức thanh toán không hợp lệ. Chỉ chấp nhận: ${validPaymentMethods.join(', ')}`
            );
        }

        // Tìm sản phẩm
        const Model = itemType === 'vehicle' ? Vehicle : Battery;
        const item = await Model.findById(itemId);

        if (!item) {
            return errorResponse(res, 404, 'Sản phẩm không tồn tại');
        }

        // Kiểm tra trạng thái
        if (item.status !== 'available') {
            return errorResponse(res, 400, 'Sản phẩm không còn khả dụng');
        }

        // Không thể mua sản phẩm của chính mình
        if (item.sellerId.toString() === req.user._id.toString()) {
            return errorResponse(res, 400, 'Bạn không thể mua sản phẩm của chính mình');
        }

        // Tính phí hoa hồng (5% của giá)
        const commission = Math.round(item.price * 0.05);
        const totalAmount = item.price + commission;

        // Tạo transaction
        const transaction = await Transaction.create({
            buyerId: req.user._id,
            sellerId: item.sellerId,
            itemType,
            itemId,
            price: item.price,
            commission,
            totalAmount,
            paymentMethod: paymentMethod || 'stripe',
            notes,
        });

        // Cập nhật status sản phẩm thành pending
        console.log('📝 Updating item status to pending:', {
            itemType: transaction.itemType,
            itemId: transaction.itemId,
            currentStatus: item.status
        });

        item.status = 'pending';
        await item.save();

        console.log('✅ Item status updated to:', item.status);

        // Tạo payment record
        await Payment.create({
            transactionId: transaction._id,
            amount: totalAmount,
            method: paymentMethod || 'stripe',
            status: 'pending',
        });

        // Populate thông tin
        await transaction.populate('buyerId', 'name email phone');
        await transaction.populate('sellerId', 'name email phone');

        return successResponse(res, 201, 'Tạo giao dịch thành công', {
            transaction,
        });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

/**
 * @desc    Lấy danh sách giao dịch của user (mua & bán)
 * @route   GET /api/transactions/my-transactions
 * @access  Private
 */
export const getMyTransactions = async (req, res) => {
    try {
        const { type } = req.query; // 'buy' hoặc 'sell'

        console.log('📊 ========== MY TRANSACTIONS DEBUG ==========');
        console.log('📊 User ID from token:', req.user._id.toString());
        console.log('📊 User email:', req.user.email);
        console.log('📊 User name:', req.user.name);
        console.log('📊 Filter type:', type);

        let query = {};
        if (type === 'buy') {
            query.buyerId = req.user._id;
        } else if (type === 'sell') {
            query.sellerId = req.user._id;
        } else {
            // Lấy cả mua và bán
            query.$or = [{ buyerId: req.user._id }, { sellerId: req.user._id }];
        }

        console.log('📊 Query:', JSON.stringify(query));

        const transactions = await Transaction.find(query)
            .populate('buyerId', 'name email phone avatar')
            .populate('sellerId', 'name email phone avatar')
            .sort('-createdAt');

        console.log('📊 Found transactions:', transactions.length);

        if (transactions.length > 0) {
            transactions.forEach((t, index) => {
                console.log(`📊 Transaction ${index + 1}:`, {
                    id: t._id,
                    buyer: t.buyerId?.name,
                    buyerId: t.buyerId?._id?.toString(),
                    seller: t.sellerId?.name,
                    sellerId: t.sellerId?._id?.toString(),
                    itemType: t.itemType,
                    price: t.price,
                });
            });
        }

        console.log('📊 ========================================');

        return successResponse(res, 200, 'Lấy lịch sử giao dịch thành công', {
            transactions,
            total: transactions.length,
        });
    } catch (error) {
        console.error('❌ Error getting my transactions:', error);
        return errorResponse(res, 500, error.message);
    }
};

/**
 * @desc    Lấy chi tiết 1 giao dịch
 * @route   GET /api/transactions/:id
 * @access  Private (Buyer, Seller hoặc Admin)
 */
export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('buyerId', 'name email phone avatar')
            .populate('sellerId', 'name email phone avatar');

        if (!transaction) {
            return errorResponse(res, 404, 'Giao dịch không tồn tại');
        }

        // Kiểm tra quyền truy cập
        if (
            transaction.buyerId._id.toString() !== req.user._id.toString() &&
            transaction.sellerId._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return errorResponse(res, 403, 'Bạn không có quyền xem giao dịch này');
        }

        // Lấy thông tin payment
        const payment = await Payment.findOne({ transactionId: transaction._id });

        return successResponse(res, 200, 'Lấy thông tin giao dịch thành công', {
            transaction,
            payment,
        });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

/**
 * @desc    Cập nhật trạng thái giao dịch
 * @route   PUT /api/transactions/:id/status
 * @access  Private (Seller hoặc Admin)
 */
export const updateTransactionStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return errorResponse(res, 404, 'Giao dịch không tồn tại');
        }

        // Authorization: Buyer, Seller hoặc Admin đều có thể update
        const isBuyer = transaction.buyerId.toString() === req.user._id.toString();
        const isSeller = transaction.sellerId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isBuyer && !isSeller && !isAdmin) {
            return errorResponse(res, 403, 'Bạn không có quyền cập nhật giao dịch này');
        }

        // Validate status transition
        const validStatuses = ['confirmed', 'completed', 'cancelled', 'disputed'];
        if (!validStatuses.includes(status)) {
            return errorResponse(res, 400, 'Trạng thái không hợp lệ');
        }

        // Business logic: Buyer confirm payment, Seller can also update
        // pending -> confirmed (Buyer xác nhận thanh toán)
        // confirmed -> completed (Buyer hoàn tất hoặc Seller xác nhận)
        // any -> cancelled (Both can cancel)

        transaction.status = status;

        if (status === 'completed') {
            transaction.completedAt = new Date();

            // Cập nhật item status thành sold
            const Model = transaction.itemType === 'vehicle' ? Vehicle : Battery;
            await Model.findByIdAndUpdate(transaction.itemId, { status: 'sold' });

            // Cập nhật payment status
            await Payment.findOneAndUpdate(
                { transactionId: transaction._id },
                { status: 'success', paidAt: new Date() }
            );
        } else if (status === 'cancelled') {
            // Trả lại trạng thái available cho item
            const Model = transaction.itemType === 'vehicle' ? Vehicle : Battery;
            await Model.findByIdAndUpdate(transaction.itemId, { status: 'available' });
        }

        await transaction.save();

        return successResponse(res, 200, 'Cập nhật trạng thái giao dịch thành công', {
            transaction,
        });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

/**
 * @desc    Lấy tất cả giao dịch (Admin only)
 * @route   GET /api/transactions
 * @access  Private (Admin)
 */
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('buyerId', 'name email phone')
            .populate('sellerId', 'name email phone')
            .sort('-createdAt');

        return successResponse(res, 200, 'Lấy danh sách giao dịch thành công', {
            transactions,
            total: transactions.length,
        });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};
