import Cart from "../../models/cartModel.js"
import Discount from "../../models/discountModel.js"
import Product from "../../models/ProductModel.js";







export const createDiscount = async (req, res) => {
  try {
    const {
      couponCode,
      description,
      discountPercentage,
      maxDiscountAmount,
      minPurchaseAmount,
      usageLimit,
      applyCategory,
      applySubCategory,
      applyProduct,
      startDate,
      endDate,
      neverExpired
    } = req.body;

    const vendorId = req.user._id; 

   // console.log("id", applyProduct);
    

      // Find the product by ID
      const product = await Product.findById(applyProduct);
      
      console.log("run0");

      // Check if the product belongs to the vendor
      if (!product || product.vendor.toString() !== vendorId.toString()) {
        return res.status(403).json({ error: 'You are not authorized to create a discount for this product.' });
      }
      console.log("run1");
    // Check if the coupon code already exists
    const existingDiscount = await Discount.findOne({ couponCode });
    if (existingDiscount) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }

    // If the user is an Admin, they can apply the discount to any product
    if (req.user.accountType === 'Admin') {
      console.log("run2");
      
      const newDiscount = new Discount({
        couponCode,
        description,
        discountPercentage,
        maxDiscountAmount,
        minPurchaseAmount: applyProduct ? 0 : minPurchaseAmount, // Only set minPurchaseAmount if it's not for a specific product
        usageLimit,
        applyCategory,
        applySubCategory,
        applyProduct,
        startDate,
        endDate: neverExpired ? null : endDate,
        neverExpired
      });

      console.log("data",newDiscount);
      

      await newDiscount.save();
      return res.status(201).json({ message: 'Discount created successfully', newDiscount });
    }
    console.log("run3");

    // If the user is a Vendor, they can only apply the discount to their own products
    if (req.user.accountType === 'Vendor') {
    //  console.log(req.user.accountType);
      
   
      

      const newDiscount = new Discount({
        couponCode,
        description,
        discountPercentage,
        maxDiscountAmount,
        minPurchaseAmount: applyProduct ? null : minPurchaseAmount, // Only set minPurchaseAmount if it's not for a specific product
        usageLimit,
        applyCategory,
        applySubCategory,
        applyProduct,
        startDate,
        endDate: neverExpired ? null : endDate,
        neverExpired,
        vendor: vendorId,
      });

      await newDiscount.save();
      return res.status(201).json({ message: 'Discount created successfully', newDiscount });
    }

    // If the user has neither Admin nor Vendor role
    return res.status(403).json({ error: 'You are not authorized to create discounts' });

  } catch (error) {
    res.status(500).json({ message: 'Failed to create discount', error });
  }
};


// Apply coupon and calculate discount
export const applyCoupon = async (req, res) => {
    try {
      const { couponCode, cartItems } = req.body; // Expect cartItems to be sent from frontend
  
      // Find the discount by coupon code
      const discount = await Discount.findOne({ couponCode });
  
      if (!discount) {
        return res.status(404).json({ message: 'Coupon code not found' });
      }
  
      // Check if the coupon is expired
      const currentDate = new Date();
      if (discount.neverExpired === false && discount.endDate && discount.endDate < currentDate) {
        return res.status(400).json({ message: 'Coupon code has expired' });
      }
  
      // Check coupon usage limit
      if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
        return res.status(400).json({ message: 'Coupon usage limit has been reached' });
      }
  
      // Calculate the total price of the cart
      const totalCartAmount = cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
  
      // Check if the coupon applies to the specific product, category, subcategory, or meets the minimum purchase amount
      let isApplicable = false;
      if (discount.applyProduct) {
        isApplicable = cartItems.some(item => item.product._id.toString() === discount.applyProduct.toString());
      } else if (discount.applyCategory) {
        isApplicable = cartItems.some(item => item.product.category.toString() === discount.applyCategory.toString());
      } else if (discount.applySubCategory) {
        isApplicable = cartItems.some(item => item.product.subcategory.toString() === discount.applySubCategory.toString());
      } else if (discount.minPurchaseAmount) {
        isApplicable = totalCartAmount >= discount.minPurchaseAmount;
      }
  
      if (!isApplicable) {
        return res.status(400).json({ message: 'Coupon not applicable to the current cart' });
      }
  
      // Calculate discount amount
      const discountAmount = Math.min(
        (totalCartAmount * discount.discountPercentage) / 100,
        discount.maxDiscountAmount || Infinity
      );
  
      // Increment coupon usage count (if applicable)
      discount.usedCount += 1;
      await discount.save();
  
      res.status(200).json({ discount: discountAmount, message: 'Coupon applied successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to apply coupon', error });
    }
  };


  // Update the coupon code
export const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const existingDiscount = await Discount.findById(id);
    if (!existingDiscount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    // Prevent updating to a duplicate coupon code
    if (updatedData.couponCode) {
      const duplicateCoupon = await Discount.findOne({ couponCode: updatedData.couponCode });
      if (duplicateCoupon && duplicateCoupon._id.toString() !== id) {
        return res.status(400).json({ error: 'Coupon code already exists' });
      }
    }

    // Update fields only if they are present in updatedData
    Object.keys(updatedData).forEach((key) => {
      existingDiscount[key] = updatedData[key];
    });

    await existingDiscount.save();

    res.status(200).json({ message: 'Discount updated successfully', discount: existingDiscount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating discount' });
  }
};


// Delete the coupon code
export const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    await discount.remove();

    res.status(200).json({ message: 'Discount deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting discount' });
  }
};


// Get all discounts
export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.status(200).json(discounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving discounts' });
  }
};







