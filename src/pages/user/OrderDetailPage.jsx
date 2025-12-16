import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import { fetchOrderById } from "../../api/api.jsx";
import OrderTrackingSteps from "../../components/OrderTrackingSteps.jsx";
import ReviewForm from "../../components/reviewsection/ReviewForm.jsx";

/* ================= STAR DISPLAY ================= */
function StarDisplay({ count = 5 }) {
  return (
    <div className="flex gap-1">
      {[...Array(count)].map((_, i) => (
        <span key={i} className="text-yellow-400 text-xl">★</span>
      ))}
    </div>
  );
}

/* ================= DELIVERED REVIEW SECTION ================= */
function DeliveredReviewSection({ order }) {
  const reviewRef = useRef(null);
  const [showReviews, setShowReviews] = useState(false);

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-3 bg-green-50 p-3 rounded">
        <StarDisplay />
        <div>
          <p className="font-medium text-green-700">Order Delivered Successfully</p>
          <p className="text-xs text-gray-600">Share your experience with the product</p>
        </div>
      </div>

      {!showReviews && (
        <button
          onClick={() => {
            setShowReviews(true);
            setTimeout(() => reviewRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm"
        >
          Complete your feedback
        </button>
      )}

      {showReviews && (
        <div ref={reviewRef} className="space-y-4">
          <h2 className="text-lg font-semibold">Rate & Review</h2>
          {order.products?.map((item) => (
            <div key={item._id} className="border rounded p-3">
              <p className="font-medium mb-2">{item.product?.name || "Product deleted"}</p>
              {item.product?._id && <ReviewForm productId={item.product._id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= SOCKET ================= */
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ================= PAGE ================= */
export default function OrderDetailPage() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("Invalid order ID");
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        setLoading(true);
        const res = await fetchOrderById(orderId);
        if (!res.success) throw new Error("Order not found");
        setOrder(res.order);

        setTimeline([{ status: res.order.status || "Pending", createdAt: new Date() }]);
      } catch (err) {
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  /* SOCKET TRACKING */
  useEffect(() => {
    if (!orderId) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;
    socket.emit("joinOrderRoom", orderId);

    socket.on("orderStatusUpdated", (payload) => {
      if (payload?.orderId !== orderId) return;
      setTimeline(payload.timeline || []);
      setOrder((prev) => prev ? { ...prev, status: payload.status } : prev);
    });

    // simulate frontend timeline
    const statuses = ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered"];
    let index = 1;
    const interval = setInterval(() => {
      if (index >= statuses.length) return clearInterval(interval);
      const status = statuses[index];
      setTimeline((prev) => [...prev, { status, createdAt: new Date() }]);
      setOrder((prev) => prev ? { ...prev, status } : prev);
      index++;
    }, 8000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [orderId]);

  if (loading) return <p className="p-4">Loading order details…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!order) return <p className="p-4">Order not found</p>;

  const latestStatus = timeline.length > 0 ? timeline[timeline.length - 1].status : order.status;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <button onClick={() => navigate(-1)} className="text-sm text-blue-600">← Back</button>
      <h1 className="text-xl font-semibold">Order #{order._id?.slice(-6)}</h1>

      {/* TRACKING */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold text-lg mb-1">Tracking</h2>
        <p className="text-sm text-gray-600 mb-3">
          Current Status: <span className="font-medium">{latestStatus}</span>
        </p>
        <OrderTrackingSteps timeline={timeline} currentStatus={latestStatus} />
      </div>

      {/* ORDER INFO */}
      <div className="bg-white border rounded-lg p-4">
        <p><strong>Payment:</strong> {order.paymentMethod}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Customer:</strong> {order.customer?.name || "N/A"} ({order.customer?.email})</p>
      </div>

      {/* SHIPPING */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p>{order.shippingAddress?.street}</p>
        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
        <p>{order.shippingAddress?.phone}</p>
      </div>

      {/* PRODUCTS */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Products</h2>
        {order.products?.map((item) => (
          <div key={item._id} className="flex justify-between border-b py-2">
            <p>{item.product?.name || "Product deleted"}</p>
            <p>₹{item.product ? item.quantity * item.product.price : item.price}</p>
          </div>
        ))}
      </div>

      {/* REVIEW */}
      {latestStatus === "Delivered" && <DeliveredReviewSection order={order} />}
    </div>
  );
}
