import Product from "../../models/ProductModel.js";
import Category from "../../models/categoryModel.js";
import Subcategory from "../../models/subCategoryModel.js";

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Create regex for case-insensitive partial match
    const searchRegex = new RegExp(query.trim(), 'i');

    // Initialize search criteria
    const criteria = {
      $or: [
        { name: searchRegex }
      ]
    };

    // Fetch category and subcategory by name if specified
    const category = await Category.findOne({ name: searchRegex }).select('_id');
    const subcategory = await Subcategory.findOne({ name: searchRegex }).select('_id');

    // Add category and subcategory criteria if they are found
    if (category) {
      criteria.$or.push({ category: category._id });
    }
    if (subcategory) {
      criteria.$or.push({ subcategory: subcategory._id });
    }

    // Fetch matching products
    const products = await Product.find(criteria).populate('category subcategory');

    // Handle no products found case
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
