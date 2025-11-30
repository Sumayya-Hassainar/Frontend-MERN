// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const image =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition block"
    >
      <div className="h-40 w-full bg-gray-100">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {product.category?.name || product.category || "Category"}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price}
          </span>
          {product.discountPrice && (
            <span className="text-xs text-green-600 font-medium">
              Offer ₹{product.discountPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

