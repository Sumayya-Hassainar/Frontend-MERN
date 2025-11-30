// src/pages/Products.jsx  OR  ProductsPage.jsx
import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../api/api";   // ✅ use fetchProducts
import ProductCard from "../../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();   // ✅ call fetchProducts
        setProducts(data);
      } catch (err) {
        console.error("Products error:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-600">Loading products…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-2">All Products</h1>
        <p className="text-gray-600 text-sm">
          No products found. Please add products from vendor dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">All Products</h1>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
