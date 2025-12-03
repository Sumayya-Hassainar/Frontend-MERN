// src/api/adminapi.jsx
const API_BASE = import.meta.env.VITE_API_URL || "https://backend-mern-ex49.onrender.com/api";

// -------------------- AUTH HEADER --------------------
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// -------------------- HELPER --------------------
async function safeFetch(url, options, defaultError = "Request failed") {
  const res = await fetch(url, options);
  if (!res.ok) {
    let message = defaultError;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

// -------------------- VENDORS --------------------
export async function fetchVendors() {
  return safeFetch(`${API_BASE}/admin/vendors`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  }, "Failed to fetch vendors");
}

export async function fetchPendingVendors() {
  return safeFetch(`${API_BASE}/admin/vendors/pending`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  }, "Failed to fetch pending vendors");
}

export async function approveVendorRequest(id) {
  return safeFetch(`${API_BASE}/admin/vendors/${id}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  }, "Failed to approve vendor request");
}

export async function rejectVendorRequest(id) {
  return safeFetch(`${API_BASE}/admin/vendors/${id}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  }, "Failed to reject vendor request");
}


// -------------------- ORDER STATUS --------------------

export async function fetchOrderStatuses() {
  return safeFetch(`${API_BASE}/order-statuses`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  }, "Failed to fetch order statuses");
}

export async function createOrderStatus(payload) {
  return safeFetch(`${API_BASE}/order-statuses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  }, "Failed to create order status");
}

export async function updateOrderStatus(id, payload) {
  return safeFetch(`${API_BASE}/order-statuses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  }, "Failed to update order status");
}

export async function deleteOrderStatus(id) {
  return safeFetch(`${API_BASE}/order-statuses/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  }, "Failed to delete order status");
}
