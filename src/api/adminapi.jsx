const API_BASE = import.meta.env.VITE_API_URL || "https://backend-mern-ex49.onrender.com/api";

/* ================= AUTH HEADER ================= */
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
}

/* ================= HELPER: NORMALIZE ================= */
async function normalize(res) {
  const json = await res.json();
  if ("data" in json) return json;
  if (Array.isArray(json)) return { data: json };
  if (json.orders) return { data: json.orders };
  return { data: json };
}


/* ================= VENDOR MANAGEMENT ================= */
export async function fetchVendors() {
  const res = await fetch(`${API_BASE}/admin/vendors`, {
    headers: getAuthHeaders(),
  });

  console.log("RAW VENDOR API RESPONSE:", res.status);

  const data = await res.json();
  console.log("VENDOR API JSON:", data);
  return data;
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
  return normalize(res);
}

export async function sendOrderToVendor(orderId, vendorId) {
  console.log("🔥 sendOrderToVendor called", { orderId, vendorId });

  const res = await fetch(`${API_BASE}/orders/${orderId}/assign`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ vendorId }),
  });

  const data = await res.json();

  if (!data.success) {
    console.error("ASSIGN ORDER API ERROR:", data);
    throw new Error(data.message || "Failed to assign vendor");
  }

  console.log("✅ sendOrderToVendor SUCCESS:", data);
  return data;
}

// Admin updates order status
export async function adminUpdateOrderStatus(orderId, status) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      `Failed to update order status: ${errData.message || res.statusText}`
    );
  }

  const data = await res.json();
  return normalize ? normalize(data) : data;
}

// Vendor updates order status
export async function vendorUpdateOrderStatus(orderId, status) {
  const res = await fetch(`${API_BASE}/order-status/vendor/${orderId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update vendor order status");
  return normalize(res);
}

export async function deleteOrder(orderId) {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete order");
  return normalize(res);
}

/* ================= ORDER STATUS MASTER ================= */
// Get statuses for a specific order
export async function getStatuses(orderId) {
  const res = await fetch(`${API_BASE}/order-statuses/order/${orderId}`, {
    headers: getAuthHeaders(),
  });
  return normalize(res);
}

// Admin updates main order status
export async function updateOrderStatusAdmin(statusId, status) {
  const res = await fetch(`${API_BASE}/order-statuses/${statusId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return normalize(res);
}

// Delete order status (Vendor only)
export async function deleteOrderStatus(statusId) {
  const res = await fetch(`${API_BASE}/order-statuses/${statusId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return normalize(res);
}
/* ================= USER MANAGEMENT ================= */

// Admin: Get all users
export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return { data };
}


// Admin: Block / Unblock user
export async function toggleUserStatus(userId, isBlocked) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ isBlocked }),
  });

  if (!res.ok) throw new Error("Failed to update user status");
  return normalize(res);
}

// Admin: Change user role
export async function updateUserRole(userId, role) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ role }),
  });

  if (!res.ok) throw new Error("Failed to update user role");
  return normalize(res);
}
