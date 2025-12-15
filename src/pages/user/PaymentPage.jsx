import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  selectCartItems,
  selectSubtotal,
  clearCart,
} from "../../redux/slice/CartSlice";

import { createOrder, createPayment, createOnlinePayment } from "../../api/api";

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

      // 1️⃣ Create order
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

      // 2️⃣ Payment handling
      if (paymentMethod === "cod") {
        // COD
        await createPayment({
          orderId: order._id,
          amount: totalAmount,
          paymentMethod,
        });
        dispatch(clearCart());
        navigate("/orders");
      } else {
        // Online / Stripe payment
        const session = await createOnlinePayment(order._id);
          console.log("Stripe session:", session); 
        if (session?.url) {
          window.location.href = session.url; // redirect to Stripe checkout
        } else {
          throw new Error("Failed to create Stripe session");
        }
      }
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* ================= SHIPPING ================= */}
      <div className="bg-white border rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Shipping Address
        </h2>
        <p className="font-medium">{shipping?.name}</p>
        <p className="text-sm text-gray-600">{shipping?.addressLine1}</p>
        <p className="text-sm text-gray-600">
          {shipping?.city}, {shipping?.state} - {shipping?.pincode}
        </p>
        <p className="text-sm text-gray-600">Phone: {shipping?.phone}</p>
      </div>

      {/* ================= AMOUNT ================= */}
      <div className="bg-white border rounded-lg p-5 flex justify-between">
        <span className="text-sm text-gray-700">Total Amount</span>
        <span className="text-xl font-bold">₹{totalAmount.toFixed(2)}</span>
      </div>

      {/* ================= PAYMENT METHOD ================= */}
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

      {/* ================= ACTION ================= */}
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
