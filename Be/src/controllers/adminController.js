import { User } from '../models/userModel.js';
import { Vehicle } from '../models/vehicleModel.js';
import { Battery } from '../models/batteryModel.js';
import { Transaction } from '../models/transactionModel.js';
import { Report } from '../models/reportModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * @desc    Lấy thống kê tổng quan (Dashboard)
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVehicles = await Vehicle.countDocuments();
        const totalBatteries = await Battery.countDocuments();
        const totalTransactions = await Transaction.countDocuments();
        const completedTransactions = await Transaction.countDocuments({
            status: 'completed',
        });
        const pendingTransactions = await Transaction.countDocuments({
            status: 'pending',
        });

        // Tính tổng doanh thu
        const revenue = await Transaction.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        // Tính tổng hoa hồng
        const commission = await Transaction.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$commission' } } },
        ]);

        return successResponse(res, 200, 'Lấy thống kê thành công', {
            stats: {
                totalUsers,
                totalVehicles,
                totalBatteries,
                totalTransactions,
                completedTransactions,
                pendingTransactions,
                totalRevenue: revenue[0]?.total || 0,
                totalCommission: commission[0]?.total || 0,
            },
        });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

/**
 * @desc    Quản lý users (lấy tất cả)
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort('-createdAt');

        return successResponse(res, 200, 'Lấy danh sách users thành công', {
            users,
            total: users.length,
        });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

/**
 * @desc    Cập nhật trạng thái user (active/block)
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin)
 */
export const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return errorResponse(res, 404, 'User không tồn tại');
        }

        // Không thể block chính mình
        if (user._id.toString() === req.user._id.toString()) {
            return errorResponse(res, 400, 'Bạn không thể thay đổi trạng thái của chính mình');
        }

        user.isActive = isActive;
        await user.save();

        return successResponse(
            res,
            200,
            `${isActive ? 'Mở khóa' : 'Khóa'} tài khoản thành công`,
            { user }
        );
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

/**
 * @desc    Xóa user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return errorResponse(res, 404, 'User không tồn tại');
        }

        if (user._id.toString() === req.user._id.toString()) {
            return errorResponse(res, 400, 'Bạn không thể xóa chính mình');
        }

        await User.findByIdAndDelete(req.params.id);

        return successResponse(res, 200, 'Xóa user thành công');
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

/**
 * @desc    Duyệt/Ẩn tin đăng xe
 * @route   PUT /api/admin/vehicles/:id/verify
 * @access  Private (Admin)
 */
export const verifyVehicle = async (req, res) => {
    try {
        const { isVerified, status } = req.body;

        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return errorResponse(res, 404, 'Xe không tồn tại');
        }

        if (isVerified !== undefined) {
            vehicle.isVerified = isVerified;
        }

        if (status) {
            vehicle.status = status;
        }

        await vehicle.save();

        return successResponse(res, 200, 'Cập nhật trạng thái xe thành công', {
            vehicle,
        });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

/**
 * @desc    Duyệt/Ẩn tin đăng pin
 * @route   PUT /api/admin/batteries/:id/verify
 * @access  Private (Admin)
 */
export const verifyBattery = async (req, res) => {
    try {
        const { isVerified, status } = req.body;

        const battery = await Battery.findById(req.params.id);

        if (!battery) {
            return errorResponse(res, 404, 'Pin không tồn tại');
        }

        if (isVerified !== undefined) {
            battery.isVerified = isVerified;
        }

        if (status) {
            battery.status = status;
        }

        await battery.save();

        return successResponse(res, 200, 'Cập nhật trạng thái pin thành công', {
            battery,
        });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

/**
 * @desc    Lấy tất cả báo cáo
 * @route   GET /api/admin/reports
 * @access  Private (Admin)
 */
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('reporterId', 'name email')
            .populate('reportedUserId', 'name email')
            .populate('resolvedBy', 'name email')
            .sort('-createdAt');

        return successResponse(res, 200, 'Lấy danh sách báo cáo thành công', {
            reports,
            total: reports.length,
        });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

/**
 * @desc    Xử lý báo cáo
 * @route   PUT /api/admin/reports/:id
 * @access  Private (Admin)
 */
export const resolveReport = async (req, res) => {
    try {
        const { status, adminNote } = req.body;

        const report = await Report.findById(req.params.id);

        if (!report) {
            return errorResponse(res, 404, 'Báo cáo không tồn tại');
        }

        report.status = status;
        report.adminNote = adminNote;
        report.resolvedBy = req.user._id;
        report.resolvedAt = new Date();

        await report.save();

        return successResponse(res, 200, 'Xử lý báo cáo thành công', { report });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};
