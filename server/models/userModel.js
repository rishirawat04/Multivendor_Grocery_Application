import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userProfile: { type: String },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    accountType: { type: String, enum: ['Admin', 'Vendor', 'User'], default: 'User' },
    shopName: { type: String },
    shopLogo: { type: String },
    token: { type: String },
    registrationDate: { type: Date, default: Date.now },
    addresses: [{
        city: { type: String, },
        state: { type: String, },
        homeNumber: { type: String, },
        pinCode: { type: String, },
        landmark: { type: String },
    }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favorite' }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },

});


const User = mongoose.model('User', UserSchema)
export default User
