import express from 'express';
import { 
  createDealOffer, 
  getActiveDeals, 
  getAllDeals, 
  updateDeal, 
  deleteDeal 
} from '../controllers/offers/offerController.js';
import { protect, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// Public routes - accessible to all users
router.get('/deals', getActiveDeals);

// Admin routes - requires Admin role
router.post('/deals', protect, authorizeRoles('Admin'), createDealOffer);
router.get('/admin/deals', protect, authorizeRoles('Admin'), getAllDeals);
router.put('/deals/:id', protect, authorizeRoles('Admin'), updateDeal);
router.delete('/deals/:id', protect, authorizeRoles('Admin'), deleteDeal);

export default router; 