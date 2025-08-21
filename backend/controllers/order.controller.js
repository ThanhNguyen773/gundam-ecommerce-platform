// import Order from "../models/order.model.js";
// import Product from "../models/product.model.js";
// import {
//   notifyAdminsAndStaffs,
//   notifyAllUsers,
//   notifyUser,
// } from "../utils/notification.util.js";

// export const getAllOrders = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const from = req.query.from ? new Date(req.query.from) : null;
//     const to = req.query.to ? new Date(req.query.to) : null;
//     const status = req.query.status || null;
//     const search = req.query.search || "";
//     const paymentMethod = req.query.paymentMethod || null;
//     const query = {};

//     if (from && to) {
//       query.createdAt = {
//         $gte: new Date(from.setHours(0, 0, 0, 0)),
//         $lte: new Date(to.setHours(23, 59, 59, 999)),
//       };
//     }

//     if (status) {
//       query.status = status;
//     }
//     if (paymentMethod) {
//       query.paymentMethod = paymentMethod;
//     }

//     const now = new Date();
//     const shippingOrders = await Order.find({ status: "Shipping" });

//     for (const order of shippingOrders) {
//       const lastShippingLog = order.statusLog
//         .filter((log) => log.status === "Shipping")
//         .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))[0];

//       const shippedDate =
//         lastShippingLog?.changedAt || order.updatedAt || order.createdAt;
//       const daysSinceShipping = Math.floor(
//         (now - new Date(shippedDate)) / (1000 * 60 * 60 * 24)
//       );

//       if (daysSinceShipping > 15) {
//         order.status = "Delivered";
//         order.statusLog.push({
//           status: "Delivered",
//           changedAt: now,
//           changedBy: null,
//         });
//         await order.save();
//       }
//     }

//     let orders = await Order.find(query)
//       .populate("user", "name email")
//       .populate("products.product", "name price")
//       .populate("coupon", "code discountPercentage")
//       .sort({ createdAt: -1 });

//     if (search) {
//       orders = orders.filter(
//         (order) =>
//           order.orderCode?.toLowerCase().includes(search.toLowerCase()) ||
//           order.user?.name?.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     const totalOrders = orders.length;
//     const paginatedOrders = orders.slice(skip, skip + limit);

//     res.status(200).json({
//       orders: paginatedOrders,
//       currentPage: page,
//       totalPages: Math.ceil(totalOrders / limit),
//     });
//   } catch (err) {
//     console.error("🔥 Lỗi lấy đơn hàng:", err);
//     res.status(500).json({ error: "Không thể lấy danh sách đơn hàng" });
//   }
// };

// export const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate("user", "name email")
//       .populate("products.product", "name price")
//       .populate("coupon", "code discountPercentage")
//       .populate("statusLog.changedBy", "name");

//     if (!order) {
//       return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
//     }

//     const isAdminOrStaff =
//       req.user.role === "admin" || req.user.role === "staff";
//     if (
//       !isAdminOrStaff &&
//       order.user._id.toString() !== req.user._id.toString()
//     ) {
//       return res
//         .status(403)
//         .json({ error: "Không có quyền truy cập đơn hàng này" });
//     }

//     res.status(200).json({
//       ...order.toObject(),
//       statusLog: order.statusLog,
//     });
//   } catch (error) {
//     console.error("Lỗi lấy đơn hàng:", error);
//     res.status(500).json({ error: "Không thể lấy đơn hàng" });
//   }
// };

// export const deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findByIdAndDelete(req.params.id);

//     if (!order) {
//       return res.status(404).json({ error: "Không tìm thấy đơn hàng để xoá" });
//     }

//     res.status(200).json({ message: "Đơn hàng đã được xoá" });
//   } catch (error) {
//     console.error("Lỗi xoá đơn hàng:", error);
//     res.status(500).json({ error: "Không thể xoá đơn hàng" });
//   }
// };

// export const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id })
//       .sort({ createdAt: -1 })
//       .populate({
//         path: "products.product",
//         select: "name reviews",
//         populate: {
//           path: "reviews",
//           model: "Review",
//           match: { user: req.user._id },
//           select: "rating comment user order",
//         },
//       })
//       .populate("coupon", "code discountPercentage")
//       .populate("user", "name email");

//     res.status(200).json(
//       orders.map((order) => ({
//         ...order.toObject(),
//         statusLog: order.statusLog,
//       }))
//     );
//   } catch (error) {
//     console.error("Lỗi lấy đơn hàng người dùng:", error);
//     res.status(500).json({ error: "Không thể lấy đơn hàng cá nhân" });
//   }
// };

// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const validStatuses = [
//       "Processing",
//       "Shipping",
//       "Delivered",
//       "Canceled",
//       "Returned",
//       "Refunded",
//     ];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ error: "Trạng thái không hợp lệ" });
//     }

//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
//     }

//     const validNextStatuses = {
//       Processing: ["Shipping", "Canceled"],
//       Shipping: ["Delivered", "Returned"],
//       Delivered: ["Returned"],
//       Returned: ["ReturnConfirmed"],
//       ReturnConfirmed: ["Refunded"],
//     };

//     if (!validNextStatuses[order.status]?.includes(status)) {
//       return res.status(400).json({
//         error: `Không thể chuyển trạng thái từ '${order.status}' sang '${status}'`,
//       });
//     }

//     order.status = status;

//     order.statusLog.push({
//       status,
//       changedAt: new Date(),
//       changedBy: req.user._id,
//     });

//     await order.save();
//     await notifyUser(
//       order.user,
//       `📦 [#${order.orderCode}] Status updated: "${status}"`,
//       "order",
//       `/orders/${order._id}`
//     );

//     res.status(200).json({ message: "Cập nhật trạng thái thành công", order });
//   } catch (err) {
//     console.error("Lỗi cập nhật trạng thái:", err);
//     res.status(500).json({ error: "Lỗi máy chủ" });
//   }
// };

// export const updateMultipleOrderStatus = async (req, res) => {
//   try {
//     const { ids, status } = req.body;

//     if (!Array.isArray(ids) || !status) {
//       return res
//         .status(400)
//         .json({ error: "Thiếu danh sách ID hoặc trạng thái" });
//     }

//     if (status !== "Shipping") {
//       return res
//         .status(400)
//         .json({ error: "Chỉ được phép cập nhật trạng thái sang 'Shipping'" });
//     }

//     const orders = await Order.find({ _id: { $in: ids } });

//     const invalidOrders = orders.filter((o) => o.status !== "Processing");

//     if (invalidOrders.length > 0) {
//       return res.status(400).json({
//         error: "Chỉ được phép cập nhật đơn từ 'Processing' sang 'Shipping'",
//       });
//     }

//     const updateOps = orders.map((order) => {
//       return Order.updateOne(
//         { _id: order._id },
//         {
//           $set: { status: "Shipping" },
//           $push: {
//             statusLog: {
//               status: "Shipping",
//               changedAt: new Date(),
//               changedBy: req.user._id,
//             },
//           },
//         }
//       );
//     });

//     await Promise.all(updateOps);

//     res.status(200).json({ success: true, updated: updateOps.length });
//   } catch (err) {
//     console.error("Lỗi cập nhật trạng thái hàng loạt:", err);
//     res.status(500).json({ error: "Không thể cập nhật trạng thái hàng loạt" });
//   }
// };

// export const cancelOrderByUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user._id;

//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
//     }

//     if (order.user.toString() !== userId.toString()) {
//       return res
//         .status(403)
//         .json({ error: "Bạn không có quyền huỷ đơn hàng này" });
//     }

//     if (order.status !== "Processing") {
//       return res
//         .status(400)
//         .json({ error: "Chỉ có thể huỷ đơn hàng khi đang xử lý" });
//     }

//     order.status = "Canceled";
//     await order.save();
//     await notifyAdminsAndStaffs(
//       `❌ Order [#${order.orderCode}] has been canceled by the user`,
//       "order",
//       `/orders/${order._id}`
//     );

//     await notifyUser(
//       order.user,
//       `❌ You have successfully canceled order [#${order.orderCode}]`,
//       "order",
//       `/orders/${order._id}`
//     );
//     res.status(200).json({ message: "Đơn hàng đã được huỷ", order });
//   } catch (err) {
//     console.error("Lỗi huỷ đơn hàng bởi user:", err);
//     res.status(500).json({ error: "Không thể huỷ đơn hàng" });
//   }
// };

// export const getAllOrdersWithoutPagination = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .populate("user", "name email")
//       .populate("products.product", "name price")
//       .populate("coupon", "code discountPercentage");

//     res.status(200).json({ orders });
//   } catch (err) {
//     console.error("Lỗi lấy tất cả đơn hàng:", err);
//     res.status(500).json({ error: "Không thể lấy tất cả đơn hàng" });
//   }
// };

// export const confirmOrderDelivered = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const orderId = req.params.id;

//     const order = await Order.findOne({ _id: orderId, user: userId });
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (order.status !== "Shipping") {
//       return res
//         .status(400)
//         .json({ message: "Order is not currently in 'Shipping' status" });
//     }

//     if (order.user.toString() !== userId.toString()) {
//       return res
//         .status(403)
//         .json({ error: "You are not authorized to confirm this order" });
//     }

//     order.status = "Delivered";
//     order.deliveredAt = new Date();

//     order.statusLog.push({
//       status: "Delivered",
//       changedAt: new Date(),
//       changedBy: userId,
//     });

//     await order.save();

//     await notifyAdminsAndStaffs(
//       `📬 Order [#${order.orderCode}] has been confirmed as delivered by the user`,
//       "order",
//       `/orders/${order._id}`
//     );

//     await notifyUser(
//       order.user,
//       `✅ You have confirmed that order [#${order.orderCode}] was delivered`,
//       "order",
//       `/orders/${order._id}`
//     );

//     res
//       .status(200)
//       .json({ message: "Order delivery confirmed successfully", order });
//   } catch (error) {
//     console.error("Error in confirmOrderDelivered:", error);
//     res.status(500).json({
//       message: "Failed to confirm order delivery",
//       error: error.message,
//     });
//   }
// };

// export const requestReturnOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user._id;
//     const { reason } = req.body;

//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     if (order.user.toString() !== userId.toString()) {
//       return res
//         .status(403)
//         .json({ error: "Not authorized to return this order" });
//     }

//     if (order.status !== "Delivered") {
//       return res
//         .status(400)
//         .json({ error: "Only delivered orders can be returned" });
//     }

//     order.status = "Returned";
//     order.statusLog.push({
//       status: "Returned",
//       changedAt: new Date(),
//       changedBy: userId,
//     });

//     order.note = `Return requested: ${reason || "No reason provided"}`;

//     await order.save();

//     await notifyAdminsAndStaffs(
//       `↩️ Order [#${order.orderCode}] return requested by user`,
//       "order",
//       `/orders/${order._id}`
//     );

//     await notifyUser(
//       order.user,
//       `↩️ You requested a return for order [#${order.orderCode}]`,
//       "order",
//       `/orders/${order._id}`
//     );

//     res.status(200).json({ message: "Return request submitted", order });
//   } catch (error) {
//     console.error("Error in requestReturnOrder:", error);
//     res.status(500).json({ error: "Failed to request return" });
//   }
// };

// export const confirmReturnOrder = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (req.user.role !== "admin" && req.user.role !== "staff") {
//       return res
//         .status(403)
//         .json({ error: "Not authorized to confirm return" });
//     }

//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     if (order.status !== "Returned") {
//       return res
//         .status(400)
//         .json({ error: "Only orders in 'Returned' status can be confirmed" });
//     }

//     order.status = "ReturnConfirmed";
//     order.statusLog.push({
//       status: "ReturnConfirmed",
//       changedAt: new Date(),
//       changedBy: req.user._id,
//     });

//     await order.save();

//     await notifyUser(
//       order.user,
//       `✅ Your return request for order [#${order.orderCode}] has been confirmed by staff. Refund will be processed soon.`,
//       "order",
//       `/orders/${order._id}`
//     );

//     res.status(200).json({ message: "Return confirmed successfully", order });
//   } catch (error) {
//     console.error("Error in confirmReturnOrder:", error);
//     res.status(500).json({ error: "Failed to confirm return" });
//   }
// };

// export const refundOrder = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (req.user.role !== "admin" && req.user.role !== "staff") {
//       return res.status(403).json({ error: "Not authorized to refund" });
//     }

//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     if (order.status !== "ReturnConfirmed") {
//       return res
//         .status(400)
//         .json({
//           error: "Only orders in 'ReturnConfirmed' status can be refunded",
//         });
//     }

//     order.status = "Refunded";
//     order.statusLog.push({
//       status: "Refunded",
//       changedAt: new Date(),
//       changedBy: req.user._id,
//     });

//     await order.save();

//     await notifyUser(
//       order.user,
//       `💸 Your order [#${order.orderCode}] has been refunded successfully.`,
//       "order",
//       `/orders/${order._id}`
//     );

//     res.status(200).json({ message: "Order refunded successfully", order });
//   } catch (error) {
//     console.error("Error in refundOrder:", error);
//     res.status(500).json({ error: "Failed to refund order" });
//   }
// };

import Order from "../models/order.model.js";
import {
  notifyAdminsAndStaffs,
  notifyUser,
} from "../utils/notification.util.js";

export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;
    const status = req.query.status || null;
    const search = req.query.search || "";
    const paymentMethod = req.query.paymentMethod || null;
    const query = {};

    if (from && to) {
      query.createdAt = {
        $gte: new Date(from.setHours(0, 0, 0, 0)),
        $lte: new Date(to.setHours(23, 59, 59, 999)),
      };
    }

    if (status) query.status = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    const now = new Date();
    const shippingOrders = await Order.find({ status: "Shipping" });

    for (const order of shippingOrders) {
      const shippedDate = order.updatedAt || order.createdAt;
      const daysSinceShipping = Math.floor(
        (now - new Date(shippedDate)) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceShipping > 15) {
        order.status = "Delivered";
        await order.save();
      }
    }

    let orders = await Order.find(query)
      .populate("user", "name email")
      .populate("products.product", "name price")
      .populate("coupon", "code discountPercentage")
      .sort({ createdAt: -1 });

    if (search) {
      orders = orders.filter(
        (order) =>
          order.orderCode?.toLowerCase().includes(search.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const totalOrders = orders.length;
    const paginatedOrders = orders.slice(skip, skip + limit);

    res.status(200).json({
      orders: paginatedOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (err) {
    console.error("🔥 Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product", "name price")
      .populate("coupon", "code discountPercentage");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const isAdminOrStaff =
      req.user.role === "admin" || req.user.role === "staff";
    if (
      !isAdminOrStaff &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "products.product",
        select: "name reviews",
        populate: {
          path: "reviews",
          model: "Review",
          match: { user: req.user._id },
          select: "rating comment user order",
        },
      })
      .populate("coupon", "code discountPercentage")
      .populate("user", "name email");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Failed to fetch your orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Processing",
      "Shipping",
      "Delivered",
      "Canceled",
      "Returned",
      "ReturnConfirmed",
      "Refunded",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const validNextStatuses = {
      Processing: ["Shipping", "Canceled"],
      Shipping: ["Delivered", "Returned"],
      Delivered: ["Returned"],
      Returned: ["ReturnConfirmed"],
      ReturnConfirmed: ["Refunded"],
    };

    if (!validNextStatuses[order.status]?.includes(status)) {
      return res.status(400).json({
        error: `Cannot change status from '${order.status}' to '${status}'`,
      });
    }

    order.status = status;
    await order.save();

    await notifyUser(
      order.user,
      `📦 [#${order.orderCode}] Status updated: "${status}"`,
      "order",
      `/orders/${order._id}`
    );

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateMultipleOrderStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!Array.isArray(ids) || !status) {
      return res.status(400).json({ error: "Missing IDs or status" });
    }

    if (status !== "Shipping") {
      return res
        .status(400)
        .json({ error: "Only allowed to update status to 'Shipping'" });
    }

    const orders = await Order.find({ _id: { $in: ids } });
    const invalidOrders = orders.filter((o) => o.status !== "Processing");

    if (invalidOrders.length > 0) {
      return res.status(400).json({
        error: "Only orders in 'Processing' can be updated to 'Shipping'",
      });
    }

    const updateOps = orders.map((order) =>
      Order.updateOne(
        { _id: order._id },
        {
          $set: { status: "Shipping" },
        }
      )
    );

    await Promise.all(updateOps);
    res.status(200).json({ success: true, updated: updateOps.length });
  } catch (err) {
    console.error("Error bulk updating status:", err);
    res.status(500).json({ error: "Failed to bulk update status" });
  }
};

export const cancelOrderByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to cancel this order" });
    }

    if (order.status !== "Processing") {
      return res
        .status(400)
        .json({ error: "Can only cancel while 'Processing'" });
    }
    const minutesSinceCreated =
      (Date.now() - new Date(order.createdAt)) / (1000 * 60);
    if (minutesSinceCreated > 30) {
      return res
        .status(400)
        .json({ error: "Cancellation period expired (30 minutes limit)" });
    }

    order.status = "Canceled";
    await order.save();

    await notifyAdminsAndStaffs(
      `❌ Order [#${order.orderCode}] was canceled by the user`,
      "order",
      `/orders/${order._id}`
    );
    await notifyUser(
      order.user,
      `❌ You canceled order [#${order.orderCode}] successfully`,
      "order",
      `/orders/${order._id}`
    );

    res.status(200).json({ message: "Order canceled", order });
  } catch (err) {
    console.error("Error canceling order:", err);
    res.status(500).json({ error: "Failed to cancel order" });
  }
};

export const getAllOrdersWithoutPagination = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("products.product", "name price")
      .populate("coupon", "code discountPercentage");

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
};

export const confirmOrderDelivered = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Shipping") {
      return res
        .status(400)
        .json({ message: "Order is not in 'Shipping' status" });
    }

    order.status = "Delivered";
    order.deliveredAt = new Date();
    await order.save();

    await notifyAdminsAndStaffs(
      `📬 Order [#${order.orderCode}] was confirmed delivered by user`,
      "order",
      `/orders/${order._id}`
    );
    await notifyUser(
      order.user,
      `✅ You confirmed order [#${order.orderCode}] was delivered`,
      "order",
      `/orders/${order._id}`
    );

    res.status(200).json({ message: "Delivery confirmed", order });
  } catch (error) {
    console.error("Error confirmOrderDelivered:", error);
    res.status(500).json({ message: "Failed to confirm delivery" });
  }
};

export const requestReturnOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to return this order" });
    }

    if (order.status !== "Delivered") {
      return res
        .status(400)
        .json({ error: "Only 'Delivered' orders can be returned" });
    }
    const daysSinceDelivered =
      (Date.now() - new Date(order.deliveredAt)) / (1000 * 60 * 60 * 24);
    if (daysSinceDelivered > 7) {
      return res
        .status(400)
        .json({ error: "Return period expired (7 days limit)" });
    }

    order.status = "Returned";
    order.note = `Return requested: ${reason || "No reason provided"}`;
    await order.save();

    await notifyAdminsAndStaffs(
      `↩️ Order [#${order.orderCode}] return requested by user`,
      "order",
      `/orders/${order._id}`
    );
    await notifyUser(
      order.user,
      `↩️ You requested a return for order [#${order.orderCode}]`,
      "order",
      `/orders/${order._id}`
    );

    res.status(200).json({ message: "Return requested", order });
  } catch (error) {
    console.error("Error requestReturnOrder:", error);
    res.status(500).json({ error: "Failed to request return" });
  }
};

export const confirmReturnOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== "admin" && req.user.role !== "staff") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.status !== "Returned") {
      return res
        .status(400)
        .json({ error: "Only 'Returned' orders can be confirmed" });
    }

    order.status = "ReturnConfirmed";
    await order.save();

    await notifyUser(
      order.user,
      `✅ Your return request for order [#${order.orderCode}] was confirmed. Refund will be processed soon.`,
      "order",
      `/orders/${order._id}`
    );

    res.status(200).json({ message: "Return confirmed", order });
  } catch (error) {
    console.error("Error confirmReturnOrder:", error);
    res.status(500).json({ error: "Failed to confirm return" });
  }
};

export const refundOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== "admin" && req.user.role !== "staff") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.status !== "ReturnConfirmed") {
      return res
        .status(400)
        .json({ error: "Only 'ReturnConfirmed' orders can be refunded" });
    }

    order.status = "Refunded";
    await order.save();

    await notifyUser(
      order.user,
      `💸 Order [#${order.orderCode}] was refunded successfully.`,
      "order",
      `/orders/${order._id}`
    );

    res.status(200).json({ message: "Order refunded successfully", order });
  } catch (error) {
    console.error("Error refundOrder:", error);
    res.status(500).json({ error: "Failed to refund order" });
  }
};
