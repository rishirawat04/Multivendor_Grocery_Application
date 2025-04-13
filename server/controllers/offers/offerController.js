import Offer from "../../models/OfferModel.js";
import Product from "../../models/ProductModel.js";
import mongoose from "mongoose";

// Create a new offer (Admin only)
export const createOffer = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      image, 
      discountPercentage, 
      products, 
      startDate, 
      endDate, 
      offerType 
    } = req.body;

    // Validate products exist
    if (products && products.length > 0) {
      const productIds = products.map(id => mongoose.Types.ObjectId.isValid(id) ? mongoose.Types.ObjectId(id) : null).filter(id => id);
      
      const existingProducts = await Product.find({ 
        _id: { $in: productIds } 
      });
      
      if (existingProducts.length !== productIds.length) {
        return res.status(400).json({ message: "One or more product IDs are invalid" });
      }
    }

    // Create the offer
    const offer = new Offer({
      title,
      description,
      image,
      discountPercentage,
      products: products || [],
      startDate: startDate || new Date(),
      endDate,
      offerType: offerType || 'special',
      createdBy: req.user._id
    });

    await offer.save();
    res.status(201).json({ 
      message: "Offer created successfully", 
      offer 
    });
  } catch (error) {
    console.error("Create offer error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get all offers with pagination and filters
export const getAllOffers = async (req, res) => {
  try {
    const { page = 1, limit = 10, offerType, isActive } = req.query;
    
    // Build filter object
    const filter = {};
    if (offerType) filter.offerType = offerType;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Count total documents for pagination
    const total = await Offer.countDocuments(filter);
    
    // Fetch paginated offers
    const offers = await Offer.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('products', 'name price discountedPrice image');

    res.json({
      offers,
      totalPages: Math.ceil(total / limit),
      currentPage: page * 1,
      total
    });
  } catch (error) {
    console.error("Get offers error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single offer by ID
export const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('products', 'name price discountedPrice image category subcategory');
    
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    
    res.json(offer);
  } catch (error) {
    console.error("Get offer error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update an offer (Admin only)
export const updateOffer = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      image, 
      discountPercentage, 
      products, 
      startDate, 
      endDate, 
      isActive,
      offerType
    } = req.body;

    // Find the offer
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Validate products if provided
    if (products && products.length > 0) {
      const productIds = products.map(id => mongoose.Types.ObjectId.isValid(id) ? mongoose.Types.ObjectId(id) : null).filter(id => id);
      
      const existingProducts = await Product.find({ 
        _id: { $in: productIds } 
      });
      
      if (existingProducts.length !== productIds.length) {
        return res.status(400).json({ message: "One or more product IDs are invalid" });
      }
    }

    // Update offer fields
    if (title !== undefined) offer.title = title;
    if (description !== undefined) offer.description = description;
    if (image !== undefined) offer.image = image;
    if (discountPercentage !== undefined) offer.discountPercentage = discountPercentage;
    if (products !== undefined) offer.products = products;
    if (startDate !== undefined) offer.startDate = startDate;
    if (endDate !== undefined) offer.endDate = endDate;
    if (isActive !== undefined) offer.isActive = isActive;
    if (offerType !== undefined) offer.offerType = offerType;
    
    // Save updated offer
    await offer.save();
    
    res.json({ 
      message: "Offer updated successfully", 
      offer 
    });
  } catch (error) {
    console.error("Update offer error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete an offer (Admin only)
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    await offer.deleteOne();
    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Delete offer error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get active special offers (Public)
export const getActiveSpecialOffers = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const offers = await Offer.find({
      offerType: 'special',
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    })
    .populate('products', 'name price discountedPrice image category subcategory')
    .sort({ createdAt: -1 });
    
    res.json(offers);
  } catch (error) {
    console.error("Get active offers error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get active deals of the day (Public)
export const getActiveDealsOfTheDay = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const offers = await Offer.find({
      offerType: 'daily',
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    })
    .populate('products', 'name price discountedPrice image category subcategory')
    .sort({ createdAt: -1 });
    
    res.json(offers);
  } catch (error) {
    console.error("Get deals of the day error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new deal of the day offer (Admin only)
export const createDealOffer = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      image, 
      discountPercentage, 
      products, 
      startDate, 
      endDate 
    } = req.body;

    // Validate required fields
    if (!title || !description || !image || !discountPercentage || !products || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure products array has valid product IDs
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "At least one product is required" });
    }

    // Verify all products exist
    const productIds = products;
    const existingProducts = await Product.find({ _id: { $in: productIds } });
    
    if (existingProducts.length !== productIds.length) {
      return res.status(400).json({ message: "One or more products do not exist" });
    }

    // Create new offer with deal of the day type
    const newOffer = new Offer({
      title,
      description,
      image,
      discountPercentage,
      products: productIds,
      startDate: startDate || new Date(),
      endDate,
      offerType: 'daily',
      createdBy: req.user._id,
    });

    await newOffer.save();

    res.status(201).json({ 
      success: true, 
      message: "Deal of the day created successfully", 
      offer: newOffer 
    });
  } catch (error) {
    console.error("Error creating deal offer:", error);
    res.status(500).json({ message: "Failed to create deal offer", error: error.message });
  }
};

// Get all active deals of the day
export const getActiveDeals = async (req, res) => {
  try {
    const currentTime = new Date();
    
    // Find all active deals that haven't expired
    const activeDeals = await Offer.find({
      offerType: 'daily',
      isActive: true,
      startDate: { $lte: currentTime },
      endDate: { $gt: currentTime }
    }).populate({
      path: 'products',
      select: 'name description price discountedPrice image stock rating numReviews'
    });

    res.status(200).json({ 
      success: true, 
      count: activeDeals.length,
      deals: activeDeals 
    });
  } catch (error) {
    console.error("Error fetching active deals:", error);
    res.status(500).json({ message: "Failed to fetch active deals", error: error.message });
  }
};

// Get all deals (including expired and inactive) for admin dashboard
export const getAllDeals = async (req, res) => {
  try {
    const deals = await Offer.find({ offerType: 'daily' })
      .populate({
        path: 'products',
        select: 'name price discountedPrice image'
      })
      .populate({
        path: 'createdBy',
        select: 'fullName email'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: deals.length,
      deals 
    });
  } catch (error) {
    console.error("Error fetching all deals:", error);
    res.status(500).json({ message: "Failed to fetch deals", error: error.message });
  }
};

// Update a deal of the day
export const updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      image, 
      discountPercentage, 
      products, 
      startDate, 
      endDate,
      isActive 
    } = req.body;

    // Find the deal
    const deal = await Offer.findById(id);
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    // If products array is provided, verify all products exist
    if (products && Array.isArray(products) && products.length > 0) {
      const existingProducts = await Product.find({ _id: { $in: products } });
      if (existingProducts.length !== products.length) {
        return res.status(400).json({ message: "One or more products do not exist" });
      }
      deal.products = products;
    }

    // Update fields if provided
    if (title) deal.title = title;
    if (description) deal.description = description;
    if (image) deal.image = image;
    if (discountPercentage) deal.discountPercentage = discountPercentage;
    if (startDate) deal.startDate = startDate;
    if (endDate) deal.endDate = endDate;
    if (isActive !== undefined) deal.isActive = isActive;

    // Save updated deal
    await deal.save();

    res.status(200).json({ 
      success: true, 
      message: "Deal updated successfully", 
      deal 
    });
  } catch (error) {
    console.error("Error updating deal:", error);
    res.status(500).json({ message: "Failed to update deal", error: error.message });
  }
};

// Delete a deal of the day
export const deleteDeal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Offer.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ message: "Deal not found" });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Deal deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting deal:", error);
    res.status(500).json({ message: "Failed to delete deal", error: error.message });
  }
}; 