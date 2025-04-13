import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  discountPercentage: { 
    type: Number, 
    required: true,
    min: 1,
    max: 100 
  },
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product'
  }],
  startDate: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  offerType: {
    type: String,
    enum: ['special', 'daily'],
    default: 'special'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware to update the updatedAt field before saving
offerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Offer = mongoose.model('Offer', offerSchema);

export default Offer; 