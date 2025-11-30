// src/pages/CartPage.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectSavedItems,
  selectSubtotal,
  updateQuantity,
  removeItem,
  moveToSaveLater,
  moveToCartFromSaved,
} from "../../redux/slice/CartSlice.jsx";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = useSelector(selectCartItems);
  const savedItems = useSelector(selectSavedItems);
  const subtotal = useSelector(selectSubtotal);

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }
    // ✅ must match your Route path
    navigate("/checkout");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">Your Cart</h1>

      {items.length === 0 ? (
        <div className="bg-white border rounded-lg p-4 text-sm text-gray-600">
          Your cart is empty.{" "}
          <Link to="/products" className="text-indigo-600 hover:underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[2fr,1fr] gap-6">
          {/* Cart items */}
          <div className="space-y-4">
            {items.map((item) => {
              const p = item.product;
              const price = p?.discountPrice || p?.price || 0;

              return (
                <div
                  key={p?._id}
                  className="flex gap-4 bg-white border rounded-lg p-3"
                >
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={
                        p?.images?.[0] ||
                        "https://via.placeholder.com/80x80?text=No+Image"
                      }
                      alt={p?.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-sm font-medium line-clamp-2">
                      {p?.name}
                    </h2>
                    <p className="text-xs text-gray-500 mb-1">
                      {p?.category?.name || p?.category || "Category"}
                    </p>

                    <div className="flex items-center gap-3 text-sm mb-2">
                      <span className="font-semibold">₹{price}</span>
                      {p?.discountPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{p?.price}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center border rounded overflow-hidden">
                        <button
                          type="button"
                          className="px-2 py-1 text-gray-600"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: p._id,
                                quantity: Math.max(1, item.quantity - 1),
                              })
                            )
                          }
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          type="button"
                          className="px-2 py-1 text-gray-600"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: p._id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="text-indigo-600 hover:underline"
                        onClick={() => dispatch(moveToSaveLater(p._id))}
                      >
                        Save for later
                      </button>

                      <button
                        type="button"
                        className="text-red-500 hover:underline"
                        onClick={() => dispatch(removeItem(p._id))}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-white border rounded-lg p-4 h-fit">
            <h2 className="text-sm font-semibold mb-3">Order Summary</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Taxes and shipping will be calculated at checkout.
            </p>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2 rounded-md"
            >
              Proceed to Buy
            </button>
          </div>
        </div>
      )}

      {savedItems.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold mb-3">Saved for later</h2>
          <div className="space-y-3">
            {savedItems.map((item) => {
              const p = item.product;
              const price = p?.discountPrice || p?.price || 0;
              return (
                <div
                  key={p?._id}
                  className="flex gap-4 bg-white border rounded-lg p-3"
                >
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={
                        p?.images?.[0] ||
                        "https://via.placeholder.com/80x80?text=No+Image"
                      }
                      alt={p?.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium line-clamp-2">
                      {p?.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm mb-1">
                      <span className="font-semibold">₹{price}</span>
                    </div>
                    <button
                      type="button"
                      className="text-indigo-600 text-xs hover:underline"
                      onClick={() => dispatch(moveToCartFromSaved(p._id))}
                    >
                      Move to cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
