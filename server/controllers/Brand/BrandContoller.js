import Brand from "../../models/BrandModel.js";


export const createBrand = async (req, res) => {
    try {
        const { name, isFeatured, status, vendorId } = req.body;
        
        const newBrand = new Brand({
            name,
            isFeatured,
            status,
            vendor: vendorId
        });

        await newBrand.save();
        res.status(201).json({ message: 'Brand created successfully', newBrand });
    } catch (error) {
        res.status(500).json({ error });
    }
};


export const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find().populate('vendor');
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching brands' });
    }
};


export const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        Object.assign(brand, updatedData);
        await brand.save();
        
        res.status(200).json({ message: 'Brand updated successfully', brand });
    } catch (error) {
        res.status(500).json({ error: 'Error updating brand' });
    }
};


export const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        await brand.deleteOne();
        res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting brand' });
    }
};
