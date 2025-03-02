import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: [{
        type: String,
        required: true
    }],
    stock: {
        type: Number,
        default: 0,
    },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    vendorShop: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

export default Product;

