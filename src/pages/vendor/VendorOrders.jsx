// src/pages/vendor/VendorOrders.jsx
import React, { useEffect, useState } from "react";
import {
  fetchVendorOrders,
  updateVendorOrderStatus,
  createVendorOrderStatus,
} from "../../api/vendorApi";

export default function VendorOrders() {
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [orderStatusOptions, setOrderStatusOptions] = useState([
    "Processing",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned",
    "Refunded",
  ]);

  const [newStatus, setNewStatus] = useState("");
  const [creatingStatus, setCreatingStatus] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(""); // Order selected for new status

  /* ================= LOAD ORDERS ================= */
  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const orders = await fetchVendorOrders();
      setVendorOrders(orders?.orders || orders || []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= HANDLERS ================= */
  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await updateVendorOrderStatus(orderId, status);
      loadOrders();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update order status");
    }
  };

  const handleCreateStatus = async () => {
  if (!newStatus.trim() || !selectedOrder) {
    alert("Please enter a status name and select an order");
    return;
  }

  setCreatingStatus(true);
  try {
    const orderObj = vendorOrders.find((o) => o._id === selectedOrder);
    if (!orderObj) throw new Error("Order not found");

    // ⚡ Backend expects 'name', not 'status'
    await createVendorOrderStatus({
      name: newStatus.trim(),
      order: orderObj._id,
      customer: orderObj.customer._id,
    });

    setOrderStatusOptions((prev) => [...prev, newStatus.trim()]);
    setNewStatus("");
    setSelectedOrder("");
    alert("New order status added!");
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to create order status");
  } finally {
    setCreatingStatus(false);
  }
};

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Vendor Orders</h1>

      {/* Add New Status */}
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
        <select
          value={selectedOrder}
          onChange={(e) => setSelectedOrder(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-1/3"
        >
          <option value="">Select Order</option>
          {vendorOrders.map((o) => (
            <option key={o._id} value={o._id}>
              {o._id} - {o.customer?.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New order status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-1/3"
        />
        <button
          onClick={handleCreateStatus}
          disabled={creatingStatus}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {creatingStatus ? "Adding..." : "Add Status"}
        </button>
      </div>

      {loadingOrders ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : vendorOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Products</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {vendorOrders.map((o) => (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{o._id}</td>
                  <td className="p-2">
                    {o.customer?.name}
                    <br />
                    <span className="text-xs text-gray-500">{o.customer?.email}</span>
                  </td>
                  <td className="p-2">
                    {o.products.map((i) => (
                      <div key={i._id} className="text-xs">
                        {i.product?.name} × {i.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-2">₹{o.totalAmount}</td>
                  <td className="p-2">{o.orderStatus}</td>
                  <td className="p-2">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleOrderStatusChange(o._id, e.target.value)}
                      className="border px-2 py-1 text-sm rounded"
                    >
                      {orderStatusOptions.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
