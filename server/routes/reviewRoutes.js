import express from "express";
import { protect } from "../middlewares/auth.js";
import { createReview, deleteReview, getProductReviews } from "../controllers/review/reviewController.js";

const router = express.Router();

// Create a new review
router.post('/', protect, createReview);

// Get all reviews for a product
router.get('/:productId', getProductReviews)
// Delete a review
router.delete('/:id', protect, deleteReview);

export default router;
