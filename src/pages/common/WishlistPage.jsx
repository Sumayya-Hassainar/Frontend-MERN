// src/pages/WishlistPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectWishlistItems,
  removeFromWishlist,
} from "../../redux/slice/WishlistSlice.jsx";
import { addItem } from "../../redux/slice/CartSlice.jsx";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    dispatch(addItem(product));
    dispatch(removeFromWishlist(product._id));
    navigate("/cart");
  };

  if (!items.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-3">My Wishlist</h1>
        <p className="text-gray-600 text-sm">
          Your wishlist is empty. Start adding your favourite products ❤️
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">My Wishlist</h1>
      <div className="space-y-3">
        {items.map((product) => {
          const price = product.discountPrice || product.price || 0;

          return (
            <div
              key={product._id}
              className="flex gap-4 bg-white rounded-lg shadow-sm p-3"
            >
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                <img
                  src={
                    product.images?.[0] ||
                    "https://via.placeholder.com/80x80?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-sm font-medium line-clamp-2">
                  {product.name}
                </h2>
                <p className="text-xs text-gray-500 mb-1">
                  {product.category?.name || product.category || ""}
                </p>

                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="font-semibold">₹{price}</span>
                  {product.discountPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.price}
                    </span>
                  )}
                </div>

                <div className="flex gap-3 text-xs">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() =>
                      dispatch(removeFromWishlist(product._id))
                    }
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
