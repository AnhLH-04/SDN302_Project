import { User } from '../models/userModel.js';
import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';

/**
 * Middleware xác thực user
 */
export const authenticate = async (req, res, next) => {
    try {
        let token;

        // Lấy token từ header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return errorResponse(
                res,
                401,
                'Vui lòng đăng nhập để truy cập tài nguyên này'
            );
        }

        // Verify token
        const decoded = verifyToken(token);

        // Tìm user
        const user = await User.findById(decoded.id);

        if (!user) {
            return errorResponse(res, 401, 'User không tồn tại');
        }

        if (!user.isActive) {
            return errorResponse(res, 401, 'Tài khoản đã bị khóa');
        }

        // Gán user vào request
        req.user = user;
        next();
    } catch (error) {
        return errorResponse(res, 401, 'Token không hợp lệ hoặc đã hết hạn');
    }
};

/**
 * Middleware kiểm tra role
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(res, 401, 'Vui lòng đăng nhập');
        }

        if (!roles.includes(req.user.role)) {
            return errorResponse(
                res,
                403,
                'Bạn không có quyền truy cập tài nguyên này'
            );
        }

        next();
    };
};

/**
 * Optional authentication - không bắt buộc đăng nhập
 */
export const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            const decoded = verifyToken(token);
            const user = await User.findById(decoded.id);
            if (user && user.isActive) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Ignore error, continue without user
        next();
    }
};
