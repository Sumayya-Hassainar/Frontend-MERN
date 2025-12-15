// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchVendors, createVendor, updateVendor, deleteVendor } from "../../api/adminapi";

export default function AdminDashboard() {
  const [vendors, setVendors] = useState([]);
  const [vendorForm, setVendorForm] = useState({ userId: "", shopName: "", description: "", address: "" });
  const [editingVendorId, setEditingVendorId] = useState(null);

  // Load vendors
  const loadVendors = async () => {
    const res = await fetchVendors();
    setVendors(Array.isArray(res) ? res : res?.vendors || []);
  };

  useEffect(() => {
    loadVendors();
  }, []);

  // Vendor handlers
  const handleVendorChange = (e) => setVendorForm({ ...vendorForm, [e.target.name]: e.target.value });
  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    if (editingVendorId) await updateVendor(editingVendorId, vendorForm);
    else await createVendor(vendorForm);
    setVendorForm({ userId: "", shopName: "", description: "", address: "" });
    setEditingVendorId(null);
    loadVendors();
  };
  const handleVendorEdit = (v) => { setEditingVendorId(v._id); setVendorForm(v); };
  const handleVendorDelete = async (id) => { if (window.confirm("Delete vendor?")) { await deleteVendor(id); loadVendors(); } };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Vendor Management */}
      <section className="bg-white border rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4">Vendor Management</h2>

        <form onSubmit={handleVendorSubmit} className="grid gap-3 md:grid-cols-2">
          <input name="userId" placeholder="User ID" value={vendorForm.userId} onChange={handleVendorChange} className="border p-2 rounded" />
          <input name="shopName" placeholder="Shop Name" value={vendorForm.shopName} onChange={handleVendorChange} className="border p-2 rounded" />
          <input name="description" placeholder="Description" value={vendorForm.description} onChange={handleVendorChange} className="border p-2 rounded" />
          <input name="address" placeholder="Address" value={vendorForm.address} onChange={handleVendorChange} className="border p-2 rounded" />
          <button className="bg-indigo-600 text-white p-2 rounded col-span-2">{editingVendorId ? "Update Vendor" : "Create Vendor"}</button>
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
                  <button onClick={() => handleVendorEdit(v)} className=" text-blue-600 mr-3">Edit</button>
                  <button onClick={() => handleVendorDelete(v._id)} className=" text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Link to Orders */}
      <section className="bg-white border rounded-lg p-5 text-center">
        <h2 className="text-lg font-semibold mb-2">Order Management</h2>
        <p>Manage orders, statuses, and assign vendors on a separate page.</p>
        <button onClick={() => window.location.href="/admin/orders"} className="bg-green-600 text-white px-4 py-2 rounded mt-2">
          Go to Orders
        </button>
      </section>
    </div>
  );
}
