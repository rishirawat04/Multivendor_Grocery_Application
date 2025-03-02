import Review from "../../models/reviewModel.js";

// Get all reviews with user data
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user", "name email");
    const totalReviews = await Review.countDocuments()
    res.status(200).json({ success: true, reviews, totalReviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a review (Admin)
export const adminUpdateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    const { rating, comment } = req.body;
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();
    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review (Admin)
export const adminDeleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    await review.deleteOne();
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
