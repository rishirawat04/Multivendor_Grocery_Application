import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  couponCode: { type: String, required: true, unique: true },
  description: { type: String },
  discountPercentage: { type: Number, required: true },
  maxDiscountAmount: { type: Number }, // Limit on discount amount
  minPurchaseAmount: { type: Number }, // Not required if it's for a specific product
  usageLimit: { type: Number, default: 100 }, // How many times the coupon can be used
  applyCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
  applySubCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: false },
  applyProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  neverExpired: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
});

const Discount = mongoose.model('Discount', discountSchema);
export default Discount;
