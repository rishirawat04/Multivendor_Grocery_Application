import express from 'express';
import { 
    createOffer, 
    getAllOffers, 
    getOfferById, 
    updateOffer, 
    deleteOffer,
    getActiveSpecialOffers,
    getActiveDealsOfTheDay
} from '../../controllers/offers/offerController.js';
import { verifyToken, verifyAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes (protected)
router.post('/create', verifyToken, verifyAdmin, createOffer);
router.get('/admin', verifyToken, verifyAdmin, getAllOffers);
router.get('/admin/:id', verifyToken, verifyAdmin, getOfferById);
router.put('/admin/:id', verifyToken, verifyAdmin, updateOffer);
router.delete('/admin/:id', verifyToken, verifyAdmin, deleteOffer);

// Public routes
router.get('/special', getActiveSpecialOffers);
router.get('/daily', getActiveDealsOfTheDay);
router.get('/:id', getOfferById);

export default router; 