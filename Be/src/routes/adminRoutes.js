import express from 'express';
import { body } from 'express-validator';
import {
    getStats,
    getAllUsers,
    updateUserStatus,
    deleteUser,
    verifyVehicle,
    verifyBattery,
    getAllReports,
    resolveReport,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

// Tất cả routes đều yêu cầu admin role
router.use(authenticate, authorize('admin'));

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get platform statistics
 *     description: Get dashboard statistics (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       403:
 *         description: Forbidden - admin only
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users
 *     description: Get list of all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}/status:
 *   put:
 *     tags: [Admin]
 *     summary: Update user status
 *     description: Activate or deactivate user account
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
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: User status updated
 */
router.put(
    '/users/:id/status',
    body('isActive').isBoolean().withMessage('isActive phải là boolean'),
    validate,
    updateUserStatus
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete user
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
 *         description: User deleted successfully
 */
router.delete('/users/:id', deleteUser);

/**
 * @swagger
 * /api/admin/vehicles/{id}/verify:
 *   put:
 *     tags: [Admin]
 *     summary: Verify vehicle listing
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
 *         description: Vehicle verified
 */
router.put('/vehicles/:id/verify', verifyVehicle);

/**
 * @swagger
 * /api/admin/batteries/{id}/verify:
 *   put:
 *     tags: [Admin]
 *     summary: Verify battery listing
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
 *         description: Battery verified
 */
router.put('/batteries/:id/verify', verifyBattery);

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     tags: [Admin]
 *     summary: Get all reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 */
router.get('/reports', getAllReports);

/**
 * @swagger
 * /api/admin/reports/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Resolve report
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
 *               status:
 *                 type: string
 *                 enum: [reviewing, resolved, rejected]
 *     responses:
 *       200:
 *         description: Report status updated
 */
router.put(
    '/reports/:id',
    body('status')
        .isIn(['reviewing', 'resolved', 'rejected'])
        .withMessage('Trạng thái không hợp lệ'),
    validate,
    resolveReport
);

export default router;
