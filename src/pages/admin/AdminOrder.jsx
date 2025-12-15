// src/pages/admin/AdminOrders.jsx
import { useEffect, useState } from "react";
import {
  fetchAllOrders,
  fetchVendors,
  sendOrderToVendor,
  deleteOrder,
} from "../../api/adminapi";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      // Fetch orders + vendors at same time
      const [orderRes, vendorRes] = await Promise.all([
        fetchAllOrders(),
        fetchVendors(),

      ]);

      // Normalize responses safely
      const ordersData = Array.isArray(orderRes?.data)
        ? orderRes.data
        : orderRes || [];

      let vendorsData = Array.isArray(vendorRes?.data)
        ? vendorRes.data
        : vendorRes || [];

      // ❌ REMOVE FILTER THAT DELETES ALL VENDORS
      // vendorsData = vendorsData.filter((v) => v.status === "approved");

      // Debug
      console.log("FINAL VENDORS:", vendorsData);

      setOrders(ordersData);
      setVendors(vendorsData);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      alert("Failed to load admin data");
      setOrders([]);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignVendor(orderId, vendorId) {
    try {
      await sendOrderToVendor(orderId, vendorId);

      const vendor = vendors.find((v) => v._id === vendorId) || null;

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, vendor } : o))
      );
    } catch (err) {
      console.error("ASSIGN ERROR:", err);
      alert("Vendor assignment failed");
    }
  }

  async function handleOrderDelete(id) {
    if (!confirm("Delete this order?")) return;

    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Order deletion failed");
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Orders</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Order</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Vendor</th>
            <th className="border p-2">Assign Vendor</th>
            <th className="border p-2">Handle</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o._id}>
                <td className="border p-2">{o._id}</td>
                <td className="border p-2">{o.customer?.name || "Guest"}</td>
                <td className="border p-2">
                  {o.vendor?.shopName || o.vendor?.name || "Not Assigned"}
                </td>

                {/* SELECT VENDOR */}
                <td className="border p-2">
                  <select
                    value={o.vendor?._id || ""}
                    onChange={(e) => handleAssignVendor(o._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="">Select Vendor</option>

                    {vendors.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.shopName || v.name || v.vendorName || v._id}
                      </option>
                    ))}
                  </select>
                </td>

                {/* HANDLE */}
                <td className="border p-2 text-center">
                  <Link to={`/admin/orders/${o._id}/handle`}>
                    <button className="text-blue-600 underline">Handle</button>
                  </Link>
                </td>

                {/* DELETE */}
                <td className="border p-2 text-center">
                  <button
                    className="text-red-600 underline"
                    onClick={() => handleOrderDelete(o._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="text-right mt-4">
        <Link to="/admin/status-master">
          <button className="px-4 py-2 bg-gray-800 text-white rounded">
            Manage Order Status Master
          </button>
        </Link>
      </div>
    </div>
  );
}
