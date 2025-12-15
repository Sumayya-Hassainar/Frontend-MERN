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

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  /* ================= VALIDATION ================= */
  const validateShipping = () => {
    if (!shipping.name.trim()) return "Full Name is required";
    if (!shipping.phone.trim()) return "Phone is required";
    if (!/^\d{10}$/.test(shipping.phone)) return "Phone must be 10 digits";
    if (!shipping.addressLine1.trim()) return "Address is required";
    if (!shipping.city.trim()) return "City is required";
    if (!shipping.state.trim()) return "State is required";
    if (!shipping.pincode.trim()) return "Pincode is required";
    if (!/^\d{6}$/.test(shipping.pincode)) return "Pincode must be 6 digits";
    return null;
  };

  const handleProceedPayment = (e) => {
    e.preventDefault();
    setError("");

    if (!items.length) {
      setError("Cart is empty");
      return;
    }

    const validationError = validateShipping();
    if (validationError) {
      setError(validationError);
      return;
    }

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

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-[2fr,1fr] gap-6">
        {/* Left: shipping form */}
        <form
          onSubmit={handleProceedPayment}
          className="space-y-3 bg-white p-4 rounded-lg border"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              value={shipping.name}
              required
              className="border p-2 w-full text-sm rounded"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              value={shipping.phone}
              required
              className="border p-2 w-full text-sm rounded"
            />
          </div>

          <div>
            <label
              htmlFor="addressLine1"
              className="block text-sm font-medium mb-1"
            >
              Address
            </label>
            <input
              id="addressLine1"
              name="addressLine1"
              placeholder="Address"
              onChange={handleChange}
              value={shipping.addressLine1}
              required
              className="border p-2 w-full text-sm rounded"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              City
            </label>
            <input
              id="city"
              name="city"
              placeholder="City"
              onChange={handleChange}
              value={shipping.city}
              required
              className="border p-2 w-full text-sm rounded"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-1">
              State
            </label>
            <input
              id="state"
              name="state"
              placeholder="State"
              onChange={handleChange}
              value={shipping.state}
              required
              className="border p-2 w-full text-sm rounded"
            />
          </div>

          <div>
            <label htmlFor="pincode" className="block text-sm font-medium mb-1">
              Pincode
            </label>
            <input
              id="pincode"
              name="pincode"
              placeholder="Pincode"
              onChange={handleChange}
              value={shipping.pincode}
              required
              className="border p-2 w-full text-sm rounded"
            />
          </div>

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
