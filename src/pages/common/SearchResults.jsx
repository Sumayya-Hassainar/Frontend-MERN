// src/pages/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchProducts } from "../../api/api";
import ProductCard from "../../components/ProductCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery();
  const q = (query.get("q") || "").toLowerCase();

  const [allProducts, setAllProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setAllProducts(data);
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
    if (!q) {
      setFiltered(allProducts);
    } else {
      const match = allProducts.filter((p) =>
        p.name?.toLowerCase().includes(q)
      );
      setFiltered(match);
    }
  }, [q, allProducts]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-600">Searching products…</p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-3">
        Search results for "{q || "All"}"
      </h1>

      {filtered.length === 0 ? (
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
  );
}
