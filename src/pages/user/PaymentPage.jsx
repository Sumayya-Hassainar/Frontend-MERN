// src/pages/user/PaymentPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  selectCartItems,
  selectSubtotal,
  clearCart,
} from "../../redux/slice/CartSlice";

import { createOrder, createOnlinePayment } from "../../api/api";

export default function PaymentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);

  const shipping = location.state?.shipping;
  const totalAmount = Number(location.state?.totalAmount ?? subtotal);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handlePay = async () => {
    if (!items.length) return setError("Your cart is empty");
    if (!shipping) return setError("Shipping details missing");

    setLoading(true);
    setError("");

    try {
      const products = items.map((i) => ({
        product: i.product._id,
        quantity: i.quantity,
        price: i.product.price,
      }));

      // Create order
      const order = await createOrder({
        products,
        shippingAddress: {
          fullName: shipping.name,
          phone: shipping.phone,
          street: shipping.addressLine1,
          city: shipping.city,
          state: shipping.state,
          pincode: shipping.pincode,
          country: "India",
        },
        totalAmount,
        paymentMethod,
      });

      if (!order?._id) throw new Error("Order creation failed");

      if (paymentMethod === "cod") {
        // COD: show confirmation first
        setOrderSuccess(order);
        dispatch(clearCart());
      } else {
        // Online payment
        const session = await createOnlinePayment(order._id);
        if (session?.url) {
          window.location.href = session.url;
        } else {
          throw new Error("Failed to create payment session");
        }
      }
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // COD confirmation screen
  if (orderSuccess && paymentMethod === "cod") {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6 text-center">
        <h1 className="text-2xl font-semibold text-green-600">Order Placed!</h1>
        <p className="text-gray-700">
          Your order <span className="font-medium">#{orderSuccess._id}</span> has been placed successfully.
        </p>
        <p className="text-gray-600">
          Total Amount: ₹{orderSuccess.totalAmount.toFixed(2)}
        </p>
        <div className="bg-white border rounded-lg p-5 text-left">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h2>
          <p className="font-medium">{orderSuccess.shippingAddress.fullName}</p>
          <p className="text-sm text-gray-600">{orderSuccess.shippingAddress.street}</p>
          <p className="text-sm text-gray-600">
            {orderSuccess.shippingAddress.city}, {orderSuccess.shippingAddress.state} - {orderSuccess.shippingAddress.pincode}
          </p>
          <p className="text-sm text-gray-600">Phone: {orderSuccess.shippingAddress.phone}</p>
        </div>
        <button
          onClick={() => navigate("/orders", { state: { newOrder: orderSuccess } })}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium"
        >
          View My Orders
        </button>
      </div>
    );
  }

  // Normal checkout page
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h2>
        <p className="font-medium">{shipping?.name}</p>
        <p className="text-sm text-gray-600">{shipping?.addressLine1}</p>
        <p className="text-sm text-gray-600">{shipping?.city}, {shipping?.state} - {shipping?.pincode}</p>
        <p className="text-sm text-gray-600">Phone: {shipping?.phone}</p>
      </div>

      <div className="bg-white border rounded-lg p-5 flex justify-between">
        <span className="text-sm text-gray-700">Total Amount</span>
        <span className="text-xl font-bold">₹{totalAmount.toFixed(2)}</span>
      </div>

      <div className="bg-white border rounded-lg p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">Payment Method</h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="text-sm">Cash on Delivery</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            value="online"
            checked={paymentMethod === "online"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="text-sm">Card / UPI</span>
        </label>
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium disabled:opacity-60"
      >
        {loading
          ? "Processing..."
          : paymentMethod === "cod"
          ? "Place Order"
          : "Confirm & Pay"}
      </button>
    </div>
  );
}
