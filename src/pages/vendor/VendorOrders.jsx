import React, { useEffect, useState } from "react";
import {
  fetchVendorOrders,
  fetchOrderStatuses,
  createVendorOrderStatus,
  updateVendorOrderStatus,
  deleteVendorOrderStatus,
} from "../../api/vendorApi";

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [creating, setCreating] = useState(false);

  /* ================= LOAD ORDERS & STATUSES ================= */
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await fetchVendorOrders();
        setOrders(ordersData);

        const statusesMap = {};
        await Promise.all(
          ordersData.map(async (order) => {
            try {
              statusesMap[order._id] = await fetchOrderStatuses(order._id);
            } catch {
              statusesMap[order._id] = [];
            }
          })
        );

        setStatuses(statusesMap);
      } catch (err) {
        alert(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  /* ================= CREATE STATUS ================= */
  const handleCreate = async () => {
    if (!selectedOrderId || !newStatus.trim()) {
      return alert("Select order and enter status");
    }

    const exists = (statuses[selectedOrderId] || []).some(
      (s) => s.status.toLowerCase() === newStatus.trim().toLowerCase()
    );
    if (exists) return alert("Status already exists");

    try {
      setCreating(true);
      const res = await createVendorOrderStatus({
        orderId: selectedOrderId,
        status: newStatus.trim(),
      });

      setStatuses((prev) => ({
        ...prev,
        [selectedOrderId]: [...(prev[selectedOrderId] || []), res.data],
      }));

      setNewStatus("");
      setSelectedOrderId("");
    } catch (err) {
      alert(err.message || "Failed to create status");
    } finally {
      setCreating(false);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const handleUpdate = async (orderId, statusId, value) => {
    if (!value.trim()) return alert("Status cannot be empty");

    try {
      const res = await updateVendorOrderStatus(statusId, {
        status: value.trim(),
      });

      setStatuses((prev) => ({
        ...prev,
        [orderId]: prev[orderId].map((s) =>
          s._id === statusId ? { ...s, status: res.data.status } : s
        ),
      }));
    } catch (err) {
      alert(err.message || "Update failed");
    }
  };

  /* ================= DELETE STATUS ================= */
  const handleDelete = async (orderId, statusId) => {
    if (!window.confirm("Delete this status?")) return;

    try {
      await deleteVendorOrderStatus(statusId);
      setStatuses((prev) => ({
        ...prev,
        [orderId]: prev[orderId].filter((s) => s._id !== statusId),
      }));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Orders</h1>

      {/* CREATE STATUS */}
      <div className="flex gap-3 mb-6">
        <select
          value={selectedOrderId}
          onChange={(e) => setSelectedOrderId(e.target.value)}
          className="border px-3 py-2"
        >
          <option value="">Select Order</option>
          {orders.map((o) => (
            <option key={o._id} value={o._id}>
              {o._id}
            </option>
          ))}
        </select>

        <input
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          placeholder="New status"
          className="border px-3 py-2 flex-1"
        />

        <button
          onClick={handleCreate}
          disabled={creating}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {creating ? "Adding..." : "Add"}
        </button>
      </div>

      {/* ORDERS TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Order</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Products</th>
              <th className="p-2">Total</th>
              <th className="p-2">Statuses</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t align-top">
                <td className="p-2">{o._id}</td>
                <td className="p-2">
                  {o.customer?.name}
                  <br />
                  <small>{o.customer?.email}</small>
                </td>
                <td className="p-2">
                  {o.products.map((p) => (
                    <div key={p.product?._id || p.product?.name}>
                      {p.product?.name} × {p.quantity}
                    </div>
                  ))}
                </td>
                <td className="p-2">₹{o.totalAmount}</td>
                <td className="p-2 space-y-2">
                  {(statuses[o._id] || []).map((s) => (
                    <div key={s._id} className="flex gap-2 items-center">
                      <input
                        value={s.status}
                        onChange={(e) =>
                          setStatuses((prev) => ({
                            ...prev,
                            [o._id]: prev[o._id].map((x) =>
                              x._id === s._id
                                ? { ...x, status: e.target.value }
                                : x
                            ),
                          }))
                        }
                        className="border px-2 py-1 text-xs"
                      />
                      <button
                        onClick={() => handleUpdate(o._id, s._id, s.status)}
                        className="bg-blue-600 text-white px-2 py-1 text-xs rounded"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(o._id, s._id)}
                        className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {(statuses[o._id] || []).length === 0 && (
                    <span className="text-gray-400 text-xs">No status</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
