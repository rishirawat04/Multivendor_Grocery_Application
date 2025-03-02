import crypto from 'crypto';
import mongoose from 'mongoose';
import Order from '../../models/orderModel.js'
import Product from '../../models/ProductModel.js';
import Razorpay from 'razorpay';
import User from '../../models/userModel.js';
import dotenv from 'dotenv';



dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, products, totalPrice } = req.body;

    // User validation
    const user = await User.findById(userId);
    if (!user || !user.addresses || user.addresses.length === 0) {
      throw new Error('User address not found');
    }
    const deliveryAddress = user.addresses[0];

    // Calculate price and validate stock
    let calculatedPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.product).session(session);
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product?.name}`);
      }
      calculatedPrice += product.discountedPrice * item.quantity;
    }
    if (calculatedPrice !== totalPrice) {
      throw new Error('Price mismatch. Please refresh the page.');
    }

    // Create Razorpay order
    const options = {
      amount: totalPrice * 100, 
      currency: 'INR',
      receipt: `receipt_${Math.random().toString(36).substring(2)}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in DB
    const order = new Order({
      user: userId,
      products,
      basePrice: calculatedPrice,
      totalPrice,
      paymentStatus: 'Pending',
      razorpayOrderId: razorpayOrder.id,
      deliveryAddress,
    });
    for (const item of products) {
      const product = await Product.findById(item.product).session(session);
      product.stock -= item.quantity;
      await product.save({ session });
    }
    await order.save({ session });
    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ orderId: order._id, razorpayOrderId: razorpayOrder.id });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};



// Handle Payment Success
export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log("Verifying payment...");

  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new Error("Missing payment details");
    }

    const order = await Order.findOne({ razorpayOrderId }).session(session);
    if (!order) {
      throw new Error("Order not found");
    }

    // Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    // Compare signatures
    if (generatedSignature !== razorpaySignature) {
      console.error("Signature mismatch");
      order.paymentStatus = "Failed";
      await order.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update payment status
    order.paymentStatus = "Paid";
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    console.log("Payment verified successfully");
    res.status(200).json({ message: "Payment successful", order });
  } catch (error) {
    console.error("Error during payment verification:", error.message);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};



// Handle Payment Failure
export const paymentFailure = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { razorpayOrderId } = req.body;

    const order = await Order.findOne({ razorpayOrderId }).session(session);
    if (!order) {
      throw new Error('Order not found');
    }

    order.paymentStatus = 'Failed';
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Payment failed', order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};
