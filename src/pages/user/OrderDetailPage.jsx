import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrderById } from "../../api/api.jsx";
import OrderTrackingSteps from "../../components/OrderTrackingSteps.jsx";
import ReviewForm from "../../components/ReviewForm.jsx";

export default function OrderDetailPage() {
  const { id } = useParams(); // ✅ FIXED ID
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        if (!id) {
          setError("No Order ID in URL");
          return;
        }

        setLoading(true);
        const data = await fetchOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error("Fetch order error:", err);
        setError(err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

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
        Order #{order._id?.slice(-6)}
      </h1>

      {/* ✅ TRACKING */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <h2 className="font-semibold text-lg mb-1">Tracking</h2>
        <p className="text-sm text-gray-600 mb-2">
          Current Status:{" "}
          <span className="font-medium">{order.orderStatus}</span>
        </p>

        <OrderTrackingSteps currentStatus={order.orderStatus} />
      </div>

      {/* ✅ ORDER INFO */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <h2 className="font-semibold text-lg mb-2">Order Info</h2>

        <p>
          <strong>Payment Method:</strong> {order.paymentMethod || "N/A"}
        </p>

        <p>
          <strong>Total Amount:</strong> ₹{order.totalAmount || 0}
        </p>

        <p>
          <strong>Placed On:</strong>{" "}
          {order.createdAt
            ? new Date(order.createdAt).toLocaleString()
            : "N/A"}
        </p>
      </div>

      {/* ✅ SHIPPING ADDRESS — FULLY FIXED */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <h2 className="font-semibold text-lg mb-2">Shipping Address</h2>

        {order.shippingAddress ? (
          typeof order.shippingAddress === "string" ? (
            <p>{order.shippingAddress}</p>
          ) : (
            <div className="text-sm space-y-1">
              <p>{order.shippingAddress?.street || "—"}</p>
              <p>
                {order.shippingAddress?.city || "—"},{" "}
                {order.shippingAddress?.state || "—"}
              </p>
              <p>{order.shippingAddress?.pincode || "—"}</p>
            </div>
          )
        ) : (
          <p className="text-sm text-gray-500">
            No shipping address available
          </p>
        )}
      </div>

      {/* ✅ PRODUCTS — PRICE & TOTAL FIXED (NO ₹NaN EVER) */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <h2 className="font-semibold text-lg mb-2">Products</h2>

        {order.products?.map((item) => {
          const price =
            item.product?.discountPrice ||
            item.product?.price ||
            0;

          return (
            <div
              key={item._id}
              className="flex justify-between mb-2 border-b pb-2 text-sm"
            >
              <div>
                <p>{item.product?.name || "Product"}</p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × ₹{price}
                </p>
              </div>
              <p className="font-medium">
                ₹{item.quantity * price}
              </p>
            </div>
          );
        })}
      </div>

      {/* ✅ REVIEW ONLY WHEN DELIVERED */}
      {order.orderStatus === "Delivered" && (
        <div className="bg-white border rounded-lg p-4 mt-5">
          <h2 className="text-lg font-semibold mb-3">
            Rate & Review Your Products
          </h2>

          {order.products?.map((item) => (
            <div key={item._id} className="mb-6">
              <h3 className="font-medium mb-2">
                {item.product?.name || "Product"}
              </h3>
              <ReviewForm
                productId={item.product?._id || item.product}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
