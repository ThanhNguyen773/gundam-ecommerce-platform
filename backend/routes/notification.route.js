import express from "express";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllReadNotifications,
  deleteAllNotifications,
} from "../controllers/notification.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/", protectRoute, getMyNotifications);


router.patch("/read-all", protectRoute, markAllNotificationsAsRead);


router.delete("/delete/all-read", protectRoute, deleteAllReadNotifications);


router.delete("/delete/all", protectRoute, deleteAllNotifications);


router.patch("/:notificationId/read", protectRoute, markNotificationAsRead);


router.delete("/:notificationId", protectRoute, deleteNotification);

export default router;
