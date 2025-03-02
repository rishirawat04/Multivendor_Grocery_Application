import express from "express";
import { addUserAddress } from "../controllers/order/UserAndCart.js";
import { createOrder, paymentFailure, verifyPayment } from "../controllers/order/orderController.js";



const router = express.Router();

// Route to add a user address
router.put('/user/:userId/address', addUserAddress);

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.post('/payment-failure', paymentFailure);



export default router;