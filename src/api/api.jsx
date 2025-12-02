// src/api/api.jsx

// Base URL – override in .env for production:
const API_BASE =
  import.meta.env.VITE_API_URL || "https://backend-mern-ex49.onrender.com/api";

// Helper: get default headers with optional auth
function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

// ---------- PRODUCTS ----------
export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch products");
  }
  return data;
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch product");
  }
  return data;
}

// ---------- AUTH ----------
export async function registerUser(payload) {
  const url = `${API_BASE}/users/register`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }
  return data;
}

export async function loginUser(payload) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    let message = "Login failed";
    if (data?.message) message = data.message;
    throw new Error(message);
  }
  // backend (including fixed admin) returns { _id, name, email, role, token, ... }
  return data;
}
export async function verifyOtp(data) {
  const res = await fetch(`${API_BASE}/users/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ---------- ORDERS ----------

// Admin-only: fetch all orders
export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }
  return data;
}

// Customer: fetch logged-in user’s orders
export async function fetchMyOrders() {
  const res = await fetch(`${API_BASE}/orders/my`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch my orders");
  }
  return data;
}

// Create a new order
export async function createOrder(payload) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to place order");
  }
  return data;
}

// Fetch a single order by ID (for order details page)
export async function fetchOrderById(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch order");
  }

  return data;
}

// ---------- STRIPE PAYMENTS ----------
export async function createStripeCheckoutSession(productsPayload) {
  const res = await fetch(`${API_BASE}/payments/create-checkout-session`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ products: productsPayload }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to create checkout session");
  }
  return data;
}

export async function fetchStripeSessionStatus(sessionId) {
  const res = await fetch(
    `${API_BASE}/payments/session-status?session_id=${sessionId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch session status");
  }
  return data;
}

// ---------- PAYMENTS ----------
export async function createPayment(paymentPayload) {
  const res = await fetch(`${API_BASE}/payments`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(paymentPayload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to create payment");
  }
  return data;
}

// ---------- ORDER STATUSES ----------
export async function fetchOrderStatuses() {
  const res = await fetch(`${API_BASE}/order-statuses`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch order statuses");
  }

  return data;
}

// Get single status by id – optional
export async function fetchOrderStatusById(id) {
  const res = await fetch(`${API_BASE}/order-statuses/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch order status");
  }

  return data;
}
