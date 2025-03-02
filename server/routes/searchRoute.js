import express from 'express'
const router = express.Router()

import { getProductsByCategoryAndSubcategory } from "../controllers/search/searchController.js";
import { searchProducts } from '../controllers/search/searchBarController.js';

// Route to search products by category and subcategory
router.get('/product/filter', getProductsByCategoryAndSubcategory)
router.get('/product/search', searchProducts)

export default router