import express from "express";
import {
  getAllOrders,
  // createOrder,
  getOrderById,
  deleteOrder,
  getMyOrders,
  updateOrderStatus,
  updateMultipleOrderStatus,
  cancelOrderByUser,
  getAllOrdersWithoutPagination,
  confirmOrderDelivered,
  requestReturnOrder,
  confirmReturnOrder,
  refundOrder,
  
  
} from "../controllers/order.controller.js";
import { protectRoute, adminRoute, staffRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, staffRoute, getAllOrders); 


router.get("/all", protectRoute, staffRoute, getAllOrdersWithoutPagination);
router.get("/my-orders", protectRoute, getMyOrders);
router.get("/:id", protectRoute, getOrderById);         
router.delete("/:id", protectRoute, adminRoute, deleteOrder); 
router.patch("/:id/status",protectRoute, staffRoute, updateOrderStatus);
router.patch("/cancel-by-user/:id", protectRoute, cancelOrderByUser);
router.patch('/:id/confirm-delivered', protectRoute, confirmOrderDelivered);
router.patch("/:id/request-return", protectRoute, requestReturnOrder);
router.patch("/:id/confirm-return", protectRoute, staffRoute, confirmReturnOrder);
router.patch("/:id/refund", protectRoute, staffRoute, refundOrder);
router.patch("/bulk-status", protectRoute, staffRoute, updateMultipleOrderStatus);


export default router;
