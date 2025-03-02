import Review from "../../models/reviewModel.js"

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      comment,
    });
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// Get all reviews for a specific product
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate("user", "fullName email");

    if (reviews.length === 0) {
      return res.status(404).json({ success: false, message: "No reviews found for this product" });
    }

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    await review.deleteOne();
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
