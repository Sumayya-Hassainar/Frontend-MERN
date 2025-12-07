// src/pages/vendor/VendorDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  fetchCategories,
  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  fetchVendorOrders,
  updateVendorOrderStatus,
  createVendorOrderStatus,
} from "../../api/vendorApi";

export default function VendorDashboard() {
  /* ================= STATES ================= */
  const [categories, setCategories] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    isActive: true,
    images: [],
  });

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

  /* ================= LOAD DATA ================= */
  const loadProducts = async (categoryId) => {
    setLoadingProducts(true);
    try {
      const [cats, prods] = await Promise.all([
        fetchCategories(),
        getVendorProducts(categoryId),
      ]);
      setCategories(cats?.categories || cats || []);
      setProducts(prods?.products || prods || []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

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
    loadProducts(selectedCategoryFilter);
    loadOrders();
  }, [selectedCategoryFilter]);

  /* ================= HANDLERS ================= */
  const resetForm = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      description: "",
      category: "",
      price: "",
      discountPrice: "",
      stock: "",
      isActive: true,
      images: [],
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, images: files }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "images") {
          Array.from(form.images).forEach((img) => fd.append("images", img));
        } else {
          fd.append(key, form[key]);
        }
      });

      if (editingProduct) await updateVendorProduct(editingProduct._id, fd);
      else await createVendorProduct(fd);

      setFormOpen(false);
      resetForm();
      loadProducts(selectedCategoryFilter);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save product");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEditProduct = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      category: p.category?._id || "",
      price: p.price,
      discountPrice: p.discountPrice || "",
      stock: p.stock,
      isActive: p.isActive ?? true,
      images: [],
    });
    setFormOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteVendorProduct(id);
      loadProducts(selectedCategoryFilter);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete product");
    }
  };

  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await updateVendorOrderStatus(orderId, { status });
      loadOrders();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update order status");
    }
  };

  const handleCreateStatus = async () => {
    if (!newStatus.trim()) return;
    setCreatingStatus(true);
    try {
      await createVendorOrderStatus({ status: newStatus });
      setOrderStatusOptions((prev) => [...prev, newStatus]);
      setNewStatus("");
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
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h1>

      {/* ================= PRODUCTS ================= */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-1/3"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              resetForm();
              setFormOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
          >
            + Add Product
          </button>
        </div>

        {loadingProducts ? (
          <p className="text-gray-500">Loading products...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Image</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Active</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="p-2">
                      {p.images && p.images[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-12 object-cover mx-auto rounded-lg border"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.category?.name}</td>
                    <td className="p-2">₹{p.discountPrice || p.price}</td>
                    <td className="p-2">{p.stock}</td>
                    <td className="p-2">{p.isActive ? "Yes" : "No"}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleEditProduct(p)}
                        className="border px-2 py-1 rounded hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="border px-2 py-1 rounded text-red-600 hover:bg-red-50"
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

      {/* ================= PRODUCT MODAL ================= */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setFormOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <input
                name="name"
                placeholder="Name"
                onChange={handleFormChange}
                value={form.name}
                className="border rounded w-full p-2"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                onChange={handleFormChange}
                value={form.description}
                className="border rounded w-full p-2"
                required
              />
              <select
                name="category"
                onChange={handleFormChange}
                value={form.category}
                className="border rounded w-full p-2"
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  onChange={handleFormChange}
                  value={form.price}
                  className="border rounded p-2"
                />
                <input
                  type="number"
                  name="discountPrice"
                  placeholder="Discount Price"
                  onChange={handleFormChange}
                  value={form.discountPrice}
                  className="border rounded p-2"
                />
              </div>
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                onChange={handleFormChange}
                value={form.stock}
                className="border rounded w-full p-2"
              />
              <input
                type="file"
                multiple
                name="images"
                onChange={handleFormChange}
                className="w-full"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleFormChange}
                />
                <label>Active</label>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded">
                {savingProduct
                  ? "Saving..."
                  : editingProduct
                  ? "Update Product"
                  : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= ORDERS ================= */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">My Orders</h2>

        {/* Add New Status */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
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
                      <span className="text-xs text-gray-500">
                        {o.customer?.email}
                      </span>
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
                        onChange={(e) =>
                          handleOrderStatusChange(o._id, e.target.value)
                        }
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
    </div>
  );
}
