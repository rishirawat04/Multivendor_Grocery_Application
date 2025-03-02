import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
},  { collection: 'subcategories' }); // Specify the collection name);

// Middleware to delete all products associated with the subcategory before deletion
subcategorySchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const subcategoryId = this._id;
    await mongoose.model('Product').deleteMany({ subcategory: subcategoryId });
    next();
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

export default Subcategory;
