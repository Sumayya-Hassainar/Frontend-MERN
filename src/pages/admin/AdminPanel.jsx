// src/pages/admin/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchPendingVendors,
  approveVendorRequest,
  rejectVendorRequest,
} from "../../api/adminapi";

import { createNotification } from "../../api/accountapi";

export default function AdminPanel() {
  /* ================= STATE ================= */
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [error, setError] = useState("");

  // Notification form state
  const [recipient, setRecipient] = useState("");
  const [recipientModel, setRecipientModel] = useState("User");
  const [type, setType] = useState("System");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  /* ================= VENDOR REQUESTS ================= */

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPendingVendors();
      setRequests(Array.isArray(data) ? data : data?.vendors || []);
    } catch (err) {
      console.error("Fetch vendor requests error:", err);
      setError(err.message || "Failed to fetch vendor requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this vendor request?")) return;

    setActionLoading(true);
    setError("");
    try {
      await approveVendorRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Approve error:", err);
      setError(err.message || "Failed to approve vendor request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this vendor request?")) return;

    setActionLoading(true);
    setError("");
    try {
      await rejectVendorRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Reject error:", err);
      setError(err.message || "Failed to reject vendor request");
    } finally {
      setActionLoading(false);
    }
  };

  const goToDashboard = () => {
    navigate("/admin");
  };

  /* ================= NOTIFICATIONS ================= */

  const handleCreateNotification = async (e) => {
    e.preventDefault();

    if (!recipient.trim() || !message.trim()) {
      alert("Recipient and message are required");
      return;
    }

    setNotifLoading(true);
    try {
      await createNotification({
        recipient,
        recipientModel,
        message,
        type,
      });

      setRecipient("");
      setMessage("");
      alert("✅ Notification sent successfully");
    } catch (err) {
      console.error(err);
      alert(err.message || "❌ Failed to send notification");
    } finally {
      setNotifLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Admin Panel</h1>
          <p className="text-gray-600 text-sm">
            Review vendor requests and send system notifications.
          </p>
        </div>
        <button
          onClick={goToDashboard}
          className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Go to Admin Dashboard
        </button>
      </header>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* ================= VENDOR REQUESTS ================= */}
      <section className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Vendor Requests</h2>
          {loading && <span className="text-xs text-gray-500">Loading...</span>}
          {actionLoading && !loading && (
            <span className="text-xs text-gray-500">Processing...</span>
          )}
        </div>

        {requests.length === 0 && !loading ? (
          <p className="text-sm text-gray-600">No pending vendor requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Email</th>
                  <th className="border px-3 py-2">Shop</th>
                  <th className="border px-3 py-2">Requested At</th>
                  <th className="border px-3 py-2 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td className="border px-3 py-2">{req.name || "-"}</td>
                    <td className="border px-3 py-2">{req.email || "-"}</td>
                    <td className="border px-3 py-2">{req.shopName || "-"}</td>
                    <td className="border px-3 py-2">
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="border px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(req._id)}
                          className="text-xs px-3 py-1 rounded bg-green-100 text-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          className="text-xs px-3 py-1 rounded bg-red-100 text-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ================= SEND NOTIFICATION ================= */}
      <section className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Send Notification</h2>

        <form onSubmit={handleCreateNotification} className="space-y-3">
          <select
            value={recipientModel}
            onChange={(e) => setRecipientModel(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="User">User</option>
            <option value="Vendor">Vendor</option>
          </select>

          <input
            type="text"
            placeholder="Recipient ID"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="System">System</option>
            <option value="Order">Order</option>
            <option value="Payment">Payment</option>
          </select>

          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <button
            type="submit"
            disabled={notifLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {notifLoading ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </section>
    </div>
  );
}
