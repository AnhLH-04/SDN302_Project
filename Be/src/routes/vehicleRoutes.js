import express from 'express';
import { body } from 'express-validator';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getMyVehicles,
} from '../controllers/vehicleController.js';
import { authenticate, optionalAuth, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

// Validation rules
const vehicleValidation = [
  body('title').trim().notEmpty().withMessage('Vui lòng nhập tiêu đề'),
  body('brand').notEmpty().withMessage('Vui lòng chọn hãng xe'),
  body('model').trim().notEmpty().withMessage('Vui lòng nhập model xe'),
  body('year').isInt({ min: 2010 }).withMessage('Năm sản xuất không hợp lệ'),
  body('price').isFloat({ min: 0 }).withMessage('Giá không hợp lệ'),
  body('batteryCapacity').isFloat({ min: 0 }).withMessage('Dung lượng pin không hợp lệ'),
  body('location').trim().notEmpty().withMessage('Vui lòng nhập địa chỉ'),
];

// Public routes

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     tags: [Vehicles]
 *     summary: Get all vehicles
 *     description: Retrieve all vehicles with optional filters and pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, sold, reserved]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Vehicles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vehicle'
 */
router.get('/', optionalAuth, getVehicles);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     tags: [Vehicles]
 *     summary: Get vehicle by ID
 *     description: Retrieve a single vehicle by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle retrieved successfully
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', getVehicleById);

// Protected routes

/**
 * @swagger
 * /api/vehicles/my/vehicles:
 *   get:
 *     tags: [Vehicles]
 *     summary: Get my vehicles
 *     description: Get all vehicles posted by current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehicles retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/my/vehicles', authenticate, getMyVehicles);

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     tags: [Vehicles]
 *     summary: Create new vehicle listing
 *     description: Create a new vehicle for sale (member/admin only)
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
 *               - model
 *               - year
 *               - price
 *               - batteryCapacity
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: VinFast VF9 2024
 *               brand:
 *                 type: string
 *                 example: VinFast
 *               model:
 *                 type: string
 *                 example: VF9
 *               year:
 *                 type: number
 *                 example: 2024
 *               price:
 *                 type: number
 *                 example: 1200000000
 *               mileage:
 *                 type: number
 *                 example: 5000
 *               batteryCapacity:
 *                 type: number
 *                 example: 123
 *               batteryHealth:
 *                 type: number
 *                 example: 98
 *               condition:
 *                 type: string
 *                 enum: [excellent, good, fair, poor]
 *                 example: excellent
 *               description:
 *                 type: string
 *                 example: Xe mới đi 5000km
 *               location:
 *                 type: string
 *                 example: TP. Hồ Chí Minh
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - member role required
 */
router.post(
  '/',
  authenticate,
  authorize('member', 'admin'),
  vehicleValidation,
  validate,
  createVehicle
);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     tags: [Vehicles]
 *     summary: Update vehicle
 *     description: Update vehicle information (owner only)
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
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [available, sold, reserved]
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 */
router.put('/:id', authenticate, updateVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     tags: [Vehicles]
 *     summary: Delete vehicle
 *     description: Delete vehicle listing (owner or admin only)
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
 *         description: Vehicle deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 */
router.delete('/:id', authenticate, deleteVehicle);

export default router;
