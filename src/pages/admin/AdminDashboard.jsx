// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  fetchVendors,
  createVendor,
  updateVendor,
  deleteVendor,
  fetchOrderStatuses,
  createOrderStatus,
  updateOrderStatus,
  deleteOrderStatus,
} from "../../api/adminapi"; // ⬅️ path updated (../ instead of ../../)

// All allowed status names as per OrderStatus enum
const ORDER_STATUS_OPTIONS = [
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
  "Refunded",
];

export default function AdminDashboard() {
  // ---------- Vendor state ----------
  const [vendors, setVendors] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorError, setVendorError] = useState("");

  const [vendorForm, setVendorForm] = useState({
    name: "",
    email: "",
    shopName: "",
  });
  const [editingVendorId, setEditingVendorId] = useState(null);

  // ---------- Order status state ----------
  const [statuses, setStatuses] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  const [statusForm, setStatusForm] = useState({
    name: "",
    description: "",
  });
  const [editingStatusId, setEditingStatusId] = useState(null);

  // ---------- Load vendors ----------
  const loadVendors = async () => {
    setVendorLoading(true);
    setVendorError("");
    try {
      const data = await fetchVendors();
      // backend may return array OR { vendors: [...] }
      setVendors(Array.isArray(data) ? data : data.vendors || []);
    } catch (err) {
      console.error("Fetch vendors error:", err);
      setVendorError(err.message || "Failed to fetch vendors");
    } finally {
      setVendorLoading(false);
    }
  };

  // ---------- Load order statuses ----------
  const loadStatuses = async () => {
    setStatusLoading(true);
    setStatusError("");
    try {
      const data = await fetchOrderStatuses();
      // backend may return array OR { statuses: [...] }
      setStatuses(Array.isArray(data) ? data : data.statuses || []);
    } catch (err) {
      console.error("Fetch order statuses error:", err);
      setStatusError(err.message || "Failed to fetch order statuses");
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
    loadStatuses();
  }, []);

  // ---------- Vendor handlers ----------
  const handleVendorChange = (e) => {
    setVendorForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    setVendorError("");
    try {
      if (editingVendorId) {
        await updateVendor(editingVendorId, vendorForm);
      } else {
        await createVendor(vendorForm);
      }
      setVendorForm({ name: "", email: "", shopName: "" });
      setEditingVendorId(null);
      await loadVendors();
    } catch (err) {
      console.error("Save vendor error:", err);
      setVendorError(err.message || "Failed to save vendor");
    }
  };

  const handleVendorEdit = (vendor) => {
    setEditingVendorId(vendor._id);
    setVendorForm({
      name: vendor.name || "",
      email: vendor.email || "",
      shopName: vendor.shopName || "",
    });
  };

  const handleVendorDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    setVendorError("");
    try {
      await deleteVendor(id);
      await loadVendors();
    } catch (err) {
      console.error("Delete vendor error:", err);
      setVendorError(err.message || "Failed to delete vendor");
    }
  };

  const handleVendorCancelEdit = () => {
    setEditingVendorId(null);
    setVendorForm({ name: "", email: "", shopName: "" });
  };

  // ---------- Status handlers ----------
  const handleStatusChange = (e) => {
    setStatusForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setStatusError("");
    try {
      if (editingStatusId) {
        await updateOrderStatus(editingStatusId, statusForm);
      } else {
        await createOrderStatus(statusForm);
      }
      setStatusForm({ name: "", description: "" });
      setEditingStatusId(null);
      await loadStatuses();
    } catch (err) {
      console.error("Save order status error:", err);
      setStatusError(err.message || "Failed to save order status");
    }
  };

  const handleStatusEdit = (status) => {
    setEditingStatusId(status._id);
    setStatusForm({
      name: status.name || "",
      description: status.description || "",
    });
  };

  const handleStatusDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this status?")) return;
    setStatusError("");
    try {
      await deleteOrderStatus(id);
      await loadStatuses();
    } catch (err) {
      console.error("Delete order status error:", err);
      setStatusError(err.message || "Failed to delete order status");
    }
  };

  const handleStatusCancelEdit = () => {
    setEditingStatusId(null);
    setStatusForm({ name: "", description: "" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Admin Dashboard</h1>
        <p className="text-gray-600 text-sm">
          Only logged-in admins can access this page and manage vendors & order statuses.
        </p>
      </div>

      {/* ---------- VENDOR SECTION ---------- */}
      <section className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Vendor Management</h2>
          {vendorLoading && (
            <span className="text-xs text-gray-500">Loading vendors...</span>
          )}
        </div>

        {vendorError && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
            {vendorError}
          </div>
        )}

        {/* Vendor Form */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">
            {editingVendorId ? "Edit Vendor" : "update Vendor"}
          </h3>
          <form
            onSubmit={handleVendorSubmit}
            className="grid gap-3 md:grid-cols-3"
          >
            <input
              name="name"
              placeholder="Vendor Name"
              value={vendorForm.name}
              onChange={handleVendorChange}
              required
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              name="email"
              placeholder="Vendor Email"
              type="email"
              value={vendorForm.email}
              onChange={handleVendorChange}
              required
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              name="shopName"
              placeholder="Shop Name"
              value={vendorForm.shopName}
              onChange={handleVendorChange}
              className="border rounded px-3 py-2 text-sm"
            />

            <div className="flex items-center gap-2 md:col-span-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                {editingVendorId ? "Update Vendor" : "edit Vendor"}
              </button>
              {editingVendorId && (
                <button
                  type="button"
                  onClick={handleVendorCancelEdit}
                  className="text-sm px-3 py-2 rounded-md border"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Vendor Table */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Vendors</h3>
          {vendors.length === 0 ? (
            <p className="text-sm text-gray-600">No vendors found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border px-3 py-2 text-left">Name</th>
                    <th className="border px-3 py-2 text-left">Email</th>
                    <th className="border px-3 py-2 text-left">Shop</th>
                    <th className="border px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v) => (
                    <tr key={v._id}>
                      <td className="border px-3 py-2">{v.name}</td>
                      <td className="border px-3 py-2">{v.email}</td>
                      <td className="border px-3 py-2">
                        {v.shopName || "-"}
                      </td>
                      <td className="border px-3 py-2">
                        <button
                          onClick={() => handleVendorEdit(v)}
                          className="text-xs text-indigo-600 mr-3 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleVendorDelete(v._id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ---------- ORDER STATUS SECTION ---------- */}
      <section className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Order Status Management</h2>
          {statusLoading && (
            <span className="text-xs text-gray-500">Loading statuses...</span>
          )}
        </div>

        {statusError && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
            {statusError}
          </div>
        )}

        {/* Status Form */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">
            {editingStatusId ? "Edit Status" : "Add Status"}
          </h3>
          <form
            onSubmit={handleStatusSubmit}
            className="grid gap-3 md:grid-cols-3"
          >
            {/* Use dropdown to match enum exactly */}
            <select
              name="name"
              value={statusForm.name}
              onChange={handleStatusChange}
              required
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Select Status</option>
              {ORDER_STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <input
              name="description"
              placeholder="Description (optional)"
              value={statusForm.description}
              onChange={handleStatusChange}
              className="border rounded px-3 py-2 text-sm md:col-span-2"
            />

            <div className="flex items-center gap-2 md:col-span-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                {editingStatusId ? "Update Status" : "Create Status"}
              </button>
              {editingStatusId && (
                <button
                  type="button"
                  onClick={handleStatusCancelEdit}
                  className="text-sm px-3 py-2 rounded-md border"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Status Table */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Order Statuses</h3>
          {statuses.length === 0 ? (
            <p className="text-sm text-gray-600">No statuses found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border px-3 py-2 text-left">Name</th>
                    <th className="border px-3 py-2 text-left">Description</th>
                    <th className="border px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {statuses.map((s) => (
                    <tr key={s._id}>
                      <td className="border px-3 py-2">{s.name}</td>
                      <td className="border px-3 py-2">
                        {s.description || "-"}
                      </td>
                      <td className="border px-3 py-2">
                        <button
                          onClick={() => handleStatusEdit(s)}
                          className="text-xs text-indigo-600 mr-3 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleStatusDelete(s._id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
