const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://backend-mern-ex49.onrender.com/api";

/* ================= AUTH HEADER ================= */
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
}

/* ================= VENDOR MANAGEMENT ================= */

// ✅ GET ALL VENDORS
export async function fetchVendors() {
  const res = await fetch(`${API_BASE}/vendors`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch vendors");
  return res.json();
}

// ✅ GET PENDING VENDORS
export async function fetchPendingVendors() {
  const res = await fetch(`${API_BASE}/admin/vendors/pending`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch pending vendors");
  return res.json();
}

// ✅ CREATE VENDOR
export async function createVendor(payload) {
  const res = await fetch(`${API_BASE}/vendors`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create vendor");
  return res.json();
}

// ✅ UPDATE VENDOR
export async function updateVendor(id, payload) {
  const res = await fetch(`${API_BASE}/vendors/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update vendor");
  return res.json();
}

// ✅ DELETE VENDOR
export async function deleteVendor(id) {
  const res = await fetch(`${API_BASE}/vendors/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete vendor");
  return res.json();
}

// ✅ APPROVE VENDOR
export async function approveVendorRequest(id) {
  const res = await fetch(`${API_BASE}/vendors/${id}/approve`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to approve vendor");
  return res.json();
}

// ✅ REJECT VENDOR
export async function rejectVendorRequest(id) {
  const res = await fetch(`${API_BASE}/vendors/${id}/reject`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to reject vendor");
  return res.json();
}

/* ================= ORDER MANAGEMENT (ADMIN) ================= */

// ✅ ADMIN: FETCH ALL ORDERS
export async function fetchAllOrders() {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

// ✅ ADMIN: ASSIGN ORDER TO VENDOR ✅✅✅
export async function sendOrderToVendor(orderId, vendorId) {
  const res = await fetch(
    `${API_BASE}/orders/${orderId}/assign`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ vendorId }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to assign order");
  }

  return res.json();
}

// ✅ ADMIN: DELETE ORDER
export async function deleteOrder(orderId) {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete order");
  return res.json();
}

/* ================= ORDER STATUS MASTER (ADMIN ONLY) ================= */

// ✅ ADMIN: GET ALL ORDER STATUSES ✅✅✅
export async function fetchOrderStatuses() {
  const res = await fetch(`${API_BASE}/order-statuses`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch order statuses");
  return res.json();
}

// ✅ ADMIN: UPDATE STATUS ✅✅✅
export async function updateOrderStatus(id, payload) {
  const res = await fetch(`${API_BASE}/order-statuses/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}

// ✅ ADMIN: DELETE STATUS ✅✅✅
export async function deleteOrderStatus(id) {
  const res = await fetch(`${API_BASE}/order-statuses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete order status");
  return res.json();
}
