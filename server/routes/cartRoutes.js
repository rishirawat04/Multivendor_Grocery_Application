import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cart/cartController.js';
import { protect } from "../middlewares/auth.js"

const router = express.Router();

router.post('/cart', protect, addToCart); // Add to cart
router.get('/cart', protect, getCart); // Get user's cart
router.delete('/cart/remove', protect, removeFromCart); // Get user's cart
export default router;
