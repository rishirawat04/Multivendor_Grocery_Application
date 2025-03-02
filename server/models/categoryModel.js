import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    imageUrl: { type: String, required: true }, // Add imageUrl field
});



// Middleware to delete all products associated with the category before deletion

categorySchema.pre('deleteOne', {document: true, query:false }, async function(next) {
    const categoryId = this._id;
    await mongoose.model('Product').deleteMany({ category: categoryId });
    next();
})

const Category = mongoose.model('Category', categorySchema);

export default Category;
