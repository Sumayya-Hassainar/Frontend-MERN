// src/pages/admin/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchPendingVendors,
  approveVendorRequest,
  rejectVendorRequest,
} from "../../api/adminapi";

import {
  fetchNotifications,
  createNotification,
} from "../../api/accountapi";

export default function AdminPanel() {
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ================= VENDOR REQUESTS =================

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
    loadNotifications();
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

  // ================= NOTIFICATIONS =================

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      alert("Title and message are required");
      return;
    }

    setNotifLoading(true);
    try {
      await createNotification({ title, message });
      setTitle("");
      setMessage("");
      loadNotifications();
      alert("✅ Notification created successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create notification");
    } finally {
      setNotifLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Admin Panel</h1>
          <p className="text-gray-600 text-sm">
            Review vendor requests and manage platform notifications.
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
          <p className="text-sm text-gray-600">
            No pending vendor requests.
          </p>
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

      {/* ================= NOTIFICATIONS ================= */}
      <section className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Notifications</h2>

        <form onSubmit={handleCreateNotification} className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="submit"
            disabled={notifLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create Notification
          </button>
        </form>

        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-3 border rounded ${
                n.read ? "bg-gray-100" : "bg-yellow-100"
              }`}
            >
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <small className="text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
          {notifications.length === 0 && (
            <p className="text-sm text-gray-600">No notifications yet.</p>
          )}
        </ul>
      </section>
    </div>
  );
}
