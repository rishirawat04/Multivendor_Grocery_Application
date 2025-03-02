
import Brand from "../../models/BrandModel.js";
import Product from "../../models/ProductModel.js";
import Category from "../../models/categoryModel.js";
import Subcategory from "../../models/subCategoryModel.js";
import User from "../../models/userModel.js";


// Create a new product (Admin and Vendor only)
export const createProduct = async (req, res) => {
    console.log(req.user._id);

    try {
        const { name, description, price, discountedPrice, categoryName, subcategoryName, image, stock, rating, numReviews, vendorShop, brand } = req.body;
      


        // Check if category exists by ID (sent from client)
        let category = await Category.findById(categoryName);  // categoryId received from client
        if (!category) {
            return res.status(400).json({ message: "Category not found" });
        }

        // Check if subcategory exists by ID and is associated with the given category
        let subcategory = await Subcategory.findById(subcategoryName );  // subcategoryId received from client
        if (!subcategory) {
            return res.status(400).json({ message: "Subcategory not found or not associated with the selected category" });
        }


        // Check if brand exists
        let brandObj = await Brand.findById(brand);
        if (!brandObj) {
            return res.status(400).json({ message: "Brand not found" });
        }



        // Create product with ObjectId references
        const product = new Product({
            name,
            description,
            price,
            discountedPrice,
            category: category._id, // Use ObjectId of the category
            subcategory: subcategory._id, // Use ObjectId of the subcategory
            vendor: req.user._id,
            image,
            stock,
            rating,
            numReviews,
            vendorShop,
            brand: brandObj._id
        });

        // console.log(product);
        
        await product.save();

        // update vendors product list 

        await User.findByIdAndUpdate(req.user._id, {
            $push: { products: product._id}
        })

        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a product (Admin and Vendor only)
export const updateProduct = async (req, res) => {



    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Check if the user is a vendor and if they own the product
        if (req.user.accountType === 'Vendor' && product.vendor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Update the product
        Object.assign(product, req.body);
        await product.save();

        res.json({ message: "Product updated successfully", product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a product (Admin and Vendor only)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Check if the user is a vendor and if they own the product
        if (req.user.accountType === 'Vendor' && product.vendor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        await product.deleteOne();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all products (Public)
export const getAllProducts = async (req, res) => {
   


    try {
        const products = await Product.find().populate('category').populate('subcategory');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single product (Public)
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category').populate('subcategory').populate('brand');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get products by category (Public)
export const getProductsByCategory = async (req, res) => {


    const { categoryId } = req.params; // Get categoryId from request parameters
    try {
        const products = await Product.find({ category: categoryId }).populate('category').populate('subcategory'); // Find products by category
        res.json(products); // Return the products found
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



























//     try {
//         const { name, description, price, discountedPrice, categoryId, subcategoryId, image, stock, rating, numReviews } = req.body;

//         const product = new Product({
//             name,
//             description,
//             price,
//             discountedPrice,
//             category: categoryId,
//             subcategory: subcategoryId,
//             image,
//             stock,
//             rating,
//             numReviews,
//         });

//         await product.save();
//         res.status(201).json(product);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// export const getProductsByCategoryAndSubcategory = async (req, res) => {
//     try {
//         const { categoryId, subcategoryId } = req.params;
//         const products = await Product.find({
//             category: categoryId,
//             subcategory: subcategoryId
//         });
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// other product controllers (update, delete, etc.) remain similar to previous examples

