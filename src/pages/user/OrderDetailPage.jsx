// src/pages/user/OrderDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrderById } from "../../api/api.jsx";
import OrderTrackingSteps from "../../components/OrderTrackingSteps.jsx";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        if (!orderId) {
          setError("No Order ID in URL");
          setLoading(false);
          return;
        }
        setLoading(true);
        const data = await fetchOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Fetch order error:", err);
        setError(err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) return <p className="p-4">Loading order details...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!order) return <p className="p-4">Order not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        className="text-sm text-blue-600 mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1 className="text-xl font-semibold mb-4">
        Order #{order._id.slice(-6)}
      </h1>

      {/* Tracking section */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <h2 className="font-semibold text-lg mb-1">Tracking</h2>
        <p className="text-sm text-gray-600 mb-2">
          Current Status: <span className="font-medium">{order.orderStatus}</span>
        </p>

        {/* show steps based on order.orderStatus */}
        <OrderTrackingSteps currentStatus={order.orderStatus} />

        {/* Optional tracking text from backend */}
        {order.trackingStatus && (
          <p className="text-xs text-gray-500 mt-3">
            {order.trackingStatus}
          </p>
        )}
      </div>

      {/* Order Info */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <h2 className="font-semibold text-lg mb-2">Order Info</h2>
        <p>
          <strong>Payment Method:</strong> {order.paymentMethod}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹{order.totalAmount}
        </p>
        <p>
          <strong>Placed On:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Shipping Address */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <h2 className="font-semibold text-lg mb-2">Shipping Address</h2>
        <p>{order.shippingAddress?.fullName}</p>
        <p>{order.shippingAddress?.phone}</p>
        <p>
          {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
          {order.shippingAddress?.state}
        </p>
        <p>
          {order.shippingAddress?.country} - {order.shippingAddress?.pincode}
        </p>
      </div>

      {/* Products */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <h2 className="font-semibold text-lg mb-2">Products</h2>
        {order.products?.map((item) => (
          <div
            key={item._id}
            className="flex justify-between mb-2 border-b pb-2 text-sm"
          >
            <div>
              <p>{item.product?.name || "Product"}</p>
              <p className="text-xs text-gray-500">
                Qty: {item.quantity} × ₹{item.price}
              </p>
            </div>
            <p className="font-medium">₹{item.quantity * item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
