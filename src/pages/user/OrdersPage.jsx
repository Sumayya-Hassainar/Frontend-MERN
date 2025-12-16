// src/pages/user/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import { fetchCustomerOrders } from "../../api/api.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const newOrder = location.state?.newOrder; // COD order from PaymentPage

  // Status color mapping
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Default: "bg-gray-100 text-gray-800",
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchCustomerOrders();

        const fetchedOrders = Array.isArray(data.orders) ? data.orders : Array.isArray(data) ? data : [];

        // Prepend newOrder if passed
        if (newOrder) {
          setOrders([newOrder, ...fetchedOrders]);
        } else {
          setOrders(fetchedOrders);
        }
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [newOrder]);

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
        {orders.map((order) => {
          const status = order.orderStatus || "Default";
          const totalItems = order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0;
          const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A";

          return (
            <div
              key={order._id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm font-semibold">Order #{order._id?.slice(-6) || "N/A"}</p>
                  <p className="text-xs text-gray-500">{createdAt}</p>
                </div>

                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status] || statusColors.Default}`}>
                  {status}
                </span>
              </div>

              <p className="text-sm">Items: {totalItems}</p>
              <p className="text-sm font-semibold">Total: ₹{order.totalAmount || 0}</p>

              <button
                onClick={() => navigate(`/orders/${order._id}`)}
                className="mt-2 text-indigo-600 text-sm underline"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
