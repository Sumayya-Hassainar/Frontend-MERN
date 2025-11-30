// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectSubtotal,
} from "../../redux/slice/CartSlice.jsx";

export default function CheckoutPage() {
  const navigate = useNavigate();

  // ✅ get data from Redux
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);

  const [shipping, setShipping] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleProceedPayment = (e) => {
    e.preventDefault();
    if (!items.length) return alert("Cart empty");

    navigate("/payment", {
      state: {
        shipping,
        totalAmount: subtotal,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Checkout</h1>

      <div className="grid md:grid-cols-[2fr,1fr] gap-6">
        {/* Left: shipping form */}
        <form
          onSubmit={handleProceedPayment}
          className="space-y-3 bg-white p-4 rounded-lg border"
        >
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="border p-2 w-full text-sm rounded"
          />
          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            required
            className="border p-2 w-full text-sm rounded"
          />
          <input
            name="addressLine1"
            placeholder="Address"
            onChange={handleChange}
            required
            className="border p-2 w-full text-sm rounded"
          />
          <input
            name="city"
            placeholder="City"
            onChange={handleChange}
            required
            className="border p-2 w-full text-sm rounded"
          />
          <input
            name="state"
            placeholder="State"
            onChange={handleChange}
            required
            className="border p-2 w-full text-sm rounded"
          />
          <input
            name="pincode"
            placeholder="Pincode"
            onChange={handleChange}
            required
            className="border p-2 w-full text-sm rounded"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Proceed to Payment
          </button>
        </form>

        {/* Right: order summary */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-sm font-semibold mb-3">Order Summary</h2>
          <div className="flex justify-between text-sm mb-1">
            <span>Items ({items.length})</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t pt-2 mt-2">
            <span>Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
