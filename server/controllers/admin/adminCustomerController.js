import User from '../../models/userModel.js';
import Product from '../../models/ProductModel.js';
import Cart from '../../models/cartModel.js';
import Favorite from '../../models/favoritesModel.js';
import bcrypt from 'bcryptjs'

// Get all users (with filtering by role if needed)
export const getAllUsers = async (req, res) => {
   
    
    try {
        const { role } = req.query;
        let users;

        if (role) {
            users = await User.find({ accountType: role })
                .populate('products')   
        } else {
            users = await User.find()
                .populate('products')
        }

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get a single user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('products')
            if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};






// Update a user by ID
export const updateUser = async (req, res) => {
    try {
        const { phoneNumber, email, fullName, password, accountType, addresses, isActive } = req.body;

        // Find the user by ID
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update fields only if they are provided
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.email = email || user.email;
        user.fullName = fullName || user.fullName;

        // Only hash and update the password if it's provided
        if (password) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(password, saltRounds);
        }

        user.accountType = accountType || user.accountType;
        user.addresses = addresses || user.addresses;
        user.isActive = isActive !== undefined ? isActive : user.isActive;

        // Save the updated user to the database
        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // If the user is a vendor, delete all products created by the vendor
        if (user.accountType === 'Vendor') {
            await Product.deleteMany({ vendor: user._id });
        }

        // Delete the user's cart and wishlist
        await Cart.findByIdAndDelete(user.cart);
        await Favorite.findByIdAndDelete(user.wishlist);
        
        await user.deleteOne();
        res.json({ message: 'User and associated data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get total count of users and vendors
export const getUserAndVendorCount = async (req, res) => {
    try {
        const userCount = await User.countDocuments({ accountType: 'User' });
        const vendorCount = await User.countDocuments({ accountType: 'Vendor' });

        res.json({ userCount, vendorCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
