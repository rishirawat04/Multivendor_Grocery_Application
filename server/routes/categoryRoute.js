import express from 'express';
import { protect, authorizeRoles } from '../middlewares/auth.js';
import {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories
} from '../controllers/category/categoryController.js';

const router = express.Router();

// Public routes
router.get('/category', getAllCategories);

// Protected routes (Admin only)
router.post('/category', protect, authorizeRoles('Admin'), createCategory);
router.put('/category/:id', protect, authorizeRoles('Admin'), updateCategory);
router.delete('/category/:id', protect, authorizeRoles('Admin'), deleteCategory);

export default router;
