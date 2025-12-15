const API_BASE = import.meta.env.VITE_API_URL || "https://backend-mern-ex49.onrender.com/api";

/* ================= AUTH HEADER ================= */
export function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
    ...extra,
  };
}

export function requireToken() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required. Please login.");
  return token;
}

/* ================= GLOBAL RESPONSE HANDLER ================= */
async function handleResponse(res) {
  let data = {};
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) {
    const msg = data?.message || `Request failed with status ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

/* ================= AUTH ================= */
export async function registerUser(payload) {
  return handleResponse(await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
}

export async function loginUser(payload) {
  return handleResponse(await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
}

export async function verifyOtp(payload) {
  return handleResponse(await fetch(`${API_BASE}/users/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
}

export async function forgotPassword(payload) {
  return handleResponse(await fetch(`${API_BASE}/users/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
}

export async function resetPassword(payload) {
  return handleResponse(await fetch(`${API_BASE}/users/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
}

export async function fetchMyProfile() {
  requireToken();
  return handleResponse(await fetch(`${API_BASE}/users/profile`, {
    headers: getAuthHeaders(),
  }));
}

/* ================= PRODUCTS ================= */
export async function fetchProducts() {
  return handleResponse(await fetch(`${API_BASE}/products`));
}

export async function fetchProductById(id) {
  if (!id) throw new Error("Product ID is required");
  return handleResponse(await fetch(`${API_BASE}/products/${id}`));
}

/* ================= CUSTOMER ORDERS ================= */
export async function fetchCustomerOrders() {
  requireToken();
  return handleResponse(await fetch(`${API_BASE}/orders/myorders`, {
    headers: getAuthHeaders(),
  }));
}

export async function fetchOrderById(orderId) {
  requireToken();
  if (!orderId) throw new Error("Order ID is required");
  return handleResponse(await fetch(`${API_BASE}/orders/${orderId}`, {
    headers: getAuthHeaders(),
  }));
}

/* ================= CREATE ORDER ================= */
export async function createOrder(orderData) {
  requireToken();

  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });

  const data = await handleResponse(res);

  // 🔴 THIS IS THE FIX
  return data.order ?? data;
}

/* ================= ORDER STATUS ================= */
export async function fetchOrderStatusesByOrder(orderId) {
  requireToken();
  if (!orderId) throw new Error("Order ID is required");
  const data = await handleResponse(await fetch(`${API_BASE}/order-statuses/order/${orderId}`, {
    headers: getAuthHeaders(),
  }));
  return Array.isArray(data.statuses) ? data.statuses : [];
}

export async function fetchCustomerOrderTracking(orderId) {
  requireToken();
  if (!orderId) throw new Error("Order ID is required");
  const data = await handleResponse(await fetch(`${API_BASE}/order-statuses/track/${orderId}`, {
    headers: getAuthHeaders(),
  }));
  return { order: data.order, timeline: Array.isArray(data.timeline) ? data.timeline : [] };
}

/* ================= COD PAYMENT ================= */
export async function createPayment(payload) {
  // COD / manual payment
  const res = await fetch(`${API_BASE}/payments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

/* ================= STRIPE ONLINE PAYMENT ================= */
export async function createOnlinePayment(orderId) {
  const res = await fetch(`${API_BASE}/payments/stripe/create-session`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ orderId }),
  });
  return handleResponse(res); // returns { success, sessionId, url }
}


/* ================= DEFAULT EXPORT ================= */
export default {
  getAuthHeaders,
  requireToken,
  registerUser,
  loginUser,
  verifyOtp,
  forgotPassword,
  resetPassword,
  fetchMyProfile,
  fetchProducts,
  fetchProductById,
  fetchCustomerOrders,
  fetchOrderById,
  createOrder,
  createPayment,
  createOnlinePayment,
  fetchOrderStatusesByOrder,
  fetchCustomerOrderTracking,
 
};
