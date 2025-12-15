/* ========================== VendorDashboard.jsx ========================== */
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
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [error, setError] = useState("");

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

  /* ================= LOAD DATA ================= */
  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const [cats, prods] = await Promise.all([fetchCategories(), getVendorProducts()]);
      setCategories(cats?.categories || cats || []);
      setProducts(prods?.products || prods || []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= FORM HANDLERS ================= */
  const resetForm = () => {
    setEditingProduct(null);
    setError("");
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
    if (type === "checkbox") setForm((prev) => ({ ...prev, [name]: checked }));
    else if (type === "file") setForm((prev) => ({ ...prev, images: files }));
    else setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    if (!form.name.trim()) return "Product name is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.category) return "Category is required";

    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) return "Price must be a positive number";

    if (form.discountPrice) {
      const discountNum = parseFloat(form.discountPrice);
      if (isNaN(discountNum) || discountNum < 0) return "Discount price must be positive";
      if (discountNum > priceNum) return "Discount price cannot exceed original price";
    }

    const stockNum = parseInt(form.stock);
    if (isNaN(stockNum) || stockNum < 0) return "Stock must be a non-negative integer";

    if (!editingProduct && (!form.images || form.images.length === 0))
      return "At least one product image is required";

    return null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSavingProduct(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "images") Array.from(form.images).forEach((img) => fd.append("images", img));
        else fd.append(key, form[key]);
      });

      if (editingProduct) await updateVendorProduct(editingProduct._id, fd);
      else await createVendorProduct(fd);

      setFormOpen(false);
      resetForm();
      loadProducts();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save product");
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
    setError("");
    setFormOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteVendorProduct(id);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete product");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Vendor Dashboard</h1>

      {/* PRODUCTS */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">My Products</h2>
          <button
            onClick={() => {
              resetForm();
              setFormOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            + Add Product
          </button>
        </div>

        {loadingProducts ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm rounded-lg">
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
                          className="w-12 h-12 object-cover rounded border mx-auto"
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

      {/* PRODUCT MODAL */}
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

            {error && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded">
                {error}
              </div>
            )}

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
                  required
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
                required
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
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded"
              >
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
    </div>
  );
}
