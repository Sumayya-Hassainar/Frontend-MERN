// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  fetchVendors,
  createVendor,
  updateVendor,
  deleteVendor,
  fetchOrderStatuses,
  updateOrderStatus,
  deleteOrderStatus,
  fetchAllOrders,
  sendOrderToVendor,
  deleteOrder,
} from "../../api/adminapi";

export default function AdminDashboard() {
  /* ================= VENDOR STATE ================= */
  const [vendors, setVendors] = useState([]);
  const [vendorForm, setVendorForm] = useState({
    userId: "",
    shopName: "",
    description: "",
    address: "",
  });
  const [editingVendorId, setEditingVendorId] = useState(null);

  /* ================= STATUS STATE ================= */
  const [statuses, setStatuses] = useState([]);
  const [statusForm, setStatusForm] = useState({
    name: "",
    description: "",
  });
  const [editingStatusId, setEditingStatusId] = useState(null);

  /* ================= ORDER STATE ================= */
  const [orders, setOrders] = useState([]);

  /* ================= LOAD FUNCTIONS ================= */

  const loadVendors = async () => {
    const res = await fetchVendors();
    setVendors(Array.isArray(res) ? res : res?.vendors || []);
  };

  const loadStatuses = async () => {
    const res = await fetchOrderStatuses();
    setStatuses(Array.isArray(res) ? res : res?.data || []);
  };

  const loadOrders = async () => {
    const res = await fetchAllOrders();
    setOrders(Array.isArray(res) ? res : res?.orders || []);
  };

  useEffect(() => {
    loadVendors();
    loadStatuses();
    loadOrders();
  }, []);

  /* ================= VENDOR HANDLERS ================= */

  const handleVendorChange = (e) => {
    setVendorForm({ ...vendorForm, [e.target.name]: e.target.value });
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    if (editingVendorId) {
      await updateVendor(editingVendorId, vendorForm);
    } else {
      await createVendor(vendorForm);
    }
    setVendorForm({ userId: "", shopName: "", description: "", address: "" });
    setEditingVendorId(null);
    loadVendors();
  };

  const handleVendorEdit = (vendor) => {
    setEditingVendorId(vendor._id);
    setVendorForm(vendor);
  };

  const handleVendorDelete = async (id) => {
    if (window.confirm("Delete vendor?")) {
      await deleteVendor(id);
      loadVendors();
    }
  };

  /* ================= STATUS HANDLERS (ADMIN CAN'T CREATE) ================= */

  const handleStatusEdit = (status) => {
    setEditingStatusId(status._id);
    setStatusForm(status);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    await updateOrderStatus(editingStatusId, statusForm);
    setEditingStatusId(null);
    setStatusForm({ name: "", description: "" });
    loadStatuses();
  };

  const handleStatusDelete = async (id) => {
    if (window.confirm("Delete status?")) {
      await deleteOrderStatus(id);
      loadStatuses();
    }
  };

  /* ================= ORDER HANDLERS ================= */

  const handleAssignVendor = async (orderId, vendorId) => {
    if (!vendorId) return alert("Select vendor");
    await sendOrderToVendor(orderId, vendorId);
    alert("Vendor Assigned");
    loadOrders();
  };

  const handleOrderDelete = async (id) => {
    if (window.confirm("Delete order?")) {
      await deleteOrder(id);
      loadOrders();
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* ================= VENDOR MANAGEMENT ================= */}
      <section className="bg-white border rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4">Vendor Management</h2>

        <form onSubmit={handleVendorSubmit} className="grid gap-3 md:grid-cols-2">
          <input name="userId" placeholder="User ID" value={vendorForm.userId} onChange={handleVendorChange} className="border p-2 rounded" />
          <input name="shopName" placeholder="Shop Name" value={vendorForm.shopName} onChange={handleVendorChange} className="border p-2 rounded" />
          <input name="description" placeholder="Description" value={vendorForm.description} onChange={handleVendorChange} className="border p-2 rounded" />
          <input name="address" placeholder="Address" value={vendorForm.address} onChange={handleVendorChange} className="border p-2 rounded" />

          <button className="bg-indigo-600 text-white p-2 rounded col-span-2">
            {editingVendorId ? "Update Vendor" : "Create Vendor"}
          </button>
        </form>

        <table className="w-full border mt-5">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Shop</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v._id}>
                <td className="border p-2">{v.shopName}</td>
                <td className="border p-2">{v.description}</td>
                <td className="border p-2">{v.address}</td>
                <td className="border p-2">
                  <button onClick={() => handleVendorEdit(v)} className="text-blue-600 mr-3">Edit</button>
                  <button onClick={() => handleVendorDelete(v._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ================= ORDER STATUS MASTER ================= */}
      <section className="bg-white border rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4">Order Status Master (Admin Only Edit)</h2>

        {editingStatusId && (
          <form onSubmit={handleStatusUpdate} className="flex gap-3 mb-4">
            <input name="name" value={statusForm.name} onChange={(e) => setStatusForm({ ...statusForm, name: e.target.value })} className="border p-2 rounded" />
            <button className="bg-indigo-600 text-white px-4 rounded">Update</button>
          </form>
        )}

        <table className="w-full border">
          <tbody>
            {statuses.map((s) => (
              <tr key={s._id}>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">
                  <button onClick={() => handleStatusEdit(s)} className="text-blue-600 mr-3">Edit</button>
                  <button onClick={() => handleStatusDelete(s._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ================= ORDER MANAGEMENT ================= */}
      <section className="bg-white border rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4">Order Management</h2>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Assign Vendor</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{order.customer?.name || "Guest"}</td>
                <td className="border p-2">₹{order.totalAmount}</td>
                <td className="border p-2">{order.status?.name || "Pending"}</td>

                <td className="border p-2">
                  <select
                    onChange={(e) => handleAssignVendor(order._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.shopName}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="border p-2">
                  <button onClick={() => handleOrderDelete(order._id)} className="text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
