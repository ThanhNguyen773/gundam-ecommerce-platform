import express from "express";
import {
  getAllBanners,
  createBanner,
  deleteBanner,
  toggleBannerActive,
  getBannersByCategory,
} from "../controllers/banner.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/category/:category", getBannersByCategory);


router.get("/", getAllBanners);
router.post("/", protectRoute, adminRoute, createBanner);
  

router.patch("/:id/toggle", protectRoute, adminRoute, toggleBannerActive);
router.delete("/:id", protectRoute, adminRoute, deleteBanner);

export default router;
