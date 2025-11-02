import express from 'express';
import { getBrands } from '../controllers/brandController.js';

const router = express.Router();

// Public: lấy danh sách brand theo type (vehicle/battery)
router.get('/', getBrands);

export default router;
