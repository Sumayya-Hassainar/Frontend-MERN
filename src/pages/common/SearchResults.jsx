// src/pages/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../api/api";
import ProductCard from "../../components/ProductCard";


export default function SearchResults() {
  const [allProducts, setAllProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [role, setRole] = useState("guest");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) setRole(savedRole);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        const products = Array.isArray(data) ? data : data.products || [];
        setAllProducts(products);
      } catch (err) {
        console.error("Search load error:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered(allProducts);
    } else {
      const match = allProducts.filter((p) =>
        p.name?.toLowerCase().includes(query.trim().toLowerCase())
      );
      setFiltered(match);
    }
  }, [query, allProducts]);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* ✅ HEADER WITH SEARCH ENABLED */}
      <Header
        role={role}
        setRole={setRole}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={handleMarkAsRead}
        query={query}
        setQuery={setQuery}
        showSearch={true}   // ✅ IMPORTANT
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-3">
          Search results {query && `for "${query}"`}
        </h1>

        {loading ? (
          <p className="text-sm text-gray-600">Loading products…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-600 text-sm">
            No products found for this search.
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
