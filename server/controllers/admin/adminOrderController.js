import Order from "../../models/orderModel.js";
import Product from '../../models/ProductModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Get All Orders with Product and User Details (for a specific vendor or admin)
export const getAllOrders = async (req, res) => {
  try {
    const userId = req.user._id;  // Assuming req.user contains the logged-in user's information
    const accountType = req.user.accountType; // Vendor or Admin
    const vendorProducts = req.user.products; // Vendor's products
console.log("vP",vendorProducts);

    let orders;

    if (accountType === 'Vendor') {
      // If the user is a Vendor, fetch all orders that contain any of the vendor's products
      orders = await Order.find({
        'products.product': { $in: vendorProducts }
      })
      .populate('user', 'fullName email')
      .populate({
        path: 'products.product',
        select: 'name price vendorShop',
      });

    } else if (accountType === 'Admin') {
      // If the user is an Admin, fetch all orders
      orders = await Order.find()
        .populate('user', 'fullName email')
        .populate('products.product', 'name price vendorShop');
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }
    console.log(orders);
    

    res.status(200).json({ success: true, totalOrders: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};






// Cancel an Order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = 'Cancelled';
    await order.save();

    res.status(200).json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get Order Details by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'fullName email')
      .populate('products.product', 'name price')
      .populate('deliveryAddress');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// get top selling products 
export const getTopSellingProducts = async (req, res) => {
  const { startDate, endDate } = req.query; // Extract dates from query parameters

  try {
    // Validate and parse the dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start, // Match orders created after or on the start date
            $lt: end // Match orders created before the end date
          }
        }
      },
      {
        $unwind: '$products' // Unwind the products array to get individual products
      },
      {
        $lookup: {
          from: 'products', // Name of the products collection
          localField: 'products.product', // Field in the Order document
          foreignField: '_id', // Field in the Product collection to match
          as: 'productDetails' // Name of the new array field
        }
      },
      {
        $unwind: '$productDetails' // Unwind the productDetails array for easier access
      },
      {
        $group: {
          _id: '$products.product', // Group by product ID
          totalSold: { $sum: '$products.quantity' }, // Sum the quantities sold
          totalRevenue: { $sum: { $multiply: ['$products.quantity', '$productDetails.price'] } } // Calculate total revenue based on quantity and price
        }
      },
      {
        $lookup: {
          from: 'products', // Name of the products collection again to get details
          localField: '_id', // Grouped product ID
          foreignField: '_id', // Field in the products collection to match
          as: 'productInfo' // Name of the new array field
        }
      },
      {
        $unwind: '$productInfo' // Unwind the productInfo array for easier access
      },
      {
        $project: {
          _id: 0, // Exclude the default _id
          productId: '$_id', // Include the product ID
          name: '$productInfo.name', // Product name
          price: '$productInfo.price', // Product price
          totalSold: 1, // Total quantity sold
          totalRevenue: 1 // Total revenue generated
        }
      },
      {
        $sort: { totalSold: -1 } // Sort by total quantity sold in descending order
      },
      {
        $limit: 10 // Limit to the top 10 products
      }
    ]);

    res.status(200).json({ success: true, topProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


