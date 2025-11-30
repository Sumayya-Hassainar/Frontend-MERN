// src/pages/PaymentPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectSubtotal,
  clearCart,
} from "../../redux/slice/CartSlice.jsx";
import { createOrder, createPayment } from "../../api/api.jsx";

export default function PaymentPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);

  const navigate = useNavigate();
  const location = useLocation();

  const shipping = location.state?.shipping || null;
  const totalAmount = location.state?.totalAmount ?? subtotal;

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    try {
      setLoading(true);
      setError("");

      if (!items.length) {
        setError("Your cart is empty.");
        return;
      }

      if (!shipping) {
        setError("Missing shipping details. Please go back to checkout.");
        return;
      }

      // ✅ Normalize shipping address in the format backend expects
      const shippingAddress = {
        fullName: shipping.name,
        phone: shipping.phone,
        street: shipping.addressLine1,
        city: shipping.city,
        state: shipping.state,
        country: "India", // or take from shipping.country if you add it
        pincode: shipping.pincode,
      };

      // ✅ Build products in the format backend expects
      const products = items.map((i) => ({
        product: i.product._id, // adjust if your cart shape is different
        quantity: i.quantity,
        price: i.product.price,
      }));

      // 1) Create order in backend
      const orderPayload = {
        vendor: null,
        products,
        shippingAddress,
        totalAmount,
        paymentMethod,
      };

      const newOrder = await createOrder(orderPayload);

      // 2) Create payment entry (fake / simulated)
      const paymentPayload = {
        order: newOrder._id,
        vendor: null,
        amount: totalAmount,
        paymentMethod,
      };
      await createPayment(paymentPayload);

      // 3) Clear cart & go to orders page
      dispatch(clearCart());
      navigate("/orders");
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!shipping) {
    // if user opens /payment directly without going through checkout
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-sm text-red-600 mb-2">
          Shipping details not found. Please complete checkout first.
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="text-sm text-indigo-600 underline"
        >
          Go to Checkout
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Payment</h1>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {/* Shipping summary */}
      <div className="bg-white rounded-lg border p-4 mb-4">
        <h2 className="text-sm font-semibold mb-2">Shipping Address</h2>
        <p className="text-sm font-medium">{shipping.name}</p>
        <p className="text-sm">{shipping.addressLine1}</p>
        <p className="text-sm">
          {shipping.city}, {shipping.state} - {shipping.pincode}
        </p>
        <p className="text-sm">Phone: {shipping.phone}</p>
      </div>

      {/* Order amount */}
      <div className="bg-white rounded-lg border p-4 mb-4">
        <h2 className="text-sm font-semibold mb-2">Order Amount</h2>
        <p className="text-lg font-bold">₹{totalAmount.toFixed(2)}</p>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg border p-4 mb-4">
        <h2 className="text-sm font-semibold mb-2">Payment Method</h2>
        <label className="flex items-center gap-2 text-sm mb-2">
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </label>
        <label className="flex items-center gap-2 text-sm mb-2">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Card / UPI (Simulated)
        </label>
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium w-full"
      >
        {loading
          ? "Processing..."
          : paymentMethod === "cod"
          ? "Place Order (COD)"
          : "Pay & Place Order"}
      </button>
    </div>
  );
}
