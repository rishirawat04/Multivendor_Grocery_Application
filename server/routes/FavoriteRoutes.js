import express from 'express';
import { protect } from '../middlewares/auth.js';
import { addToFavorites, getFavorites } from '../controllers/favorite/favoriteController.js';

const router = express.Router();

router.post('/favorites', protect, addToFavorites); // Add to favorites
router.get('/favorites', protect, getFavorites); // Get user's favorites

export default router;
