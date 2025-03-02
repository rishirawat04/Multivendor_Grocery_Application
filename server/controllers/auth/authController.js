import User from "../../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
  try {
    const { phoneNumber, email, fullName, password, accountType, shopName, shopLogo } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    // Create the new user object
    user = new User({
      fullName,
      phoneNumber,
      email,
      password,
      accountType,
      ...(accountType === 'Vendor' && { shopName, shopLogo }), // Only include shop info if the user is a Vendor
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Create a JWT payload and sign the token
    const payload = { id: user._id.toString() };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure to true in production
      maxAge: 3600000, // 1 hour
      sameSite: 'strict', // CSRF protection
    });

    // Return success response
    res.status(201).json({
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        fullName: user.fullName,
        accountType: user.accountType,
        shopName: accountType === 'Vendor' ? shopName : null,
        shopLogo: accountType === 'Vendor' ? shopLogo : null,
        message: "Registration successful!",
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


export const loginUser = async (req, res) => {
  const { email, password,  rememberMe } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { 
      id: user._id.toString(), 
      accountType:user.accountType,

     };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set token in an HTTP-only cookie
    const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 3600000; 
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: maxAge, 
      sameSite: 'none',
    });

    res.json({
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        fullName: user.fullName,
        accountType: user.accountType,
        createdAt: user.registrationDate
      },
      message: "Login successful!" // Added message
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};







// Controller to update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from params
    const {
      fullName,
      email,
      phoneNumber,
      userProfile,
      city,
      state,
      homeNumber,
      pinCode,
      landmark,
      shopName,
      shopLogo
    } = req.body; // Extract all fields from req.body

    // Construct the updated address object
    const updatedAddress = {
      city,
      state,
      homeNumber,
      pinCode,
      landmark,
    };

    // Build the update object dynamically
    const updateFields = {
      fullName,
      email,
      phoneNumber,
      userProfile, // User profile (profile picture URL)
      addresses: [updatedAddress], // Update address array
    };

    // Add vendor-specific fields only if provided and user is a Vendor
    if (req.body.shopName) updateFields.shopName = shopName;
    if (req.body.shopLogo) updateFields.shopLogo = shopLogo;

    // Find and update the user by ID, and return the new updated document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, fields: 'userProfile, fullName email phoneNumber userProfile addresses shopName shopLogo ' } // Return only required fields
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      user: updatedUser,
      message: "Profile updated successfully!" // Success message
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// get User details 
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID and populate the orders field with products
    const user = await User.findById(userId)
      .select('fullName email phoneNumber accountType addresses createdAt  shopName shopLogo') // Select relevant user fields
      .populate({
        path: 'orders', // Populate the orders field in User
        populate: {
          path: 'products.product', // Populate the product field inside each order's products
          select: 'name price image', // Select only necessary fields from Product
        },
        select: 'products totalPrice paymentStatus deliveryAddress createdAt', // Select fields from Order model
      });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      user,
      message: "User details retrieved successfully!"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Logout Controller
export const logoutUser = async (req, res) => {
  try {
    // Clear the token from cookies
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      expires: new Date(0), // Immediately expire the cookie
      sameSite: 'strict',
    });

    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

