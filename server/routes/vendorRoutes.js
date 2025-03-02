import express from "express";
import { authorizeRoles, protect } from "../middlewares/auth.js";
import { getAllReviews, getTopSellingProducts, getVendorOrders, getVendorProducts, getVendorProfitLoss } from "../controllers/vendor/vendorController.js";

const router = express.Router();

// Vendor-specific Routes (Protected)
router.route('/products')
  .get(protect, authorizeRoles('vendor'), getVendorProducts); // Get products created by the vendor

router.route('/reviews')
  .get(protect, authorizeRoles('vendor'), getAllReviews); // Get profit and loss report for the vendor

  router.route('/top-products')
  .get(protect, authorizeRoles('vendor'), getTopSellingProducts); // Get profit and loss report for the vendor



router.route('/orders')
  .get(protect, authorizeRoles('vendor'), getVendorOrders); // Get orders received by the vendor

router.route('/profit-loss-report')
  .get(protect, authorizeRoles('vendor'), getVendorProfitLoss); // Get profit and loss report for the vendor


export default router;
