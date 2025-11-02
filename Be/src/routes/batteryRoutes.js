import express from 'express';
import { body } from 'express-validator';
import {
  getBatteries,
  getBatteryById,
  createBattery,
  updateBattery,
  deleteBattery,
  getMyBatteries,
} from '../controllers/batteryController.js';
import { authenticate, optionalAuth, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

// Validation rules
const batteryValidation = [
  body('title').trim().notEmpty().withMessage('Vui lòng nhập tiêu đề'),
  body('brand').notEmpty().withMessage('Vui lòng chọn hãng pin'),
  body('capacity').isFloat({ min: 1 }).withMessage('Dung lượng pin không hợp lệ'),
  body('health').isInt({ min: 0, max: 100 }).withMessage('Tình trạng pin phải từ 0-100%'),
  body('price').isFloat({ min: 0 }).withMessage('Giá không hợp lệ'),
  body('location').trim().notEmpty().withMessage('Vui lòng nhập địa chỉ'),
];

// Public routes

/**
 * @swagger
 * /api/batteries:
 *   get:
 *     tags: [Batteries]
 *     summary: Get all batteries
 *     description: Retrieve all batteries with filters and pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Batteries retrieved successfully
 */
router.get('/', optionalAuth, getBatteries);

/**
 * @swagger
 * /api/batteries/{id}:
 *   get:
 *     tags: [Batteries]
 *     summary: Get battery by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Battery retrieved successfully
 */
router.get('/:id', optionalAuth, getBatteryById);

// Protected routes

/**
 * @swagger
 * /api/batteries/my/batteries:
 *   get:
 *     tags: [Batteries]
 *     summary: Get my batteries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Batteries retrieved successfully
 */
router.get('/my/batteries', authenticate, getMyBatteries);

/**
 * @swagger
 * /api/batteries:
 *   post:
 *     tags: [Batteries]
 *     summary: Create new battery listing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - brand
 *               - capacity
 *               - health
 *               - price
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: Pin Tesla Model 3 75kWh
 *               brand:
 *                 type: string
 *                 example: Tesla
 *               capacity:
 *                 type: number
 *                 example: 75
 *               health:
 *                 type: number
 *                 example: 90
 *               voltage:
 *                 type: number
 *                 example: 350
 *               chemistry:
 *                 type: string
 *                 example: NMC
 *               price:
 *                 type: number
 *                 example: 120000000
 *               location:
 *                 type: string
 *                 example: Hà Nội
 *     responses:
 *       201:
 *         description: Battery created successfully
 */
router.post(
  '/',
  authenticate,
  authorize('member', 'admin'),
  batteryValidation,
  validate,
  createBattery
);

/**
 * @swagger
 * /api/batteries/{id}:
 *   put:
 *     tags: [Batteries]
 *     summary: Update battery
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
 *         description: Battery updated successfully
 */
router.put('/:id', authenticate, updateBattery);

/**
 * @swagger
 * /api/batteries/{id}:
 *   delete:
 *     tags: [Batteries]
 *     summary: Delete battery
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
 *         description: Battery deleted successfully
 */
router.delete('/:id', authenticate, deleteBattery);

export default router;
