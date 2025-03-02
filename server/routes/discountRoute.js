import express from 'express';
import { applyCoupon, createDiscount, deleteDiscount, getAllDiscounts, updateDiscount } from '../controllers/discount/DiscountController.js';
import { authorizeRoles, protect } from "../middlewares/auth.js";

const router = express.Router();

router.post('/discount', protect, authorizeRoles('Admin', 'Vendor'), createDiscount);
router.put('/discount/:id', protect, authorizeRoles('Admin', 'Vendor'), updateDiscount);
router.delete('/discount/:id', protect, authorizeRoles('Admin', 'Vendor'), deleteDiscount);
router.post('/discount', protect, authorizeRoles('User'), applyCoupon);
router.post('/discount', protect, getAllDiscounts);



export default router;
