import Subcategory from "../../models/subCategoryModel.js";


// Create a new subcategory (Admin only)
export const createSubcategory = async (req, res) => {
    try {
        const { name, category } = req.body;

        const subcategoryExists = await Subcategory.findOne({ name: name.trim().toLowerCase() });
        if (subcategoryExists) {
            return res.status(400).json({ message: "Subcategory already exists" });
        }

        const subcategory = new Subcategory({
            name: name.trim().toLowerCase(),
            category
        });

        await subcategory.save();
        res.status(201).json({ message: "Subcategory created successfully", subcategory });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all subcategories
export const getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('category');
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a subcategory (Admin only)
export const updateSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });

        subcategory.name = req.body.name.trim().toLowerCase();
        await subcategory.save();
        res.json({ message: "Subcategory updated successfully", subcategory });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a subcategory (Admin only)
export const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });

        await subcategory.deleteOne();
        res.json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get subcategories by category ID
export const getSubcategoriesByCategoryId = async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      // Find subcategories that belong to the given category ID
      const subcategories = await Subcategory.find({ category: categoryId });
  
      if (!subcategories || subcategories.length === 0) {
        return res.status(404).json({ message: 'No subcategories found for this category' });
      }
  
      res.status(200).json(subcategories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
