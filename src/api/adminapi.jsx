const API_BASE = import.meta.env.VITE_API_URL || "https://backend-mern-ex49.onrender.com/api";

/* ================= AUTH HEADER ================= */
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
}
/* ================= VENDOR MANAGEMENT ================= */
export async function fetchVendors() {
  const res = await fetch(`${API_BASE}/vendors`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch vendors");
  return res.json();
}

export async function fetchPendingVendors() {
  const res = await fetch(`${API_BASE}/admin/vendors/pending`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch pending vendors");
  return res.json();
}

export async function createVendor(payload) {
  const res = await fetch(`${API_BASE}/vendors`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create vendor");
  return res.json();
}

export async function updateVendor(id, payload) {
  const res = await fetch(`${API_BASE}/vendors/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update vendor");
  return res.json();
}

export async function deleteVendor(id) {
  const res = await fetch(`${API_BASE}/vendors/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete vendor");
  return res.json();
}

export async function approveVendorRequest(id) {
  const res = await fetch(`${API_BASE}/vendors/${id}/approve`, { method: "PATCH", headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to approve vendor");
  return res.json();
}

export async function rejectVendorRequest(id) {
  const res = await fetch(`${API_BASE}/vendors/${id}/reject`, { method: "PATCH", headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to reject vendor");
  return res.json();
}

/* ================= ORDER MANAGEMENT ================= */
export async function fetchAllOrders() {
  const res = await fetch(`${API_BASE}/orders`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function sendOrderToVendor(orderId, vendorId) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/assign`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ vendorId }),
  });
  if (!res.ok) throw new Error("Failed to assign order");
  return res.json();
}

// ✅ Admin updates order
export async function adminUpdateOrderStatus(orderId, status) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}

// ✅ Vendor updates order
export async function vendorUpdateOrderStatus(orderId, status) {
  const res = await fetch(`${API_BASE}/order-statuses/vendor/${orderId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update vendor order status");
  return res.json();
}

export async function deleteOrder(orderId) {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete order");
  return res.json();
}

/* ================= ORDER STATUS MASTER ================= */
export async function fetchOrderStatuses() {
  const res = await fetch(`${API_BASE}/order-statuses`, { headers: getAuthHeaders() });
  const data = await res.json().catch(() => ({}));
  console.log("Status:", res.status, "OK?", res.ok, "Data:", data);

  if (!res.ok) throw new Error(data?.message || "Failed to fetch order statuses");
  return data;
}

export async function updateOrderStatusMaster(id, payload) {
  const res = await fetch(`${API_BASE}/order-statuses/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update order status master");
  return res.json();
}

export async function deleteOrderStatus(id) {
  const res = await fetch(`${API_BASE}/order-statuses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete order status");
  return res.json();
}
