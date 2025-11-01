import express from 'express';
import { body } from 'express-validator';
import {
    register,
    login,
    getMe,
    updateMe,
    changePassword,
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

// Validation rules
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Vui lòng nhập tên'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('phone')
        .optional()
        .matches(/^(0|\+84)[0-9]{9}$/)
        .withMessage('Số điện thoại không hợp lệ (VD: 0901234567)'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu'),
];

const changePasswordValidation = [
    body('currentPassword').notEmpty().withMessage('Vui lòng nhập mật khẩu hiện tại'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
];

const updateProfileValidation = [
    body('name').optional().trim().notEmpty().withMessage('Tên không được để trống'),
    body('phone')
        .optional()
        .matches(/^(0|\+84)[0-9]{9}$/)
        .withMessage('Số điện thoại không hợp lệ (VD: 0901234567)'),
    body('address').optional().trim(),
    body('avatar').optional().isURL().withMessage('Avatar phải là URL hợp lệ'),
];

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyễn Văn B
 *               email:
 *                 type: string
 *                 example: nguyenvanb@gmail.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               phone:
 *                 type: string
 *                 example: "0901234567"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
router.post('/register', registerValidation, validate, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     description: Authenticate user and return JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: nguyenvana@gmail.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginValidation, validate, login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current user profile
 *     description: Get logged in user information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, getMe);

/**
 * @swagger
 * /api/auth/me:
 *   put:
 *     tags: [Authentication]
 *     summary: Update user profile
 *     description: Update current user information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyễn Văn C
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               address:
 *                 type: string
 *                 example: "123 Nguyễn Huệ, Q1, TP.HCM"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/me', authenticate, updateProfileValidation, validate, updateMe);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     tags: [Authentication]
 *     summary: Change user password
 *     description: Change current user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized or wrong current password
 */
router.put('/change-password', authenticate, changePasswordValidation, validate, changePassword);

/**
 * TODO: Các routes bổ sung cần thiết cho production:
 * 
 * 1. Email Verification
 *    - POST /api/auth/verify-email (gửi email xác thực)
 *    - GET /api/auth/verify/:token (xác nhận email qua link)
 * 
 * 2. Password Reset
 *    - POST /api/auth/forgot-password (gửi email reset)
 *    - POST /api/auth/reset-password/:token (đặt lại mật khẩu)
 * 
 * 3. Token Management
 *    - POST /api/auth/refresh-token (làm mới access token)
 *    - POST /api/auth/logout (blacklist token)
 * 
 * 4. Security Features
 *    - Rate limiting cho login/register (express-rate-limit)
 *    - 2FA/OTP authentication (optional)
 *    - Social login: Google, Facebook (passport.js)
 * 
 * 5. Profile Features
 *    - GET /api/auth/transaction-history (lịch sử giao dịch)
 *    - GET /api/auth/favorites (danh sách yêu thích)
 *    - DELETE /api/auth/account (xóa tài khoản)
 */

export default router;
