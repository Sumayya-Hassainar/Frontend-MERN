// src/pages/admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import {
  fetchAllOrders,
  fetchVendors,
  fetchOrderStatuses,
  sendOrderToVendor,
  adminUpdateOrderStatus,
  updateOrderStatusMaster,
  deleteOrderStatus,
  deleteOrder,
} from "../../api/adminapi";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [ordersData, vendorsData, statusesData] = await Promise.all([
        fetchAllOrders(),
        fetchVendors(),
        fetchOrderStatuses(),
      ]);

      setOrders(Array.isArray(ordersData) ? ordersData : ordersData?.orders || []);
      setVendors(Array.isArray(vendorsData) ? vendorsData : vendorsData?.vendors || []);
      setStatuses(Array.isArray(statusesData) ? statusesData : []);
    } catch (err) {
      console.error("AdminOrders Load Error:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= ACTIONS ================= */
  const handleAssignVendor = async (orderId, vendorId) => {
    if (!vendorId) return alert("Select a vendor");
    try {
      await sendOrderToVendor(orderId, vendorId);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, vendor: vendors.find((v) => v._id === vendorId) } : o
        )
      );
    } catch (err) {
      alert(err.message || "Vendor assignment failed");
    }
  };

  const handleOrderDelete = async (orderId) => {
    if (!window.confirm("Delete order?")) return;
    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      alert(err.message || "Order delete failed");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!newStatus) return;
    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      alert(err.message || "Status update failed");
    }
  };

  const handleMasterStatusUpdate = async (id, newName) => {
    if (!newName) return;
    try {
      await updateOrderStatusMaster(id, { name: newName });
      setStatuses((prev) =>
        prev.map((s) => (s._id === id ? { ...s, name: newName } : s))
      );
    } catch (err) {
      alert(err.message || "Failed to update master status");
    }
  };

  const handleMasterStatusDelete = async (id) => {
    if (!window.confirm("Delete master status?")) return;
    try {
      await deleteOrderStatus(id);
      setStatuses((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete master status");
    }
  };

  /* ================= UI ================= */
  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Order Management</h1>

      {/* ================= ORDERS TABLE ================= */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Current Status</th>
            <th className="border p-2">Assign Vendor</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-6 text-gray-500">
                No orders found
              </td>
            </tr>
          )}
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="border p-2">{order._id}</td>
              <td className="border p-2">{order.customer?.name || "Guest"}</td>
              <td className="border p-2">₹{order.totalAmount}</td>

              {/* Order Status */}
              <td className="border p-2">
                <select
                  value={order.orderStatus || ""}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border p-1 rounded w-full"
                >
                  <option value="">Select Status</option>
                  {statuses.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </td>

              {/* Vendor Assignment */}
              <td className="border p-2">
                <select
                  value={order.vendor?._id || ""}
                  onChange={(e) => handleAssignVendor(order._id, e.target.value)}
                  className="border p-1 rounded w-full"
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.shopName}
                    </option>
                  ))}
                </select>
              </td>

              {/* Actions */}
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleOrderDelete(order._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= MASTER STATUSES TABLE ================= */}
      <h2 className="text-xl font-semibold mt-8">Order Status Master</h2>
      <table className="w-full border text-sm mt-2">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Status Name</th>
            <th className="border p-2">Actions</th>
             <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {statuses.length === 0 && (
            <tr>
              <td colSpan="2" className="text-center p-4 text-gray-500">
                No master statuses found
              </td>
            </tr>
          )}
          {statuses.map((status) => (
            <tr key={status._id}>
              <td className="border p-3">
                <input
                  type="text"
                  defaultValue={status.name}
                  onBlur={(e) => handleMasterStatusUpdate(status._id, e.target.value)}
                  className="border p-1 rounded w-full"
                />
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleMasterStatusUpdate(status._id)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </td>

              <td className="border p-2 text-center">
                <button
                  onClick={() => handleMasterStatusDelete(status._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
