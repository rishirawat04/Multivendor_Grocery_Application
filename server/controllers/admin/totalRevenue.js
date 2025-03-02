import Order from '../../models/orderModel.js';
import Product from '../../models/ProductModel.js';  // Import the Product model

export const getProfitLossReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    // Ensure startDate and endDate are in the correct format
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate revenue and order details by vendor
    const vendorReport = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: 'Paid',
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",  // This should match your Product model collection name
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.vendor",
          totalRevenue: { $sum: { $multiply: ["$products.quantity", "$productDetails.price"] } }, // Calculate revenue based on quantity and product price
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
      { $sort: { totalRevenue: -1 } },
    ]);

    // Calculate the overall revenue and total number of orders
    const overallStats = vendorReport.reduce(
      (acc, vendor) => {
        acc.totalRevenue += vendor.totalRevenue;
        acc.totalOrders += vendor.totalOrders;
        return acc;
      },
      { totalRevenue: 0, totalOrders: 0 }
    );

    // Add the overall revenue and orders to the response
    const response = {
      vendorReport,
      overallStats,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getProfitLossReportAuto = async (req, res) => {
  try {
    // Calculate revenue, cost, and profit/loss by vendor
    const vendorReport = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'Paid',
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",  // Matches your Product model collection name
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.vendor",
          totalRevenue: { 
            $sum: { $multiply: ["$products.quantity", "$productDetails.price"] } 
          }, // Revenue = quantity * product price
          totalCost: { 
            $sum: { $multiply: ["$products.quantity", "$productDetails.costPrice"] } 
          }, // Cost = quantity * product costPrice
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
          totalCost: 1,
          totalOrders: 1,
          profitLoss: { $subtract: ["$totalRevenue", "$totalCost"] }, // Calculate profit or loss
        },
      },
      { $sort: { totalRevenue: -1 } }, // Sort vendors by revenue (descending)
    ]);

    // Calculate the overall revenue, cost, and total number of orders
    const overallStats = vendorReport.reduce(
      (acc, vendor) => {
        acc.totalRevenue += vendor.totalRevenue;
        acc.totalCost += vendor.totalCost;
        acc.totalOrders += vendor.totalOrders;
        acc.totalProfitLoss += vendor.profitLoss;
        return acc;
      },
      { totalRevenue: 0, totalCost: 0, totalOrders: 0, totalProfitLoss: 0 }
    );

    // Add the overall stats to the response
    const response = {
      vendorReport,
      overallStats,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
