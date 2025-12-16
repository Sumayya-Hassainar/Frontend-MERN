// api.jsx
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
  } catch (err) {
    console.warn("No JSON returned:", err);
  }

  if (!res.ok) {
    const msg = data?.message || `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

/* ================= HELPER FETCH WITH ERROR LOG ================= */
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    return await handleResponse(res);
  } catch (err) {
    console.error("API fetch error:", url, err);
    throw err;
  }
}

/* ================= AUTH ================= */
export async function registerUser(payload) {
  return safeFetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return safeFetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function verifyOtp(payload) {
  return safeFetch(`${API_BASE}/users/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(payload) {
  return safeFetch(`${API_BASE}/users/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload) {
  return safeFetch(`${API_BASE}/users/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function fetchMyProfile() {
  requireToken();
  return safeFetch(`${API_BASE}/users/profile`, {
    headers: getAuthHeaders(),
  });
}

/* ================= PRODUCTS ================= */
export async function fetchProducts() {
  return safeFetch(`${API_BASE}/products`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
}

export async function fetchProductById(id) {
  if (!id) throw new Error("Product ID is required");
  return safeFetch(`${API_BASE}/products/${id}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
}

/* ================= CUSTOMER ORDERS ================= */
export async function fetchCustomerOrders() {
  requireToken(); // ensures token is set

  try {
    console.log("Fetching customer orders from:", `${API_BASE}/orders/myorders`);

    const response = await safeFetch(`${API_BASE}/orders/myorders`, {
      headers: getAuthHeaders(),
    });

    console.log("✅ ORDERS API RESPONSE:", response);

    return response; // should contain response.orders
  } catch (error) {
    console.error("❌ ERROR fetching customer orders:", error);
    throw error; // rethrow so calling code can handle
  }
}

export async function fetchOrderById(orderId) {
  requireToken();
  if (!orderId) throw new Error("Order ID is required");
  return safeFetch(`${API_BASE}/orders/${orderId}`, {
    headers: getAuthHeaders(),
  });
}

/* ================= CREATE ORDER ================= */
export async function createOrder(orderData) {
  requireToken();
  const data = await safeFetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });

  // Return the order object if present
  return data.order ?? data;
}

/* ================= ORDER STATUS ================= */
export async function fetchOrderStatusesByOrder(orderId) {
  requireToken();
  if (!orderId) throw new Error("Order ID is required");
  const data = await safeFetch(`${API_BASE}/order-statuses/order/${orderId}`, {
    headers: getAuthHeaders(),
  });
  return Array.isArray(data.statuses) ? data.statuses : [];
}

export async function fetchCustomerOrderTracking(orderId) {
  requireToken();
  if (!orderId) throw new Error("Order ID is required");
  const data = await safeFetch(`${API_BASE}/order-statuses/track/${orderId}`, {
    headers: getAuthHeaders(),
  });
  return { order: data.order, timeline: Array.isArray(data.timeline) ? data.timeline : [] };
}

/* ================= COD PAYMENT ================= */
export async function createPayment(payload) {
  requireToken();
  return safeFetch(`${API_BASE}/payments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

/* ================= STRIPE ONLINE PAYMENT ================= */
export async function createOnlinePayment(orderId) {
  requireToken();
  if (!orderId) throw new Error("Order ID is required");
  return safeFetch(`${API_BASE}/payments/stripe/create-session`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ orderId }),
  });
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
