import Review from "../models/review.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user", "name avatar");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error getting reviews" });
  }
};

export const getAllReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate("user", "name avatar")
      .populate("order", "orderCode")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error getting All reviews" });
  }
};

// export const getReviewsByProduct = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     // const reviews = await Review.find({ product: productId })
//     const reviews = await Review.find({ product: productId, isHidden: false })
//       .populate("user", "name avatar")
//       .populate("order", "orderCode") // 🟢 Thêm dòng này
//       .sort({ createdAt: -1 });
//     res.status(200).json(reviews);
//   } catch (error) {
//     res.status(500).json({ error: "Lỗi lấy đánh giá theo sản phẩm" });
//   }
// };

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    let filter = { product: productId };

    
    if (req.user) {
      const userId = req.user._id;
      filter.$or = [
        { isHidden: false },
        { user: userId }, // chính họ
      ];
    } else {
     
      filter.isHidden = false;
    }

    const reviews = await Review.find(filter)
      .populate("user", "name avatar")
      .populate("order", "orderCode")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error getting rating by product" });
  }
};

export const createReview = async (req, res) => {
  try {
    const { product, order, rating, comment } = req.body;
    const user = req.user._id;

   
    const hasPurchased = await Order.findOne({
      _id: order,
      user,
      status: "Delivered",
      "products.product": product,
    });

    if (!hasPurchased) {
      return res
        .status(403)
        .json({ error: "You have not purchased this product in this order" });
    }

    
    const existingReview = await Review.findOne({ user, product, order });
    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already review this product in this order" });
    }

    const review = new Review({ product, user, order, rating, comment });
    await review.save();

    await updateProductRating(product);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: "Unable to create review" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user = req.user._id;

    const review = await Review.findOneAndUpdate(
      { _id: id, user },
      { rating, comment },
      { new: true }
    );

    if (!review)
      return res
        .status(404)
        .json({
          error: "Not found or you do not have permission to edit this review",
        });
    await updateProductRating(review.product); 
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: "Error updating review" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user._id;

    const review = await Review.findOneAndDelete({ _id: id, user });
    if (!review)
      return res.status(404).json({ error: "No reviews found" });
    await updateProductRating(review.product);
    res.status(200).json({ message: "Review removed" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting review" });
  }
};

export const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId, isHidden: false });

  const ratingCount = reviews.length;
  const averageRating = ratingCount
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
    : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Number(averageRating.toFixed(1)),
    ratingCount,
  });
};

export const toggleReviewVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isHidden } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { isHidden },
      { new: true }
    ).populate("user", "name avatar");

    if (!review) {
      return res.status(404).json({ error: "No reviews found" });
    }
    await updateProductRating(review.product); 
    res
      .status(200)
      .json({
        message: `Reviews have been ${isHidden ? "hidden" : "displayed"}`,
        review,
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to update review display status" });
  }
};

export const replyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const staffId = req.user._id;

    const review = await Review.findById(id).populate("user", "name avatar");
    if (!review)
      return res.status(404).json({ error: "No reviews found" });

    review.reply = {
      content,
      repliedAt: new Date(),
      staff: staffId,
    };

    await review.save();
    const populatedReview = await Review.findById(id)
      .populate("user", "name avatar")
      .populate("reply.staff", "name avatar");

    res
      .status(200)
      .json({ message: "Responded to review", review: populatedReview });
  } catch (error) {
    res.status(500).json({ error: "Unable to reply to reviews" });
  }
};

export const editReplyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const staffId = req.user._id;

    const review = await Review.findById(id);

    if (!review || !review.reply) {
      return res.status(404).json({ error: "No response to edit" });
    }

    review.reply.content = content;
    review.reply.repliedAt = new Date();
    review.reply.staff = staffId; 

    await review.save();

    res.status(200).json({ message: "Updated response", review });
  } catch (error) {
    res.status(500).json({ error: "Unable to update feedback" });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.reply = undefined;
    await review.save();

    res.status(200).json({ message: "Reply deleted", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete reply", error });
  }
};
