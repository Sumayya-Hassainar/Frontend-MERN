import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectSubtotal,
  clearCart,
} from "../../redux/slice/CartSlice.jsx";
import {
  createOrder,
  createPayment,
  createOnlinePayment,
} from "../../api/api.jsx";

export default function PaymentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);

  const shipping = location.state?.shipping || null;
  const totalAmount = location.state?.totalAmount ?? subtotal;

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePay = async () => {
    if (!items.length) return setError("Your cart is empty.");
    if (!shipping) return setError("Shipping details are missing.");

    setLoading(true);
    setError("");

    try {
      // Prepare products payload
      const products = items.map((i) => {
        if (!i.product?._id) throw new Error("Invalid product in cart");
        return {
          product: i.product._id,
          quantity: i.quantity,
          price: i.product.price,
        };
      });

      const orderPayload = {
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
        totalAmount: Number(totalAmount),
        paymentMethod,
      };

      // Create order
      const order = await createOrder(orderPayload);
      if (!order?._id) throw new Error("Order creation failed");

      if (paymentMethod === "cod") {
        // COD Payment
        await createPayment({
          orderId: order._id,
          amount: totalAmount,
          paymentMethod: "cod",
        });
      } else {
        // Online Payment (Card / UPI)
        await createOnlinePayment({
          orderId: order._id,
          amount: totalAmount,
          paymentMethod,
        });
      }

      dispatch(clearCart());
      setOrderPlaced(true);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!shipping && !orderPlaced) {
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

  if (orderPlaced) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-500 text-white text-4xl mb-4">
          ✓
        </div>
        <h1 className="text-2xl font-semibold mb-2">Order Placed</h1>
        <p className="text-gray-600 text-sm mb-6">
          Your order has been successfully placed.
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium"
        >
          View My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold mb-2">Payment</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Shipping Card */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-2">Shipping Address</h2>
        <p className="text-sm font-medium">{shipping.name}</p>
        <p className="text-sm">{shipping.addressLine1}</p>
        <p className="text-sm">
          {shipping.city}, {shipping.state} - {shipping.pincode}
        </p>
        <p className="text-sm">Phone: {shipping.phone}</p>
      </div>

      {/* Order Amount */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-2">Order Amount</h2>
        <p className="text-lg font-bold">₹{Number(totalAmount).toFixed(2)}</p>
      </div>

      {/* Payment Method */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-2">Payment Method</h2>

        <label className="flex items-center gap-2 text-sm mb-2">
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Card / UPI
        </label>
      </div>

      {/* Pay Button */}
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
