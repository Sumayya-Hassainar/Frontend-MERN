import { useEffect, useState } from "react";
import {
  fetchAllOrders,
  fetchVendors,
  sendOrderToVendor,
  deleteOrder,
} from "../../api/adminapi";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);

  // Load orders + vendors
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [ordersRes, vendorsRes] = await Promise.all([
        fetchAllOrders(),
        fetchVendors(),
      ]);

      setOrders(Array.isArray(ordersRes) ? ordersRes : ordersRes.data || []);
      setVendors(Array.isArray(vendorsRes) ? vendorsRes : vendorsRes.data || []);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      alert(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  /* ================= ASSIGN VENDOR ================= */
const handleAssignVendor = async (orderId, vendorId) => {
  if (!vendorId) return;

  try {
    setAssigning(orderId); // disable dropdown while assigning
    const res = await sendOrderToVendor(orderId, vendorId);

    setOrders(prev =>
      prev.map(o =>
        o._id === orderId ? { ...o, vendor: res.order.vendor } : o
      )
    );

    alert("Vendor assigned successfully");
  } catch (err) {
    console.error("❌ ASSIGN ERROR:", err);
    alert(err.message || "Failed to assign vendor");
  } finally {
    setAssigning(null);
  }
};

  /* ================= DELETE ORDER ================= */
  const handleOrderDelete = async (id) => {
    if (!confirm("Delete this order?")) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert(err.message || "Failed to delete order");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Orders</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Order</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Vendor</th>
            <th className="border p-2">Assign Vendor</th>
            <th className="border p-2">Handle</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center">
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o._id}>
                <td className="border p-2">{o._id}</td>
                <td className="border p-2">{o.customer?.name || "Guest"}</td>
                <td className="border p-2">
                  {o.vendor?.shopName || o.vendor?.name || "Not Assigned"}
                </td>

                <td className="border p-2">
                  <select
                    disabled={assigning === o._id}
                    value={o.vendor?._id || ""}
                    onChange={(e) => handleAssignVendor(o._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.shopName || v.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="border p-2 text-center">
                  <Link to={`/admin/orders/${o._id}/handle`}>
                    <button className="text-blue-600 underline">Handle</button>
                  </Link>
                </td>

                <td className="border p-2 text-center">
                  <button
                    className="text-red-600 underline"
                    onClick={() => handleOrderDelete(o._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
