import Order from "../../models/orderModel.js";
import Product from "../../models/ProductModel.js";
import User from "../../models/userModel.js";



// Get all products (Public)
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category').populate('subcategory');

        // get the total count of products 
        const totalProducts = await Product.countDocuments()
        // Send the response with a success message, product details, and total count
        res.json({
            message: "Products fetched successfully",
            totalCount: totalProducts,
            products: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all products created by the vendor
export const getVendorProducts = async (req, res) => {
    try {
    
     const {vendorId} = req.params
  
    //  console.log("this is running ", vendorId);
      const products = await Product.find({ vendor: vendorId })
      .populate('category')
      .populate('subcategory');
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Get total number of vendor shops
export const getVendorShopCount = async (req, res) => {
    try {
        const vendorShops = await User.distinct("vendorShop", { role: "Vendor" });
        const totalShops = vendorShops.length;
        res.status(200).json({ success: true, data: { totalShops, vendorShops } });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};


// get vendor top selling products 
export const getVendorSells = async (req, res) => {
    try {
      // Extract vendor ID from the request (assuming it's available in req.user)
      const { vendorId }= req.params;
       
       
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


