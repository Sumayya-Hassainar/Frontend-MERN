// src/pages/vendor/VendorDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  fetchCategories,
  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
} from "../../api/vendorApi";

export default function VendorDashboard() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const loadData = async (categoryFilter) => {
    try {
      setLoading(true);
      const [cats, prods] = await Promise.all([
        fetchCategories(),
        getVendorProducts(categoryFilter),
      ]);

      setCategories(Array.isArray(cats) ? cats : cats.categories || []);
      setProducts(Array.isArray(prods) ? prods : prods.products || []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load vendor dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedCategoryFilter);
  }, [selectedCategoryFilter]);

  const handleOpenCreate = () => {
    resetForm();
    setFormOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category?._id || product.category || "",
      price: product.price || "",
      discountPrice: product.discountPrice || "",
      stock: product.stock || "",
      isActive: product.isActive ?? true,
      images: [],
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteVendorProduct(id);
      await loadData(selectedCategoryFilter);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete product");
    }
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
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("price", form.price);
      fd.append("discountPrice", form.discountPrice);
      fd.append("stock", form.stock);
      fd.append("isActive", form.isActive);

      if (form.images && form.images.length > 0) {
        Array.from(form.images).forEach((file) => {
          fd.append("images", file);
        });
      }

      if (editingProduct) {
        await updateVendorProduct(editingProduct._id, fd);
      } else {
        await createVendorProduct(fd);
      }

      setFormOpen(false);
      resetForm();
      await loadData(selectedCategoryFilter);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-2">Vendor Dashboard</h1>
      <p className="text-gray-600 text-sm mb-4">
        Manage your products and see only your own listings.
      </p>

      {/* Top actions */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter by category:</span>
          <select
            className="border px-2 py-1 text-sm rounded-md"
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-500">
          No products found. Click &quot;Add Product&quot; to create your first one.
        </p>
      ) : (
        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Image</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-right">Price</th>
                <th className="px-3 py-2 text-right">Stock</th>
                <th className="px-3 py-2 text-center">Active</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="px-3 py-2">
                    {p.images && p.images[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {p.description}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {p.category?.name || "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    ₹{p.discountPrice || p.price}
                    {p.discountPrice && (
                      <span className="ml-1 text-[10px] text-gray-400 line-through">
                        ₹{p.price}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">{p.stock}</td>
                  <td className="px-3 py-2 text-center">
                    {p.isActive ? (
                      <span className="text-xs text-green-600">Yes</span>
                    ) : (
                      <span className="text-xs text-red-500">No</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-xs px-2 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50"
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

      {/* Product Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                className="text-gray-500 text-sm"
              >
                ✕
              </button>
            </div>

            <form className="space-y-3" onSubmit={handleFormSubmit}>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Product name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Short description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Discount Price (optional)
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={form.discountPrice}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="isActive"
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleFormChange}
                  className="h-4 w-4"
                />
                <label htmlFor="isActive" className="text-sm">
                  Active
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Images
                </label>
                <input
                  type="file"
                  name="images"
                  multiple
                  onChange={handleFormChange}
                  className="w-full text-sm"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  You can upload one or more product images.
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    resetForm();
                  }}
                  className="px-3 py-2 text-sm border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
