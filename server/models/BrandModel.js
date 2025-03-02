import mongoose from "mongoose";

// Brand Schema
const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
    createdAt: { type: Date, default: Date.now },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Vendor reference
});

// Middleware to delete related products before brand deletion
brandSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const brandId = this._id;
    await mongoose.model('Product').deleteMany({ brand: brandId });
    next();
});

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
