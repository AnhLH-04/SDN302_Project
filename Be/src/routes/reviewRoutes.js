import express from 'express';
import { body } from 'express-validator';
import {
    createReview,
    getProductReviews,
    getUserReviews,
    getMyReviews,
    updateReview,
    deleteReview,
} from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

// Validation
const createReviewValidation = [
    body('transactionId')
        .notEmpty()
        .withMessage('Vui lòng cung cấp ID giao dịch'),
    body('reviewedUserId')
        .notEmpty()
        .withMessage('Vui lòng cung cấp ID người được đánh giá'),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Đánh giá phải từ 1 đến 5 sao'),
    body('comment')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Nhận xét không được vượt quá 1000 ký tự'),
];

const updateReviewValidation = [
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Đánh giá phải từ 1 đến 5 sao'),
    body('comment')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Nhận xét không được vượt quá 1000 ký tự'),
];

// Routes

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review for a transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *               - reviewedUserId
 *               - rating
 *             properties:
 *               transactionId:
 *                 type: string
 *               reviewedUserId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 */
router.post('/', authenticate, createReviewValidation, validate, createReview);

/**
 * @swagger
 * /api/reviews/product/{type}/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get reviews for a product (vehicle or battery)
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [vehicle, battery]
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get('/product/:type/:id', getProductReviews);

/**
 * @swagger
 * /api/reviews/user/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get reviews for a user (reviews they received)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get('/user/:id', getUserReviews);

/**
 * @swagger
 * /api/reviews/my:
 *   get:
 *     tags: [Reviews]
 *     summary: Get reviews that current user has written
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get('/my', authenticate, getMyReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 */
router.put('/:id', authenticate, updateReviewValidation, validate, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */
router.delete('/:id', authenticate, deleteReview);

export default router;
