import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  basePrice:
  {
    type: Number
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Cancelled'], default: 'Pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  deliveryAddress: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    homeNumber: { type: String, required: true },
    pinCode: { type: String, required: true },
    landmark: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
