import express from 'express';


import { createProduct, deleteProduct, getAllProducts, getProductById, getProductsByCategory, updateProduct } from '../controllers/products/productController.js';
import { authorizeRoles, protect } from '../middlewares/auth.js';

const router = express.Router();

// Public Routes
router.route('/').get(getAllProducts); // Get all products
router.route('/:id').get(getProductById); // Get a single product by ID
router.route('/category/:categoryId').get(getProductsByCategory);


// Admin and Vendor Routes (Protected)
router.route('/addProduct').post(protect, authorizeRoles('admin', 'vendor'), createProduct); // Create a product
router.route('/:id')
    .put(protect, authorizeRoles('admin', 'vendor'), updateProduct)     // Update product details (admin or vendor for own product)
    .delete(protect, authorizeRoles('admin', 'vendor'), deleteProduct); // Delete product (admin or vendor for own product)

export default router;
