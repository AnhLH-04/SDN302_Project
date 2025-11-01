import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/response.js';

/**
 * Middleware để validate dữ liệu từ express-validator
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return errorResponse(res, 400, 'Dữ liệu không hợp lệ', errorMessages);
    }

    next();
};
