import Category from "../../models/categoryModel.js";
import Product from "../../models/ProductModel.js";
import Subcategory from "../../models/subCategoryModel.js";

// Get products by category name or subcategory name
export const getProductsByCategoryAndSubcategory = async (req, res) => {
    try {
        const { categoryName, subCategoryName } = req.query;

        if (!categoryName && !subCategoryName) {
            return res.status(400).json({ message: 'Please provide a category or subcategory name' });
        }

        let query = {};

        // Fetch by category name
        if (categoryName) {
            const category = await Category.findOne({ name: categoryName.trim().toLowerCase() });
            if (category) {
                query.category = category._id;
            } else {
                return res.status(404).json({ message: 'Category not found' });
            }
        }

        // Fetch by subcategory name
        if (subCategoryName) {
            const subcategory = await Subcategory.findOne({ name: subCategoryName.trim().toLowerCase() });
            if (subcategory) {
                query.subcategory = subcategory._id;
            } else {
                return res.status(404).json({ message: 'Subcategory not found' });
            }
        }

        const products = await Product.find(query).populate('category').populate('subcategory');

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for the given category or subcategory' });
        }

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
