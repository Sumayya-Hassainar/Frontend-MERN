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

  const images = product.images?.length
    ? product.images
    : ["https://via.placeholder.com/400x400?text=No+Image"];

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const price = product.discountPrice || product.price || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-sm">

        {/* ===== IMAGE SLIDER ===== */}
        <div className="relative">
          <img
            src={images[activeImage]}
            alt={product.name}
            className="w-full h-80 object-cover rounded transition-all duration-300"
          />

          {/* Prev Button */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 px-3 py-1 rounded-full shadow"
            >
              ‹
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 px-3 py-1 rounded-full shadow"
            >
              ›
            </button>
          )}

          {/* Wishlist Icon */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow hover:bg-white"
          >
            <span className={wishlisted ? "text-red-500 text-xl" : "text-gray-400 text-xl"}>
              {wishlisted ? "❤️" : "🤍"}
            </span>
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === activeImage ? "bg-gray-800" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ===== PRODUCT DETAILS ===== */}
        <div>
          <h1 className="text-xl font-semibold mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < Math.round(product.rating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
            <span className="text-sm text-gray-600">
              ({product.numReviews || product.reviews?.length || 0} reviews)
            </span>
          </div>

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

          {/* ===== REVIEWS ===== */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Reviews:</h3>
              <ul className="space-y-2">
                {product.reviews.map((review) => (
                  <li key={review._id} className="border p-2 rounded-md bg-gray-50">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < review.rating ? "text-yellow-400" : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-sm text-gray-500">
                        by {review.userName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
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
