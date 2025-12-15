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
  const [activeImage, setActiveImage] = useState(0);

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

  /* ================= HELPERS ================= */

  const getStarColor = (rating) => {
    if (rating >= 4) return "text-green-500";
    if (rating === 3) return "text-yellow-400";
    return "text-red-500";
  };

  const averageRating = Math.round(product.rating || 0);
  const ratingPercentage = Math.round((averageRating / 5) * 100);

  const images = product.images?.length
    ? product.images
    : ["https://via.placeholder.com/400x400?text=No+Image"];

  const price = product.discountPrice || product.price || 0;

  /* ================= ACTIONS ================= */

  const handleAddToCart = () => {
    dispatch(addItem(product));
    alert("Added to cart!");
  };

  const handleBuyNow = () => {
    dispatch(addItem(product));
    navigate("/cart");
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlistItem(product));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-sm">

        {/* ===== IMAGE ===== */}
        <div className="relative">
          <img
            src={images[activeImage]}
            alt={product.name}
            className="w-full h-80 object-cover rounded"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImage((p) => (p - 1 + images.length) % images.length)
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 px-3 py-1 rounded"
              >
                ‹
              </button>

              <button
                onClick={() =>
                  setActiveImage((p) => (p + 1) % images.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 px-3 py-1 rounded"
              >
                ›
              </button>
            </>
          )}

          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 bg-white p-2 rounded-full"
          >
            {wishlisted ? "❤️" : "🤍"}
          </button>
        </div>

        {/* ===== DETAILS ===== */}
        <div>
          <h1 className="text-xl font-semibold mb-2">{product.name}</h1>

          {/* ===== PRODUCT RATING ===== */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < averageRating
                      ? getStarColor(averageRating)
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}

              <span className="text-sm text-gray-600">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            <div className="text-sm text-gray-500 mt-1">
              {ratingPercentage}% positive ratings
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3">{product.description}</p>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold">₹{price}</span>
            {product.discountPrice && (
              <span className="line-through text-gray-400">
                ₹{product.price}
              </span>
            )}
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={handleAddToCart}
              className="bg-amber-500 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Buy Now
            </button>
          </div>

          {/* ===== REVIEWS ===== */}
          {product.reviews?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Customer Reviews</h3>

              <ul className="space-y-2">
                {product.reviews.map((review) => (
                  <li key={review._id} className="border p-2 rounded bg-gray-50">
                    <div className="flex gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < review.rating
                              ? getStarColor(review.rating)
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-sm text-gray-500 ml-2">
                        {review.userName}
                      </span>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
