const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";


/* ================= AUTH HEADER ================= */
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login.");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

/* ================= GLOBAL RESPONSE HANDLER ================= */
async function handleResponse(res, defaultMsg) {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(defaultMsg);
  }
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || defaultMsg);
  }
  return data;
}
/* ================= VENDOR AUTH ================= */
export async function registerVendor(payload) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res, "Vendor registration failed");
}

export async function loginVendor(payload) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res, "Vendor login failed");
}

/* ================= CATEGORIES ================= */
export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  return handleResponse(res, "Failed to fetch categories");
}

/* ================= VENDOR PRODUCTS ================= */
export async function getVendorProducts(categoryId) {
  const params = categoryId ? `?category=${categoryId}` : "";
  const res = await fetch(`${API_BASE}/products/vendor/my-products${params}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res, "Failed to fetch vendor products");
}

export async function createVendorProduct(formData) {
  const headers = getAuthHeaders();
  delete headers["Content-Type"]; // FormData requires no content-type header
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers,
    body: formData,
  });
  return handleResponse(res, "Failed to create product");
}

export async function updateVendorProduct(id, formData) {
  const headers = getAuthHeaders();
  delete headers["Content-Type"];
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers,
    body: formData,
  });
  return handleResponse(res, "Failed to update product");
}

export async function deleteVendorProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res, "Failed to delete product");
}

/* ================= VENDOR ORDERS ================= */
export async function fetchVendorOrders() {
  const res = await fetch(`${API_BASE}/orders/vendor`, {
    headers: getAuthHeaders(),
  });
  const data = await handleResponse(res, "Failed to fetch vendor orders");
  return data.orders || [];
}

/* ================= ORDER STATUS ================= */
export async function fetchOrderStatuses(orderId) {
  if (!orderId) throw new Error("Order ID required");
  const res = await fetch(`${API_BASE}/order-statuses/order/${orderId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await handleResponse(res, "Failed to fetch order statuses");
  return Array.isArray(data.data) ? data.data : [];
}

export async function createVendorOrderStatus({ status, orderId }) {
  if (!status?.trim()) throw new Error("Status is required");
  if (!orderId) throw new Error("Order ID is required");
  const res = await fetch(`${API_BASE}/order-statuses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: status.trim(), order: orderId }),
  });
  return handleResponse(res, "Failed to create status");
}

export async function updateVendorOrderStatus(statusId, { status }) {
  if (!statusId) throw new Error("Status ID required");
  if (!status?.trim()) throw new Error("Status is required");
  const res = await fetch(`${API_BASE}/order-statuses/${statusId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: status.trim() }),
  });
  return handleResponse(res, "Failed to update status");
}

export async function deleteVendorOrderStatus(statusId) {
  if (!statusId) throw new Error("Status ID required");
  const res = await fetch(`${API_BASE}/order-statuses/${statusId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res, "Failed to delete status");
}
