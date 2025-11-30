// src/pages/user/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import { fetchMyOrders } from "../../api/api.jsx";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchMyOrders();
        setOrders(data);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <p className="p-4">Loading orders...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  if (!orders.length) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-3">My Orders</h1>
        <p className="text-sm text-gray-600">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/orders/${order._id}`)} // ✅ navigate with :id
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-semibold">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  order.orderStatus === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.orderStatus === "Shipped"
                    ? "bg-blue-100 text-blue-800"
                    : order.orderStatus === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
            <p className="text-sm">
              Items: {order.products?.reduce((sum, p) => sum + p.quantity, 0)}
            </p>
            <p className="text-sm font-semibold">Total: ₹{order.totalAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
