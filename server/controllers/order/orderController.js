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
    const { userId, products, totalPrice, deliveryAddress } = req.body;

    // User validation
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate deliveryAddress
    let orderDeliveryAddress;
    if (deliveryAddress && deliveryAddress.city && deliveryAddress.state && 
        deliveryAddress.homeNumber && deliveryAddress.pinCode) {
      // Use the address provided in the request
      orderDeliveryAddress = deliveryAddress;
      
      // Optionally update the user's saved address if it doesn't exist
      if (!user.addresses || user.addresses.length === 0) {
        await User.findByIdAndUpdate(userId, { addresses: [deliveryAddress] }, { session });
      }
    } else if (user.addresses && user.addresses.length > 0) {
      // Fallback to user's saved address
      orderDeliveryAddress = user.addresses[0];
    } else {
      throw new Error('Delivery address not provided and no saved address found');
    }

    // Calculate price and validate stock
    let calculatedPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.product).session(session);
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product?.name}`);
      }
      calculatedPrice += product.discountedPrice * item.quantity;
    }
    if (Math.abs(calculatedPrice - totalPrice) > 0.01) {
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
      deliveryAddress: orderDeliveryAddress,
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

    res.status(201).json({ 
      orderId: order._id, 
      razorpayOrderId: razorpayOrder.id,
      message: "Order created successfully"
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Order creation error:", error);
    res.status(500).json({ message: error.message });
  }
};



// Handle Payment Success
export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log("Verifying payment...");

  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, deliveryAddress } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new Error("Missing payment details");
    }

    const order = await Order.findOne({ razorpayOrderId }).session(session);
    if (!order) {
      throw new Error("Order not found");
    }

    // Check if payment was already processed
    if (order.paymentStatus === 'Paid') {
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({ message: "Payment already processed", order });
    }

    // Update delivery address if provided and not already set
    if (deliveryAddress && (!order.deliveryAddress || Object.keys(order.deliveryAddress).length === 0)) {
      order.deliveryAddress = deliveryAddress;
    }

    // Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    // Compare signatures
    if (generatedSignature !== razorpaySignature) {
      console.error("Signature mismatch", { 
        received: razorpaySignature,
        generated: generatedSignature
      });
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
    order.updatedAt = new Date();
    await order.save({ session });

    // Update user's address if it doesn't exist
    if (deliveryAddress && order.user) {
      const user = await User.findById(order.user);
      if (user && (!user.addresses || user.addresses.length === 0)) {
        await User.findByIdAndUpdate(order.user, 
          { addresses: [deliveryAddress] }, 
          { session }
        );
      }
    }

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
