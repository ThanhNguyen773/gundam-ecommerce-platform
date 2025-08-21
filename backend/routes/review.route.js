import express from "express";
import {
  createReview,
  deleteReply,
  deleteReview,
  editReplyReview,
  getAllReviews,
  getAllReviewsByProduct,
  getReviewsByProduct,
  replyReview,
  toggleReviewVisibility,
  updateReview,
} from "../controllers/review.controller.js";
import { protectRoute, staffRoute } from "../middleware/auth.middleware.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = express.Router();


router.get("/", getAllReviews);


// router.get("/product/:productId", getReviewsByProduct);
router.get("/product/:productId", optionalAuth, getReviewsByProduct);

router.get("/product/:productId/all", protectRoute, staffRoute, getAllReviewsByProduct);

router.post("/", protectRoute, createReview);
router.patch("/:id", protectRoute, updateReview);
router.delete("/:id", protectRoute, deleteReview);

router.post("/:id/reply", protectRoute, staffRoute, replyReview);
router.patch("/:id/reply", protectRoute, staffRoute, editReplyReview);
router.put("/:id/reply/delete", protectRoute, deleteReply);

router.patch("/:id/visibility", protectRoute, staffRoute, toggleReviewVisibility);

export default router;