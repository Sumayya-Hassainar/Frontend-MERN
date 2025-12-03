// src/api/adminapi.jsx
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* -------------------- VENDOR LIST (ADMIN) -------------------- */

// Get all vendors (approved & pending)
export async function fetchVendors() {
  const res = await fetch(`${API_BASE}/admin/vendors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    let message = "Failed to fetch vendors";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  // expect: [ { _id, name, email, role: "vendor", isVendorApproved, ... }, ... ]
  return res.json();
}

// (optional) Create vendor – only works if you implement POST /admin/vendors in backend
export async function createVendor(payload) {
  const res = await fetch(`${API_BASE}/admin/vendors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Failed to create vendor";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

// (optional) Update vendor – only works if you implement PUT /admin/vendors/:id in backend
export async function updateVendor(id, payload) {
  const res = await fetch(`${API_BASE}/admin/vendors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Failed to update vendor";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

// (optional) Delete vendor – only works if you implement DELETE /admin/vendors/:id in backend
export async function deleteVendor(id) {
  const res = await fetch(`${API_BASE}/admin/vendors/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    let message = "Failed to delete vendor";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

/* -------------------- ORDER STATUS APIS -------------------- */

export async function fetchOrderStatuses() {
  const res = await fetch(`${API_BASE}/order-status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    let message = "Failed to fetch order statuses";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export async function createOrderStatus(payload) {
  const res = await fetch(`${API_BASE}/order-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Failed to create order status";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export async function updateOrderStatus(id, payload) {
  const res = await fetch(`${API_BASE}/order-status/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Failed to update order status";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export async function deleteOrderStatus(id) {
  const res = await fetch(`${API_BASE}/order-status/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    let message = "Failed to delete order status";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

/* -------------------- VENDOR REQUEST (PENDING) APIS -------------------- */

// Get all pending vendor requests
// This calls GET /api/admin/vendors (same as list), and we assume the backend
// returns ONLY pending vendors OR you can filter on frontend.
export async function fetchPendingVendors() {
  const res = await fetch(`${API_BASE}/admin/vendors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    let message = "Failed to fetch vendor requests";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  // If backend returns all vendors, and you only want pending:
  const all = await res.json();
  // pending = role: "vendor" AND isVendorApproved === false
  return Array.isArray(all)
    ? all.filter((v) => v.role === "vendor" && !v.isVendorApproved)
    : [];
}

// Approve a vendor request
export async function approveVendorRequest(id) {
  const res = await fetch(`${API_BASE}/admin/vendors/${id}/approve`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    let message = "Failed to approve vendor request";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

// Reject a vendor request
export async function rejectVendorRequest(id) {
  const res = await fetch(`${API_BASE}/admin/vendors/${id}/reject`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    let message = "Failed to reject vendor request";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
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
