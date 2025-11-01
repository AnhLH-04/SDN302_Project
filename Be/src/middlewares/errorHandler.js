import { errorResponse } from '../utils/response.js';

/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error('Error:', err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Tài nguyên không tìm thấy';
        return errorResponse(res, 404, message);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field} đã tồn tại trong hệ thống`;
        return errorResponse(res, 400, message);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((val) => val.message);
        return errorResponse(res, 400, 'Dữ liệu không hợp lệ', errors);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 401, 'Token không hợp lệ');
    }

    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 401, 'Token đã hết hạn');
    }

    // Default error
    return errorResponse(
        res,
        err.statusCode || 500,
        err.message || 'Lỗi server'
    );
};

/**
 * Not found middleware
 */
export const notFound = (req, res, next) => {
    return errorResponse(
        res,
        404,
        `Route ${req.originalUrl} không tồn tại`
    );
};
