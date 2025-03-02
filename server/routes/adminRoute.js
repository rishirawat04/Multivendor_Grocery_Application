import express from "express";
import { authorizeRoles, protect } from "../middlewares/auth.js";
import {  deleteUser, getAllUsers, getUserAndVendorCount, getUserById, updateUser } from "../controllers/admin/adminCustomerController.js";
import { getAllProducts, getVendorProducts, getVendorSells, getVendorShopCount,
} from "../controllers/admin/adminProductControllers.js";
import { adminDeleteReview, adminUpdateReview, getAllReviews } from "../controllers/admin/adminReviewController.js";
import { cancelOrder, getAllOrders, getOrderById, getTopSellingProducts } from "../controllers/admin/adminOrderController.js";
import { getVendorReport } from "../controllers/admin/getVendorReport.js";
import { getProfitLossReport, getProfitLossReportAuto } from "../controllers/admin/totalRevenue.js";

const router = express.Router();

              ////////////////////// protected route for Admin ////////////////////


///////////////////////////adminCustomerController/////////////////////////////////

// Get all users or filter by role (Admin only)
router.get('/users', protect, authorizeRoles('Admin'), getAllUsers);

// Get a single user by ID (Admin only)
router.get('/users/:id', protect, authorizeRoles('Admin'), getUserById);

// Update a user by ID (Admin only)
router.put('/users/:id', protect, authorizeRoles('Admin'), updateUser);

// Delete a user by ID (Admin only)
router.delete('/users/:id', protect, authorizeRoles('Admin'), deleteUser);

// Get total count of users and vendors (Admin only)
router.get('/users-count', protect, authorizeRoles('Admin'), getUserAndVendorCount);



/////////////////////////// ADMIN PRODUCT ROUTES /////////////////////////////////

///////////Others API are in Product routes /////////////////

// Get all products by a specific vendor (Admin only)
router.get('/products/vendor/:vendorId', protect, authorizeRoles('Admin'), getVendorProducts);

// Get total number of vendor shops (Admin only)
router.get('/vendor-shops-count', protect, authorizeRoles('Admin'), getVendorShopCount);

// get all products count 
router.get('/products', protect, getAllProducts);


// Get top selling products (Admin only)
router.get('/top-product', protect, authorizeRoles('Admin'), getTopSellingProducts)

//get vendor orders 
router.get('/vendor/:vendorId', protect, authorizeRoles('Admin'), getVendorSells)


/////////////////////////// ADMIN REVIEW ROUTES/////////////////////////////////

// Get all reviews with user data (Admin only)
router.get('/reviews', protect, authorizeRoles('Admin'), getAllReviews);

// Update a review (Admin only)
router.put('/reviews/:id', protect, authorizeRoles('Admin'), adminUpdateReview);

// Delete a review (Admin only)
router.delete('/reviews/:id', protect, authorizeRoles('Admin'), adminDeleteReview);


/////////////////////////// ADMIN ORDERS ROUTES /////////////////////////////////

// Get all orders with user and product details (Admin only)
router.get('/orders', protect, authorizeRoles('Admin', 'Vendor'), getAllOrders);

// Get details of a specific order by ID (Admin only)
router.get('/orders/:id', protect, authorizeRoles('Admin'), getOrderById);

// Cancel an order by ID (Admin only)
router.put('/orders/:id/cancel', protect, authorizeRoles('Admin'), cancelOrder);




/////////////////////////// REPORT  ROUTES /////////////////////////////////
router.get('/vendor-report', getVendorReport);
router.get('/profit-loss-report', getProfitLossReport);
router.get("/total-profit", getProfitLossReportAuto)



export default router;
