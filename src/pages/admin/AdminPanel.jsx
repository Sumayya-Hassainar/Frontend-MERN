// src/pages/admin/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchPendingVendors,
  approveVendorRequest,
  rejectVendorRequest,
} from "../../api/adminapi";

export default function AdminPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPendingVendors();
      // backend can return [ ... ] or { vendors: [...] }
      setRequests(Array.isArray(data) ? data : data.vendors || []);
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
      await loadRequests();
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
      await loadRequests();
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Admin Panel</h1>
          <p className="text-gray-600 text-sm">
            Review vendor requests and manage platform access.
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

      <section className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Vendor Requests</h2>
          {loading && (
            <span className="text-xs text-gray-500">Loading requests...</span>
          )}
          {actionLoading && !loading && (
            <span className="text-xs text-gray-500">
              Processing action...
            </span>
          )}
        </div>

        {requests.length === 0 && !loading ? (
          <p className="text-sm text-gray-600">
            No pending vendor requests at the moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-3 py-2 text-left">Name</th>
                  <th className="border px-3 py-2 text-left">Email</th>
                  <th className="border px-3 py-2 text-left">Shop Name</th>
                  <th className="border px-3 py-2 text-left">Requested At</th>
                  <th className="border px-3 py-2 text-left w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td className="border px-3 py-2">{req.name}</td>
                    <td className="border px-3 py-2">{req.email}</td>
                    <td className="border px-3 py-2">
                      {req.shopName || "-"}
                    </td>
                    <td className="border px-3 py-2">
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="border px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(req._id)}
                          className="text-xs px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
                          disabled={actionLoading}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                          disabled={actionLoading}
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
    </div>
  );
}
