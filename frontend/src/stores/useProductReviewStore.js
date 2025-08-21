import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useProductReviewStore = create((set) => ({
  productReviews: {}, 
  loading: false,


  fetchProductReviews: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/reviews/product/${productId}`);
      set((state) => ({
        productReviews: {
          ...state.productReviews,
          [productId]: res.data, 
        },
        loading: false,
      }));
    } catch (err) {
      console.error("Fetch review error:", err);
      toast.error("Unable to load product review");
      set({ loading: false });
    }
  },

  fetchAllReviewsByProductId: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/reviews/product/${productId}/all`);
      set((state) => ({
        productReviews: {
          ...state.productReviews,
          [productId]: res.data,
        },
        loading: false,
      }));
    } catch (err) {
      console.error("Fetch all reviews error:", err);
      toast.error("Unable to load all reviews");
      set({ loading: false });
    }
  },

 
  toggleReviewVisibility: async (productId, reviewId, isHidden) => {
    try {
      await axios.patch(`/reviews/${reviewId}/visibility`, { isHidden });
      set((state) => ({
        productReviews: {
          ...state.productReviews,
          [productId]: state.productReviews[productId]?.map((review) =>
            review._id === reviewId ? { ...review, isHidden } : review
          ),
        },
      }));
      toast.success("Updated review display");
    } catch (err) {
      console.error("Toggle visibility error:", err);
      toast.error("Unable to update review status");
    }
  },


  replyToReview: async (productId, reviewId, content) => {
    if (!reviewId || !content) return toast.error("Missing feedback data");
    try {
      const res = await axios.post(`/reviews/${reviewId}/reply`, { content });
      const updatedReview = res.data.review;
      set((state) => ({
        productReviews: {
          ...state.productReviews,
          [productId]: state.productReviews[productId]?.map((review) =>
            review._id === reviewId ? updatedReview : review
          ),
        },
      }));
      toast.success("Responded to review");
    } catch (err) {
      console.error("Reply error:", err.response || err);
      toast.error("Unable to respond to reviews");
    }
  },

  editReplyToReview: async (productId, reviewId, content) => {
    if (!reviewId || !content) return toast.error("Missing editing content");
    try {
      const res = await axios.patch(`/reviews/${reviewId}/reply`, { content });
      const updatedReview = res.data.review;
      set((state) => ({
        productReviews: {
          ...state.productReviews,
          [productId]: state.productReviews[productId]?.map((review) =>
            review._id === reviewId ? updatedReview : review
          ),
        },
      }));
      toast.success("Edited reply");
    } catch (err) {
      console.error("Edit reply error:", err.response || err);
      toast.error("Cannot edit reply");
    }
  },

  deleteReply: async (productId, reviewId) => {
    try {
      const res = await axios.put(`/reviews/${reviewId}/reply/delete`);
      const updatedReview = res.data.review;

      set((state) => ({
        productReviews: {
          ...state.productReviews,
          [productId]: state.productReviews[productId]?.map((r) =>
            r._id === reviewId ? updatedReview : r
          ),
        },
      }));

      toast.success("Response removed");
    } catch (err) {
      toast.error("Delete response failed");
      console.error(err);
    }
  },
}));
