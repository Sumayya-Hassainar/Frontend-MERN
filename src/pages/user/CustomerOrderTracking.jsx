import React, { useEffect, useState } from "react";
import { fetchOrderTracking } from "../../api/customerApi"; // You should implement similar to vendorApi

export default function CustomerOrderTracking({ orderId }) {
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracking = async () => {
      try {
        setLoading(true);
        const res = await fetchOrderTracking(orderId);
        setOrder(res.order);
        setTimeline(res.timeline);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTracking();

    // Polling every 5 seconds for real-time updates
    const interval = setInterval(loadTracking, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) return <p>Loading tracking info...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Order Tracking</h2>
      <p className="mb-4">Current Status: <strong>{order.status}</strong></p>

      <ul className="space-y-2">
        {timeline.map((t) => (
          <li key={t._id} className="border-l-2 border-blue-500 pl-2">
            <p className="text-sm">{t.status}</p>
            <small>{new Date(t.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
