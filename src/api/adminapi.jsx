// src/api/adminapi.jsx
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Helper to include Authorization header
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* -------------------- VENDOR APIS -------------------- */

// GET all vendors
export async function fetchVendors() {
  const res = await fetch(`${API_BASE}/admin/vendors`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch vendors");
  return res.json();
}

// CREATE a new vendor (admin)
export async function createVendor(payload) {
  const res = await fetch(`${API_BASE}/admin/vendors`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create vendor");
  return res.json();
}

// UPDATE vendor (admin)
export async function updateVendor(id, payload) {
  const res = await fetch(`${API_BASE}/admin/vendors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update vendor");
  return res.json();
}

// DELETE vendor (admin)
export async function deleteVendor(id) {
  const res = await fetch(`${API_BASE}/admin/vendors/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete vendor");
  return res.json();
}

// GET pending vendors
export async function fetchPendingVendors() {
  const res = await fetch(`${API_BASE}/admin/vendors/pending`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch pending vendors");
  return res.json();
}

// APPROVE vendor
export async function approveVendorRequest(id) {
  const res = await fetch(`${API_BASE}/admin/vendors/${id}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error("Failed to approve vendor request");
  return res.json();
}

// REJECT vendor
export async function rejectVendorRequest(id) {
  const res = await fetch(`${API_BASE}/admin/vendors/${id}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error("Failed to reject vendor request");
  return res.json();
}

/* -------------------- ORDER STATUS APIS -------------------- */

// GET all order statuses
export async function fetchOrderStatuses() {
  const res = await fetch(`${API_BASE}/order-statuses`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch order statuses");
  return res.json();
}

// CREATE order status
export async function createOrderStatus(payload) {
  const res = await fetch(`${API_BASE}/order-statuses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create order status");
  return res.json();
}

// UPDATE order status
export async function updateOrderStatus(id, payload) {
  const res = await fetch(`${API_BASE}/order-statuses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}

// DELETE order status
export async function deleteOrderStatus(id) {
  const res = await fetch(`${API_BASE}/order-statuses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete order status");
  return res.json();
}
