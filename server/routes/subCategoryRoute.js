import express from 'express';
import { protect, authorizeRoles } from '../middlewares/auth.js';
import {
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getAllSubcategories,
    getSubcategoriesByCategoryId
} from '../controllers/category/subCategoryController.js';

const router = express.Router();

// Public routes
router.get('/subCategory', getAllSubcategories);




// Protected routes (Admin only)
router.post('/subCategory', protect, authorizeRoles('Admin'), createSubcategory);
router.put('/subCategory/:id', protect, authorizeRoles('Admin'), updateSubcategory);
router.delete('/subCategory/:id', protect, authorizeRoles('Admin'), deleteSubcategory);
router.get('/subcategory/:categoryId', protect, authorizeRoles('Admin'), getSubcategoriesByCategoryId);

export default router;
