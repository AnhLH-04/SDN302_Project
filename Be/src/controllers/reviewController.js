import { Review } from '../models/reviewModel.js';
import { Transaction } from '../models/transactionModel.js';
import { User } from '../models/userModel.js';
import { Vehicle } from '../models/vehicleModel.js';
import { Battery } from '../models/batteryModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * @desc    Tạo review cho giao dịch
 * @route   POST /api/reviews
 * @access  Private (Member, Admin)
 */
export const createReview = async (req, res) => {
    try {
        const { transactionId, reviewedUserId, rating, comment, images } = req.body;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return errorResponse(res, 400, 'Đánh giá phải từ 1 đến 5 sao');
        }

        // Tìm transaction
        console.log('🔍 Finding transaction:', transactionId);
        const transaction = await Transaction.findById(transactionId);
        console.log('📦 Transaction found:', {
            id: transaction?._id,
            itemType: transaction?.itemType,
            status: transaction?.status
        });

        if (!transaction) {
            return errorResponse(res, 404, 'Giao dịch không tồn tại');
        }

        // Kiểm tra user có phải là buyer hoặc seller không
        const isBuyer = transaction.buyerId.toString() === req.user._id.toString();
        const isSeller = transaction.sellerId.toString() === req.user._id.toString();

        if (!isBuyer && !isSeller) {
            return errorResponse(res, 403, 'Bạn không có quyền đánh giá giao dịch này');
        }

        // Kiểm tra transaction đã completed chưa
        if (transaction.status !== 'completed') {
            return errorResponse(res, 400, 'Chỉ có thể đánh giá giao dịch đã hoàn thành');
        }

        // Validate reviewedUserId
        const expectedReviewedUserId = isBuyer ? transaction.sellerId : transaction.buyerId;
        if (reviewedUserId !== expectedReviewedUserId.toString()) {
            return errorResponse(res, 400, 'Người được đánh giá không hợp lệ');
        }

        // Kiểm tra đã review chưa
        const existingReview = await Review.findOne({
            transactionId,
            reviewerId: req.user._id,
        });

        if (existingReview) {
            return errorResponse(res, 400, 'Bạn đã đánh giá giao dịch này rồi');
        }

        // Tạo review
        const review = await Review.create({
            transactionId,
            reviewerId: req.user._id,
            reviewedUserId,
            rating,
            comment,
            images: images || [],
        });

        // Cập nhật avgRating và reviewCount của user được review
        await updateUserRating(reviewedUserId);

        // Populate thông tin
        await review.populate([
            { path: 'reviewerId', select: 'name email avatar' },
            { path: 'reviewedUserId', select: 'name email avatar' },
            { path: 'transactionId' },
        ]);

        return successResponse(res, 201, 'Tạo đánh giá thành công', review);
    } catch (error) {
        console.error('Error in createReview:', error);
        return errorResponse(res, 500, error.message || 'Lỗi server');
    }
};

/**
 * @desc    Lấy reviews của sản phẩm (vehicle hoặc battery)
 * @route   GET /api/reviews/product/:type/:id
 * @access  Public
 */
export const getProductReviews = async (req, res) => {
    try {
        const { type, id } = req.params;

        // Validate type
        if (!['vehicle', 'battery'].includes(type)) {
            return errorResponse(res, 400, 'Loại sản phẩm không hợp lệ');
        }

        // Tìm product để lấy sellerId
        const Model = type === 'vehicle' ? Vehicle : Battery;
        const product = await Model.findById(id);

        if (!product) {
            return errorResponse(res, 404, 'Sản phẩm không tồn tại');
        }

        // Tìm tất cả transactions của product này
        const transactions = await Transaction.find({
            itemType: type,
            itemId: id,
            status: 'completed',
        });

        const transactionIds = transactions.map((t) => t._id);

        // Lấy reviews của những transactions đó, filter reviewedUserId = sellerId
        const reviews = await Review.find({
            transactionId: { $in: transactionIds },
            reviewedUserId: product.sellerId,
        })
            .populate('reviewerId', 'name email avatar')
            .populate('reviewedUserId', 'name email avatar')
            .sort('-createdAt');

        // Tính average rating
        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        return successResponse(res, 200, 'Lấy đánh giá thành công', {
            reviews,
            stats: {
                totalReviews: reviews.length,
                avgRating: Math.round(avgRating * 10) / 10,
            },
        });
    } catch (error) {
        console.error('Error in getProductReviews:', error);
        return errorResponse(res, 500, error.message || 'Lỗi server');
    }
};

/**
 * @desc    Lấy reviews của user (được người khác đánh giá)
 * @route   GET /api/reviews/user/:id
 * @access  Public
 */
export const getUserReviews = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra user tồn tại
        const user = await User.findById(id);
        if (!user) {
            return errorResponse(res, 404, 'Người dùng không tồn tại');
        }

        // Lấy tất cả reviews của user này (được đánh giá)
        const reviews = await Review.find({ reviewedUserId: id })
            .populate('reviewerId', 'name email avatar')
            .populate({
                path: 'transactionId',
                populate: {
                    path: 'itemId',
                    select: 'title brand model images',
                },
            })
            .sort('-createdAt');

        // Tính stats
        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        const ratingDistribution = {
            5: reviews.filter((r) => r.rating === 5).length,
            4: reviews.filter((r) => r.rating === 4).length,
            3: reviews.filter((r) => r.rating === 3).length,
            2: reviews.filter((r) => r.rating === 2).length,
            1: reviews.filter((r) => r.rating === 1).length,
        };

        return successResponse(res, 200, 'Lấy đánh giá thành công', {
            reviews,
            stats: {
                totalReviews: reviews.length,
                avgRating: Math.round(avgRating * 10) / 10,
                ratingDistribution,
            },
        });
    } catch (error) {
        console.error('Error in getUserReviews:', error);
        return errorResponse(res, 500, error.message || 'Lỗi server');
    }
};

/**
 * @desc    Lấy reviews mà user đã viết
 * @route   GET /api/reviews/my
 * @access  Private
 */
export const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ reviewerId: req.user._id })
            .populate('reviewedUserId', 'name email avatar')
            .populate({
                path: 'transactionId',
                populate: {
                    path: 'itemId',
                    select: 'title brand model images',
                },
            })
            .sort('-createdAt');

        return successResponse(res, 200, 'Lấy đánh giá thành công', reviews);
    } catch (error) {
        console.error('Error in getMyReviews:', error);
        return errorResponse(res, 500, error.message || 'Lỗi server');
    }
};

/**
 * @desc    Cập nhật review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment, images } = req.body;

        // Tìm review
        const review = await Review.findById(id);
        if (!review) {
            return errorResponse(res, 404, 'Đánh giá không tồn tại');
        }

        // Kiểm tra quyền sở hữu
        if (review.reviewerId.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Bạn không có quyền chỉnh sửa đánh giá này');
        }

        // Validate rating nếu có
        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return errorResponse(res, 400, 'Đánh giá phải từ 1 đến 5 sao');
        }

        // Update
        if (rating !== undefined) review.rating = rating;
        if (comment !== undefined) review.comment = comment;
        if (images !== undefined) review.images = images;

        await review.save();

        // Cập nhật lại avgRating của user được review
        await updateUserRating(review.reviewedUserId);

        await review.populate([
            { path: 'reviewerId', select: 'name email avatar' },
            { path: 'reviewedUserId', select: 'name email avatar' },
        ]);

        return successResponse(res, 200, 'Cập nhật đánh giá thành công', review);
    } catch (error) {
        console.error('Error in updateReview:', error);
        return errorResponse(res, 500, error.message || 'Lỗi server');
    }
};

/**
 * @desc    Lấy review của transaction (cho cả buyer và seller)
 * @route   GET /api/reviews/transaction/:transactionId
 * @access  Private
 */
export const getTransactionReview = async (req, res) => {
    try {
        const { transactionId } = req.params;

        console.log('🔍 Getting review for transaction:', transactionId);
        console.log('👤 User ID:', req.user._id);

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            console.log('❌ Transaction not found');
            return errorResponse(res, 404, 'Giao dịch không tồn tại');
        }

        console.log('📦 Transaction found:', {
            id: transaction._id,
            buyerId: transaction.buyerId,
            sellerId: transaction.sellerId,
            status: transaction.status
        });

        // Kiểm tra quyền
        const isBuyer = transaction.buyerId.toString() === req.user._id.toString();
        const isSeller = transaction.sellerId.toString() === req.user._id.toString();

        console.log('🔐 Permission check:', { isBuyer, isSeller });

        if (!isBuyer && !isSeller) {
            console.log('❌ User is neither buyer nor seller');
            return errorResponse(res, 403, 'Bạn không có quyền xem đánh giá này');
        }

        const review = await Review.findOne({ transactionId })
            .populate('reviewerId', 'name email avatar')
            .populate('reviewedUserId', 'name email avatar');

        console.log('📝 Review found:', review ? {
            id: review._id,
            reviewerId: review.reviewerId?._id,
            reviewedUserId: review.reviewedUserId?._id,
            rating: review.rating,
            hasResponse: !!review.sellerResponse
        } : 'null');

        return successResponse(res, 200, 'Lấy đánh giá thành công', review);
    } catch (error) {
        console.error('Error in getTransactionReview:', error);
        return errorResponse(res, 500, error.message || 'Lỗi server');
    }
};

/**
 * @desc    Phản hồi đánh giá (seller)
 * @route   PUT /api/reviews/:id/response
 * @access  Private
 */
export const respondToReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        if (!comment || !comment.trim()) {
            return errorResponse(res, 400, 'Nội dung phản hồi không được để trống');
        }

        const review = await Review.findById(id).populate('transactionId');
        if (!review) {
            return errorResponse(res, 404, 'Đánh giá không tồn tại');
        }

        const transaction = review.transactionId;
        const isSeller = transaction.sellerId.toString() === req.user._id.toString();

        if (!isSeller) {
            return errorResponse(res, 403, 'Chỉ người bán mới có thể phản hồi đánh giá');
        }

        review.sellerResponse = {
            comment: comment.trim(),
            respondedAt: new Date(),
        };

        await review.save();

        await review.populate([
            { path: 'reviewerId', select: 'name email avatar' },
            { path: 'reviewedUserId', select: 'name email avatar' },
        ]);

        return successResponse(res, 200, 'Phản hồi thành công', review);
    } catch (error) {
        console.error('Error in respondToReview:', error);
        return errorResponse(res, 500, error.message || 'Lỗi server');
    }
};

/**
 * @desc    Xóa review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm review
        const review = await Review.findById(id);
        if (!review) {
            return errorResponse(res, 404, 'Đánh giá không tồn tại');
        }

        // Kiểm tra quyền: owner hoặc admin
        const isOwner = review.reviewerId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return errorResponse(res, 403, 'Bạn không có quyền xóa đánh giá này');
        }

        const reviewedUserId = review.reviewedUserId;

        await review.deleteOne();

        // Cập nhật lại avgRating của user được review
        await updateUserRating(reviewedUserId);

        return successResponse(res, 200, 'Xóa đánh giá thành công');
    } catch (error) {
        console.error('Error in deleteReview:', error);
        return errorResponse(res, 500, error.message || 'Lỗi server');
    }
};

/**
 * Helper: Cập nhật avgRating và reviewCount của user
 */
async function updateUserRating(userId) {
    try {
        const reviews = await Review.find({ reviewedUserId: userId });

        const reviewCount = reviews.length;
        const avgRating =
            reviewCount > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
                : 0;

        await User.findByIdAndUpdate(userId, {
            avgRating: Math.round(avgRating * 10) / 10,
            reviewCount,
        });
    } catch (error) {
        console.error('Error updating user rating:', error);
    }
}
