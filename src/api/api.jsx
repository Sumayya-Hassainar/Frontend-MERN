// src/api/api.jsx
const API_BASE = import.meta.env.VITE_API_URL ||"http://localhost:3000/api"

// ---------- PRODUCTS ----------
export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// ---------- AUTH ----------
export async function registerUser(payload) {
  const url = `${API_BASE}/users/register`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Registration failed");
  }
  return res.json();
}

export async function loginUser(payload) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Login failed";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json(); // { token, ... }
}

// ---------- ORDERS ----------

// Admin-only: fetch all orders
export async function fetchOrders() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/orders`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }
  return data;
}

// Customer: fetch logged-in user’s orders
export async function fetchMyOrders() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/orders/my`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch my orders");
  }
  return data;
}

// Create a new order
export async function createOrder(payload) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
  const token = localStorage.getItem("token");

  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch order");
  }

  return data;
}

// ---------- STRIPE PAYMENTS ----------
export async function createStripeCheckoutSession(productsPayload) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/payments/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ products: productsPayload }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to create checkout session");
  }
  return data;
}

export async function fetchStripeSessionStatus(sessionId) {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${API_BASE}/payments/session-status?session_id=${sessionId}`,
    {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(paymentPayload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to create payment");
  }
  return data;
}
// ---------- ORDER STATUSES (ADMIN + PUBLIC FETCH) ----------

// Get all statuses (for admin screen, if needed)
export async function fetchOrderStatuses() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/order-status`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to fetch order statuses");
  }

  return res.json();
}

// (Optional) Get single status by id – probably not needed for tracking UI
export async function fetchOrderStatusById(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/order-status/${id}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to fetch order status");
  }

  return res.json();
}
