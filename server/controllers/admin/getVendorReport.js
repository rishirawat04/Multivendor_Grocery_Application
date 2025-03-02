import Order from "../../models/orderModel.js";
import Product from "../../models/ProductModel.js";

export const getVendorReport = async (req, res) => {
  const { startDate, endDate } = req.query;
 
   
  try {
    // Ensure startDate and endDate are in the correct format
    const start = new Date(startDate);
    const end = new Date(endDate);

    const report = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: 'Paid',
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",  // The product collection
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.vendor",  // Group by vendor
          totalProductsSold: { $sum: "$products.quantity" },
          totalRevenue: { 
            $sum: { $multiply: ["$products.quantity", "$productDetails.price"] }  // Calculate total revenue based on product price and quantity
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "vendorDetails",
        },
      },
      { $unwind: "$vendorDetails" },
      {
        $project: {
          vendorId: "$vendorDetails._id",
          vendorName: "$vendorDetails.fullName",
          totalProductsSold: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { totalProductsSold: -1 } },  // Sort by total products sold in descending order
    ]);

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
