import Cart from "../../models/cartModel.js";
import User from "../../models/userModel.js";



// Add product to cart
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
      // Ensure req.user is defined
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user._id;

    //console.log("userID",userId);
    
   
    

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
           
            
            cart = new Cart({ user: userId, products: [] });
                // Associate the new cart with the user
                await User.findByIdAndUpdate(userId, {
                    $push: { cart: cart._id },
                });
        }

        const productExists = cart.products.find(p => p.product.toString() === productId);

        if (productExists) {
            productExists.quantity += quantity;
            await cart.save();
          
            return res.status(200).json({
                message: 'Product quantity updated in cart',
                cart,
            });
        } else {
            cart.products.push({ product: productId, quantity });
            await cart.save();
            return res.status(200).json({
                message: 'Product added to cart',
                cart,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add product to cart' });
    }
};

// Get user's cart
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve cart' });
    }
};


// Remove product from cart
export const removeFromCart = async (req, res) => {
    const { productId } = req.body; // Get the productId from the request body
    // Ensure req.user is defined
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user._id;

    try {
        // Find the cart for the user
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the index of the product to be removed
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);
        
        // Save the updated cart
        await cart.save();

        return res.status(200).json({
            message: 'Product removed from cart',
            cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to remove product from cart' });
    }
};
