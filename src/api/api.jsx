/* ================= BASE URL ================= */

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://backend-mern-ex49.onrender.com/api";

/* ================= AUTH HEADER ================= */

function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem("token");

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

/* ================= GLOBAL RESPONSE HANDLER ================= */

async function handleResponse(res) {
  let data = {};

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return data;
}

/* ================= AUTH ================= */

// ✅ REGISTER
export async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// ✅ LOGIN
export async function loginUser(payload) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// ✅ OTP VERIFY
export async function verifyOtp(payload) {
  const res = await fetch(`${API_BASE}/users/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// ✅ FORGOT PASSWORD
export async function forgotPassword(payload) {
  const res = await fetch(`${API_BASE}/users/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// ✅ RESET PASSWORD
export async function resetPassword(payload) {
  const res = await fetch(`${API_BASE}/users/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// ✅ GET PROFILE
export async function fetchMyProfile() {
  const res = await fetch(`${API_BASE}/users/profile`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

/* ================= PRODUCTS ================= */

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  return handleResponse(res);
}

export async function fetchProductById(id) {
  if (!id) throw new Error("Product ID is required");

  const res = await fetch(`${API_BASE}/products/${id}`);
  return handleResponse(res);
}

/* ================= ORDERS ================= */

// ✅ ADMIN – GET ALL ORDERS
export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// ✅ CUSTOMER – GET MY ORDERS
export async function fetchMyOrders() {
  const res = await fetch(`${API_BASE}/orders/myorders`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// ✅ CREATE ORDER
export async function createOrder(orderData) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(orderData),
  });

  return handleResponse(res);
}

// ✅ GET SINGLE ORDER BY ID ✅✅ (THIS FIXES YOUR ERROR)
export async function fetchOrderById(orderId) {
  if (!orderId) throw new Error("Order ID is required");

  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

/* ================= STRIPE ================= */

export async function createStripeCheckoutSession(products) {
  const res = await fetch(
    `${API_BASE}/payments/create-checkout-session`,
    {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ products }),
    }
  );

  return handleResponse(res);
}

export async function fetchStripeSessionStatus(sessionId) {
  if (!sessionId) throw new Error("Session ID is required");

  const res = await fetch(
    `${API_BASE}/payments/session-status?session_id=${sessionId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(res);
}

/* ================= PAYMENT ================= */

export async function createPayment(payload) {
  const res = await fetch(`${API_BASE}/payments`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

/* ================= ORDER STATUS ================= */

// ✅ CUSTOMER – GET ALL MY ORDER STATUSES
export async function fetchMyOrderStatuses() {
  const res = await fetch(`${API_BASE}/order-statuses/my`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// ✅ GET STATUS BY ORDER ID ✅✅ (BUG FIXED)
export async function fetchOrderStatusByOrderId(orderId) {
  if (!orderId) throw new Error("Order ID is required");

  const res = await fetch(
    `${API_BASE}/order-statuses/order/${orderId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(res);
}
/* ================= CUSTOMER ORDERS ================= */

// ✅ CUSTOMER – GET MY ORDERS (USED IN HELPDESK)
export async function fetchCustomerOrders() {
  const res = await fetch(`${API_BASE}/orders/my-orders`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}
