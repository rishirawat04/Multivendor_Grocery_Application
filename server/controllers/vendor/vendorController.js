import mongoose from "mongoose";
import Order from "../../models/orderModel.js";
import Product from "../../models/ProductModel.js";
import Review from "../../models/reviewModel.js";

// Get all products created by the vendor
export const getVendorProducts = async (req, res) => {
  try {
  // console.log("id",req.user);
   const vendorId = new mongoose.Types.ObjectId(req.user.id); 

  //  console.log("this is running ", vendorId);
    const products = await Product.find({ vendor: vendorId })
    .populate('category')
    .populate('subcategory');

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all orders related to vendor's products and calculate total revenue using aggregation pipeline
export const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user.id;

    // Fetch product IDs for the vendor
    const products = await Product.find({ vendor: vendorId }).select('_id');
    const productIds = products.map(product => product._id.toString());

    // Aggregation pipeline
    const orders = await Order.aggregate([
      // Match orders that contain the vendor's products
      { $match: { "products.product": { $in: productIds.map(id => new mongoose.Types.ObjectId(id)) } } },

      // Unwind the products array to process each product individually
      { $unwind: "$products" },

      // Match only the vendor's products
      { $match: { "products.product": { $in: productIds.map(id => new mongoose.Types.ObjectId(id)) } } },

      // Lookup product details to get the name, price, discounted price, etc.
      {
        $lookup: {
          from: 'products',
          localField: 'products.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },

      // Unwind the product details array
      { $unwind: "$productDetails" },

      // Lookup user details to get name and email
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },

      // Unwind the user details array to extract email and name
      { $unwind: "$userDetails" },

      // Group orders and calculate total revenue for each payment status (Paid, Pending)
      {
        $group: {
          _id: "$paymentStatus", // Group by payment status (Paid, Pending, etc.)
          totalRevenue: {
            $sum: "$totalPrice" // Sum the totalPrice field of the order
          },
          orders: { 
            $push: { 
              orderId: "$_id", // Include order ID
              user: { email: "$userDetails.email", name: "$userDetails.fullName" },
              totalPrice: "$totalPrice",
              paymentStatus: "$paymentStatus",
              deliveryAddress: "$deliveryAddress",
              products: {
                productId: "$products.product",
                quantity: "$products.quantity",
                name: "$productDetails.name",
                price: "$productDetails.price",
                discountedPrice: "$productDetails.discountedPrice"
              },
              paymentInfo: "$paymentInfo", // Include payment information
              deliveryDate: "$deliveryDate", // Include delivery date
              createdAt: "$createdAt", // Include the order creation date
              status: "$status" // Include order status (if available)
            } 
          } // Collect all matching orders with full details
        }
      }
    ]);

    // Separate the revenues by payment status and prepare the full order details
    let totalPaidRevenue = 0;
    let totalPendingRevenue = 0;
    let allOrders = [];

    orders.forEach(group => {
      // Accumulate revenue for paid and pending orders
      if (group._id.toLowerCase() === 'paid') {
        totalPaidRevenue = group.totalRevenue;
      } else if (group._id.toLowerCase() === 'pending') {
        totalPendingRevenue = group.totalRevenue;
      }
      // Push all the orders into the array to return all of them
      allOrders = [...allOrders, ...group.orders];
    });

    // Send the response with total revenues and all order details
    res.status(200).json({
      totalPaidRevenue,
      totalPendingRevenue,
      totalOrders: allOrders.length,
      orders: allOrders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get vendor top selling products 
export const getTopSellingProducts = async (req, res) => {
  try {
    // Extract vendor ID from the request (assuming it's available in req.user)
    const vendorId = req.user._id; // Adjust this as per your authentication setup

    // Fetch orders with product details
    const orders = await Order.aggregate([
      { $unwind: '$products' }, // Flatten the products array
      {
        $lookup: {
          from: 'products', // The name of the products collection
          localField: 'products.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' }, // Unwind the product details
      {
        $match: {
          'productDetails.vendor': vendorId // Filter by vendor ID
        }
      },
      {
        $group: {
          _id: '$products.product', // Group by product ID
          totalAmount: { $sum: '$totalPrice' }, // Sum of total prices
          totalQuantity: { $sum: '$products.quantity' }, // Total quantity sold
          lastOrderDate: { $max: '$createdAt' }, // Get the last order date
          paymentStatus: { $first: '$paymentStatus' } // Get the payment status
        }
      },
      {
        $sort: { totalAmount: -1 } // Sort by total amount in descending order
      },
      { $limit: 10 } // Limit to top 10 products
    ]);

    // Populate product details for each top-selling product
    const topSellingProducts = await Promise.all(
      orders.map(async order => {
        const product = await Product.findById(order._id).select('name'); // Fetch product name
        return {
          id: order._id,
          name: product ? product.name : 'Unknown Product',
          amount: order.totalAmount,
          status: order.paymentStatus,
          createdAt: order.lastOrderDate
        };
      })
    );

    return res.status(200).json({ topSellingProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Get total profit and loss for the vendor
export const getVendorProfitLoss = async (req, res) => {
  const { startDate, endDate } = req.query;
  const vendorId = req.user._id; // Assuming the logged-in vendor's ID is stored in req.user._id

  try {
    // Ensure startDate and endDate are in the correct format
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate revenue, total orders, and total products sold for the logged-in vendor
    const [orderStats, productStats] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            paymentStatus: 'Paid',
          },
        },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "products",
            localField: "products.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $match: {
            "productDetails.vendor": vendorId, // Filter by logged-in vendor ID
          },
        },
        {
          $group: {
            _id: "$productDetails.vendor",
            totalRevenue: { $sum: "$totalPrice" },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "vendor",
          },
        },
        { $unwind: "$vendor" },
        {
          $project: {
            vendorId: "$vendor._id",
            vendorName: "$vendor.fullName",
            totalRevenue: 1,
            totalOrders: 1,
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            paymentStatus: 'Paid',
          },
        },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "products",
            localField: "products.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $match: {
            "productDetails.vendor": vendorId, // Filter by logged-in vendor ID
          },
        },
        {
          $group: {
            _id: "$productDetails.vendor",
            totalProductsSold: { $sum: "$products.quantity" }, // Sum of product quantities
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "vendor",
          },
        },
        { $unwind: "$vendor" },
        {
          $project: {
            vendorId: "$vendor._id",
            vendorName: "$vendor.fullName",
            totalProductsSold: 1,
          },
        },
      ]),
    ]);

    if (!orderStats.length || !productStats.length) {
      return res.status(404).json({ message: "No data found for the specified period." });
    }

    const orderData = orderStats[0];
    const productData = productStats[0];

    res.status(200).json({
      totalRevenue: orderData.totalRevenue,
      totalOrders: orderData.totalOrders,
      totalProductsSold: productData.totalProductsSold,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all reviews for a particular vendor's products with user data
export const getAllReviews = async (req, res) => {
  try {
    // Get the vendor ID from the authenticated user
    const vendorId = req.user._id;

    // Find all products belonging to the vendor
    const products = await Product.find({ vendor: vendorId }).select('_id');

    // If no products found for the vendor, return an empty response
    if (!products.length) {
      return res.status(200).json({ success: true, reviews: [], totalReviews: 0 });
    }

    // Get product IDs
    const productIds = products.map(product => product._id);

    // Find reviews associated with the vendor's products
    const reviews = await Review.find({ product: { $in: productIds } }).populate("user", "name email");

    // Get total number of reviews for the vendor's products
    const totalReviews = reviews.length; // countDocuments is not needed here as we have the reviews already

    res.status(200).json({ success: true, reviews, totalReviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



