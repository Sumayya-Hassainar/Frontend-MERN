// src/api/api.jsx

// Base URL – override in .env for production:
const API_BASE =
  import.meta.env.VITE_API_URL || "https://backend-mern-ex49.onrender.com/api";

// Helper: auth headers
function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

/* -----------------------------------
   AUTH SECTION
----------------------------------- */

// REGISTER
export async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

/* -----------------------------------
   LOGIN LOGIC (UPDATED)
-----------------------------------

Backend sends:

ADMIN
→ { token, role: "admin", user }

VENDOR (NO OTP)
→ { token, role: "vendor", user }

CUSTOMER
→ FIRST LOGIN → { token, role: "customer", user }
→ OLD LOGIN → { otp_required: true, email, role: "customer" }
*/
export async function loginUser(payload) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

/* -----------------------------------
   OTP VERIFY (CUSTOMERS ONLY)
----------------------------------- */
export async function verifyOtp(payload) {
  const res = await fetch(`${API_BASE}/users/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "OTP verification failed");
  }

  return data;
}

/* -----------------------------------
   PRODUCTS
----------------------------------- */
export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || "Failed to fetch products");
  return data;
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || "Failed to fetch product");
  return data;
}

/* -----------------------------------
   ORDERS
----------------------------------- */

// Admin: all orders
export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
  return data;
}

// Customer: my orders
export async function fetchMyOrders() {
  const res = await fetch(`${API_BASE}/orders/my`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch my orders");
  return data;
}

// Place order
export async function createOrder(payload) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to place order");
  return data;
}

// Order by ID
export async function fetchOrderById(orderId) {
  if (!orderId) throw new Error("Order ID is required");

  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch order");
  return data;
}

/* -----------------------------------
   STRIPE PAYMENT
----------------------------------- */

export async function createStripeCheckoutSession(payload) {
  const res = await fetch(`${API_BASE}/payments/create-checkout-session`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ products: payload }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data.message || "Failed to create checkout session");

  return data;
}

export async function fetchStripeSessionStatus(sessionId) {
  const res = await fetch(
    `${API_BASE}/payments/session-status?session_id=${sessionId}`,
    { headers: getAuthHeaders() }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch session status");

  return data;
}

/* -----------------------------------
   PAYMENT RECORD CREATION
----------------------------------- */

export async function createPayment(payload) {
  const res = await fetch(`${API_BASE}/payments`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to create payment");
  return data;
}

/* -----------------------------------
   ORDER STATUSES
----------------------------------- */

export async function fetchOrderStatuses() {
  const res = await fetch(`${API_BASE}/order-statuses`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch order statuses");

  return data;
}

export async function fetchOrderStatusById(id) {
  const res = await fetch(`${API_BASE}/order-statuses/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch order status");

  return data;
}
