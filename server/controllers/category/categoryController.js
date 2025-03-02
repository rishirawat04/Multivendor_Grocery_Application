import Category from "../../models/categoryModel.js";

// Create a new category (Admin only)
export const createCategory = async (req, res) => {
    try {
        const { name, imageUrl } = req.body; // Extract imageUrl from request body

        const categoryExists = await Category.findOne({ name: name.trim().toLowerCase() });
        if (categoryExists) {
            return res.status(400).json({ message: "Category already exists" });
        }

        // Create the category with name and imageUrl
        const category = new Category({
            name: name.trim().toLowerCase(),
            imageUrl: imageUrl.trim() // Store the image URL
        });
        
        await category.save();
        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Get all categories with subcategory data and product count
export const getAllCategories = async (req, res) => {
    try {
        const categoriesWithSubcategoryAndProductCount = await Category.aggregate([
            {
                $lookup: {
                    from: 'subcategories', // Subcategory collection name
                    localField: '_id', // Field in Category model
                    foreignField: 'category', // Field in Subcategory model referencing Category
                    as: 'subcategories' // The array field for subcategories
                }
            },
            {
                $lookup: {
                    from: 'products', // Product collection name
                    localField: '_id', // Field in Category model
                    foreignField: 'category', // Field in Product model referencing Category
                    as: 'products' // The array field for products
                }
            },
            {
                $unwind: {
                    path: '$subcategories',
                    preserveNullAndEmptyArrays: true // Keep categories even if they have no subcategories
                }
            },
            {
                $lookup: {
                    from: 'products', // Product collection name
                    localField: 'subcategories._id', // Field in Subcategory model
                    foreignField: 'subcategory', // Field in Product model referencing Subcategory
                    as: 'subcategoryProducts' // The array field for products in each subcategory
                }
            },
            {
                $addFields: {
                    subcategoryProductCount: { 
                        $cond: { 
                            if: { $isArray: '$subcategoryProducts' }, 
                            then: { $size: '$subcategoryProducts' }, 
                            else: 0 
                        }
                    }
                }
            },
            {
                $sort: {
                    'subcategoryProducts.createdAt': -1 // Sort by createdAt in descending order
                }
            },
            {
                $group: {
                    _id: '$_id', // Group by category ID
                    name: { $first: '$name' }, // Include category name
                    imageUrl: { $first: '$imageUrl' }, // Include category image URL
                    subcategoryCount: { $sum: 1 }, // Count of subcategories
                    productCount: { $sum: '$subcategoryProductCount' }, // Count of all products in subcategories
                    subcategories: { $push: { // Collect subcategory details
                        _id: '$subcategories._id',
                        name: '$subcategories.name',
                        productCount: '$subcategoryProductCount' // Count products in each subcategory
                    }}
                }
            }
        ]);

        res.json(categoriesWithSubcategoryAndProductCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Delete a category (Admin only)
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        await category.deleteOne();
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a category (Admin only)
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        // Update name and imageUrl if they are provided
        if (req.body.name) {
            category.name = req.body.name.trim().toLowerCase();
        }
        if (req.body.imageUrl) {
            category.imageUrl = req.body.imageUrl.trim(); // Update the image URL
        }

        await category.save();
        res.json({ message: "Category updated successfully", category });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



