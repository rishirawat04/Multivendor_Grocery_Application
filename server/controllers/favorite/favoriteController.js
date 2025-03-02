import Favorite from "../../models/favoritesModel.js";
import User from "../../models/userModel.js";

// Add product to favorites
export const addToFavorites = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    let favorite = await Favorite.findOne({ user: userId });

    if (!favorite) {
      favorite = new Favorite({ user: userId, products: [] });
      // Associate the new favorite with the user
      await User.findByIdAndUpdate(userId, {
        $push: { wishlist: favorite._id },
      });
    }

    if (favorite.products.includes(productId)) {
      return res.status(400).json({ message: 'Product already in favorites' });
    }

    favorite.products.push(productId);

    await favorite.save();
    res.status(200).json({ 
      message: 'Product added to favorites', // Message sent to frontend
      favorite // Returning the updated favorites list
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add product to favorites' });
  }
};


// Get user's favorites
export const getFavorites = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user._id }).populate('products');
    if (!favorite) {
      return res.status(404).json({ message: 'Favorites not found' });
    }
    res.status(200).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve favorites' });
  }
};
