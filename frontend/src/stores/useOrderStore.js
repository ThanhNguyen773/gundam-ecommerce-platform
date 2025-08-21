import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useOrderStore = create((set) => ({
  orders: [],
  userOrders: [],
  loading: false,
  orderStats: null,
  loadingStats: false,
  selectedOrder: null,

  fetchOrders: async (page = 1, filters = {}) => {
    set({ loading: true });
    try {
      const query = new URLSearchParams({
        page,
        limit: 10,
        ...filters,
      }).toString();

      const res = await axios.get(`/orders?${query}`);
      set({ orders: res.data.orders || [], loading: false });
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      toast.error("Không thể tải đơn hàng");
      set({ loading: false });
    }
  },

  fetchMyOrders: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/orders/my-orders");
      set({ userOrders: res.data, loading: false });
    } catch (err) {
      console.error("Lỗi lấy đơn hàng người dùng:", err);
      toast.error("Không thể tải đơn hàng cá nhân");
      set({ loading: false });
    }
  },
  fetchOrderById: async (orderId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/orders/${orderId}`);
      set({ selectedOrder: res.data, loading: false });
    } catch (err) {
      toast.error("Không tìm thấy đơn hàng");
      set({ loading: false });
    }
  },

  deleteOrder: async (orderId) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa đơn hàng này?");
    if (!confirm) return;

    set({ loading: true });
    try {
      await axios.delete(`/orders/${orderId}`);
      set((state) => ({
        orders: state.orders.filter((o) => o._id !== orderId),
        userOrders: state.userOrders.filter((o) => o._id !== orderId),
        loading: false,
      }));
      toast.success("Đã xoá đơn hàng");
    } catch (error) {
      console.error("Xoá đơn hàng thất bại:", error);
      toast.error("Xóa thất bại");
      set({ loading: false });
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const res = await axios.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? res.data : order
        ),
      }));

      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  },

  updateOrdersBulkStatus: async (ids, status, allOrders) => {
    try {
      const invalid = allOrders.filter(
        (o) => ids.includes(o._id) && o.status !== "Processing"
      );

      if (status !== "Shipping") {
        toast.error("Chỉ được phép chuyển từ Processing sang Shipping");
        return;
      }

      if (invalid.length > 0) {
        toast.error("Chỉ được phép chuyển từ Processing sang Delivered");
        return;
      }

      await axios.patch(`/orders/bulk-status`, { ids, status });

      set((state) => ({
        orders: state.orders.map((o) =>
          ids.includes(o._id) ? { ...o, status } : o
        ),
      }));

      toast.success("Cập nhật hàng loạt thành công");
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái hàng loạt:", error);
      toast.error("Cập nhật thất bại");
    }
  },

  // cancelOrderByUser: async (orderId) => {
  //   const confirm = window.confirm("Bạn có chắc muốn huỷ đơn hàng này?");
  //   if (!confirm) return;

  //   try {
  //     await axios.patch(`/orders/cancel-by-user/${orderId}`);

  //     // Cập nhật lại danh sách userOrders sau khi huỷ
  //     set((state) => ({
  //       userOrders: state.userOrders.map((o) =>
  //         o._id === orderId ? { ...o, status: "Canceled" } : o
  //       ),
  //     }));

  //     toast.success("Đơn hàng đã được huỷ.");
  //   } catch (err) {
  //     console.error("Lỗi huỷ đơn hàng:", err);
  //     toast.error(err.response?.data?.error || "Huỷ đơn thất bại.");
  //   }
  // },

  cancelOrderByUser: async (orderId) => {
    let currentOrder;
    set((state) => {
      currentOrder = state.userOrders.find((o) => o._id === orderId);
      return {};
    });

    if (!currentOrder) {
      toast.error("Không tìm thấy đơn hàng.");
      return;
    }

    if (currentOrder.status !== "Processing") {
      toast.error("Chỉ có thể huỷ đơn hàng đang ở trạng thái Processing.");
      return;
    }

    const confirm = window.confirm("Bạn có chắc muốn huỷ đơn hàng này?");
    if (!confirm) return;

    try {
      await axios.patch(`/orders/cancel-by-user/${orderId}`);

      set((state) => ({
        userOrders: state.userOrders.map((o) =>
          o._id === orderId ? { ...o, status: "Canceled" } : o
        ),
        selectedOrder:
          state.selectedOrder && state.selectedOrder._id === orderId
            ? { ...state.selectedOrder, status: "Canceled" }
            : state.selectedOrder,
      }));

      toast.success("Đơn hàng đã được huỷ.");
    } catch (err) {
      console.error("Lỗi huỷ đơn hàng:", err);
      toast.error(err.response?.data?.error || "Huỷ đơn thất bại.");
    }
  },

  confirmOrderDelivered: async (orderId) => {
    try {
      const res = await axios.patch(`/orders/${orderId}/confirm-delivered`);

      const updatedOrder = res.data.order;

      set((state) => ({
        userOrders: state.userOrders.map((o) =>
          o._id === orderId ? updatedOrder : o
        ),
        selectedOrder:
          state.selectedOrder && state.selectedOrder._id === orderId
            ? updatedOrder
            : state.selectedOrder,
      }));

      toast.success("Đã xác nhận đã nhận hàng");
    } catch (error) {
      console.error("Lỗi xác nhận đã nhận hàng:", error);
      toast.error("Không thể xác nhận đã nhận hàng");
    }
  },

  fetchOrderStats: async () => {
    set({ loadingStats: true });
    try {
      const res = await axios.get("/orders/stats");
      set({ orderStats: res.data });
    } catch (err) {
      console.error("Lỗi khi lấy thống kê:", err);
    } finally {
      set({ loadingStats: false });
    }
  },

  // 📌 User: Request Return
  requestReturnOrder: async (orderId, note = "") => {
    try {
      const res = await axios.patch(`/orders/${orderId}/request-return`, {
        note,
      });
      const updatedOrder = res.data.order;

      set((state) => ({
        userOrders: state.userOrders.map((o) =>
          o._id === orderId ? updatedOrder : o
        ),
        selectedOrder:
          state.selectedOrder && state.selectedOrder._id === orderId
            ? updatedOrder
            : state.selectedOrder,
      }));

      toast.success("Đã gửi yêu cầu trả hàng");
    } catch (error) {
      console.error("Lỗi request return:", error);
      toast.error(
        error.response?.data?.error || "Không thể gửi yêu cầu trả hàng"
      );
    }
  },

  // 📌 Staff/Admin: Confirm Return
  confirmReturnOrder: async (orderId) => {
    try {
      const res = await axios.patch(`/orders/${orderId}/confirm-return`);
      const updatedOrder = res.data.order;

      set((state) => ({
        orders: state.orders.map((o) => (o._id === orderId ? updatedOrder : o)),
        selectedOrder:
          state.selectedOrder && state.selectedOrder._id === orderId
            ? updatedOrder
            : state.selectedOrder,
      }));

      toast.success("Đã xác nhận đơn trả hàng");
    } catch (error) {
      console.error("Lỗi confirm return:", error);
      toast.error(error.response?.data?.error || "Không thể xác nhận trả hàng");
    }
  },

  // 📌 Staff/Admin: Refund Order
  refundOrder: async (orderId) => {
    try {
      const res = await axios.patch(`/orders/${orderId}/refund`);
      const updatedOrder = res.data.order;

      set((state) => ({
        orders: state.orders.map((o) => (o._id === orderId ? updatedOrder : o)),
        selectedOrder:
          state.selectedOrder && state.selectedOrder._id === orderId
            ? updatedOrder
            : state.selectedOrder,
      }));

      toast.success("Đơn hàng đã được hoàn tiền");
    } catch (error) {
      console.error("Lỗi refund:", error);
      toast.error(error.response?.data?.error || "Không thể hoàn tiền");
    }
  },
}));
