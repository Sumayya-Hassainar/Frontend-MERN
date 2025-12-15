const API_BASE =
  import.meta.env.VITE_API_URL || "https://backend-mern-ex49.onrender.com/api";

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
  const token = localStorage.getItem("token"); // assign to variable
  console.log("TOKEN:", token);
  if (!token) throw new Error("Authentication required. Please login.");
  return token;
}


/* ================= GLOBAL RESPONSE HANDLER ================= */
async function handleResponse(res) {
  let data = {};
  try {
    data = await res.json();
  } catch (e) {}
  if (!res.ok) {
    const msg = data?.message || `Request failed with status ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

/* ================= AUTH ================= */
export async function registerUser(payload) {
  return handleResponse(
    await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

export async function loginUser(payload) {
  return handleResponse(
    await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

export async function verifyOtp(payload) {
  return handleResponse(
    await fetch(`${API_BASE}/users/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

export async function forgotPassword(payload) {
  return handleResponse(
    await fetch(`${API_BASE}/users/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

export async function resetPassword(payload) {
  return handleResponse(
    await fetch(`${API_BASE}/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

export async function fetchMyProfile() {
  requireToken();
  return handleResponse(
    await fetch(`${API_BASE}/users/profile`, { headers: getAuthHeaders() })
  );
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
  return handleResponse(
    await fetch(`${API_BASE}/orders/myorders`, { headers: getAuthHeaders() })
  );
}

export async function fetchOrderById(orderId) {
  requireToken();
  if (!orderId) throw new Error("Order ID is required");

  const res = await fetch(`${API_BASE}/orders/${orderId}`, { headers: getAuthHeaders() });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Failed to fetch order");

  return data.order;   // 👈 fixed
}


/* ================= CREATE ORDER ================= */
export async function createOrder(orderData) {
  requireToken();
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create order");
  return data;
}
/* ================= PAYMENT ================= */
export async function createPayment(paymentData) {
  requireToken();
  if (!paymentData?.orderId) throw new Error("orderId is required");
  if (paymentData.amount == null || Number.isNaN(Number(paymentData.amount))) throw new Error("amount is required");

  let method = (paymentData.paymentMethod || "").toLowerCase();
  if (method === "online" || method === "card/upi") method = "card";
  if (method !== "card" && method !== "cod") method = "card";

  const res = await fetch(`${API_BASE}/payments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      orderId: paymentData.orderId,
      amount: Number(paymentData.amount),
      paymentMethod: method,
      status: paymentData.status || "Success",
      transactionId: paymentData.transactionId,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Payment failed");
  return data;
}

/* ================= ORDER STATUS (FIXED) ================= */

// Get timeline for an order (vendor / admin / customer)
export async function fetchOrderStatusesByOrder(orderId) {
  requireToken();
  if (!orderId) throw new Error("Order ID is required");

  const res = await fetch(
    `${API_BASE}/order-statuses/order/${orderId}`, // ✅ CORRECT ROUTE
    { headers: getAuthHeaders() }
  );

  const data = await handleResponse(res);

  // backend returns { success, statuses }
  return Array.isArray(data.statuses) ? data.statuses : [];
}

// Customer tracking (if you KEEP /track route)
export async function fetchCustomerOrderTracking(orderId) {
  requireToken();
  if (!orderId) throw new Error("Order ID is required");

  const res = await fetch(
    `${API_BASE}/order-statuses/track/${orderId}`,
    { headers: getAuthHeaders() }
  );

  const data = await handleResponse(res);

  return {
    order: data.order,
    timeline: Array.isArray(data.timeline) ? data.timeline : [],
  };
}


/* ================= STRIPE ================= */
export async function createStripeCheckoutSession(products) {
  requireToken();
  return handleResponse(
    await fetch(`${API_BASE}/payments/create-checkout-session`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ products }),
    })
  );
}

export async function fetchStripeSessionStatus(sessionId) {
  requireToken();
  if (!sessionId) throw new Error("Session ID is required");
  return handleResponse(
    await fetch(`${API_BASE}/payments/session-status?session_id=${sessionId}`, {
      headers: getAuthHeaders(),
    })
  );
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
  fetchOrderStatusesByOrder,
  fetchCustomerOrderTracking,
  createStripeCheckoutSession,
  fetchStripeSessionStatus,
};
