// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchProductById } from "../../api/api.jsx";
import { addItem } from "../../redux/slice/CartSlice.jsx";
import { toggleWishlistItem } from "../../redux/slice/WishlistSlice.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const wishlistItems = useSelector((state) => state.wishlist.items || []);

  const wishlisted = product
    ? wishlistItems.some((p) => p._id === product._id)
    : false;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!product) return <p className="p-4">Product not found</p>;

  // ✅ CartSlice expects just product
  const handleAddToCart = () => {
    dispatch(addItem(product));
    alert("Added to cart!");
  };

  // ✅ Buy now -> add to cart & go to /cart
  const handleBuyNow = () => {
    dispatch(addItem(product));   // just product
    navigate("/cart");            // go to cart page
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlistItem(product));
  };

  const price = product.discountPrice || product.price || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <img
            src={
              product.images?.[0] ||
              "https://via.placeholder.com/400x400?text=No+Image"
            }
            alt={product.name}
            className="w-full h-80 object-cover rounded"
          />

          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow hover:bg-white"
            title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <span
              className={
                wishlisted ? "text-red-500 text-xl" : "text-gray-400 text-xl"
              }
            >
              {wishlisted ? "❤️" : "🤍"}
            </span>
          </button>
        </div>

        <div>
          <h1 className="text-xl font-semibold mb-2">{product.name}</h1>
          <p className="text-sm text-gray-600 mb-3">{product.description}</p>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold">₹{price}</span>
            {product.discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          <div className="flex gap-3 mb-3">
            <button
              onClick={handleAddToCart}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Buy Now
            </button>
          </div>

          <button
            onClick={handleToggleWishlist}
            className="text-sm text-red-500 hover:underline"
          >
            {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
