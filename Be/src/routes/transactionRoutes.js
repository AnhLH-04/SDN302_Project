import express from 'express';
import { body } from 'express-validator';
import {
    createTransaction,
    getMyTransactions,
    getTransactionById,
    updateTransactionStatus,
    getAllTransactions,
} from '../controllers/transactionController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

// Validation
const createTransactionValidation = [
    body('itemType')
        .isIn(['vehicle', 'battery'])
        .withMessage('Loại sản phẩm không hợp lệ'),
    body('itemId').notEmpty().withMessage('Vui lòng chọn sản phẩm'),
];

const updateStatusValidation = [
    body('status')
        .isIn(['confirmed', 'completed', 'cancelled', 'disputed'])
        .withMessage('Trạng thái không hợp lệ'),
];

// Routes

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     tags: [Transactions]
 *     summary: Create new transaction
 *     description: Create a purchase transaction for vehicle or battery
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemType
 *               - itemId
 *             properties:
 *               itemType:
 *                 type: string
 *                 enum: [vehicle, battery]
 *                 example: vehicle
 *               itemId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Item not available or invalid
 */
router.post(
    '/',
    authenticate,
    authorize('member', 'admin'),
    createTransactionValidation,
    validate,
    createTransaction
);

/**
 * @swagger
 * /api/transactions/my-transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: Get my transactions
 *     description: Get all transactions for current user (as buyer or seller)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 */
router.get('/my-transactions', authenticate, getMyTransactions);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: Get all transactions (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All transactions retrieved
 *       403:
 *         description: Forbidden - admin only
 */
router.get('/', authenticate, authorize('admin'), getAllTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     tags: [Transactions]
 *     summary: Get transaction by ID
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
 *         description: Transaction retrieved successfully
 */
router.get('/:id', authenticate, getTransactionById);

/**
 * @swagger
 * /api/transactions/{id}/status:
 *   put:
 *     tags: [Transactions]
 *     summary: Update transaction status
 *     description: Update status (seller can confirm, buyer can complete/cancel)
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, completed, cancelled, disputed]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Transaction status updated
 */
router.put(
    '/:id/status',
    authenticate,
    updateStatusValidation,
    validate,
    updateTransactionStatus
);

export default router;
