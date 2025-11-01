import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  getFavoriteIds,
} from '../controllers/favoriteController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Quản lý danh sách yêu thích
 */

// Lấy danh sách yêu thích của tôi
router.get('/', authenticate, getFavorites);

// Lấy danh sách ID theo loại
router.get('/ids', authenticate, getFavoriteIds);

// Thêm vào yêu thích
router.post('/', authenticate, addFavorite);

// Xóa khỏi yêu thích
router.delete('/:itemType/:itemId', authenticate, removeFavorite);

export default router;
