import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchAllOrders,
  getStatuses,
  updateOrderStatusAdmin,
  deleteOrderStatus,
} from "../../api/adminapi";

export default function AdminOrderHandle() {
  const { id } = useParams(); // Order ID
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const init = async () => {
      await loadOrder();
    };
    init();
  }, []);

  // Load order and vendor statuses
  async function loadOrder() {
    try {
      const ordersResp = await fetchAllOrders();
      const orders = ordersResp.data;
      const found = orders.find((o) => o._id === id);

      if (!found) return navigate("/admin/orders");

      setOrder(found);
      setStatus(found.status);

      await loadOrderStatuses(found._id);
    } catch (err) {
      console.error(err);
      alert("Failed to load order");
    }
  }

  async function loadOrderStatuses(orderId) {
    try {
      const resp = await getStatuses(orderId);
      setStatuses(Array.isArray(resp.statuses) ? resp.statuses : []);
    } catch (err) {
      console.error(err);
      setStatuses([]);
      alert("Failed to load order statuses");
    }
  }

  // Admin updates main order status
  async function handleUpdateOrderStatus() {
    if (!status) return alert("Select a status");

    try {
      await updateOrderStatusAdmin(order._id, status);
      alert("Order status updated by admin");
      await loadOrder();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    }
  }

  // Admin deletes a specific status
  async function handleDeleteStatus(statusId) {
    if (!window.confirm("Are you sure you want to delete this status?")) return;

    try {
      await deleteOrderStatus(statusId);
      alert("Status deleted successfully");
      await loadOrderStatuses(order._id); // refresh timeline
    } catch (err) {
      console.error(err);
      alert("Failed to delete status");
    }
  }

  if (!order) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Handle Order</h2>

      <p>
        <strong>Order ID:</strong> {order._id}
      </p>
      <p>
        <strong>Customer:</strong> {order.customer?.name || "Guest"}
      </p>
      <p>
        <strong>Vendor:</strong> {order.vendor?.shopName || "Not Assigned"}
      </p>

      <div className="mt-4">
        <label className="block mb-2 font-semibold">Vendor Status Timeline</label>
        <div className="border p-3 rounded max-h-64 overflow-y-auto">
          {statuses.length ? (
            statuses.map((s) => (
              <div
                key={s._id}
                className="mb-2 p-2 bg-gray-100 rounded flex justify-between items-start"
              >
                <div>
                  <strong>{s.status}</strong> — by {s.createdBy?.name || "Vendor"}{" "}
                  on {new Date(s.createdAt).toLocaleString()}
                  <p className="text-sm text-gray-700">{s.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteStatus(s._id)}
                  className="ml-4 bg-red-600 text-white px-2 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No statuses yet</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="block mb-2 font-semibold">Admin: Update Main Order Status</label>
        <div className="flex items-center gap-3">
          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select</option>
            {["Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={handleUpdateOrderStatus}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
