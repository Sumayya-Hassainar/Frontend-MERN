// src/api/vendorApi.jsx

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://backend-mern-ex49.onrender.com/api";

/* ================= AUTH HEADER ================= */

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("⚠️ No token found in localStorage");
    return { "Content-Type": "application/json" };
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/* ================= GLOBAL ERROR HANDLER ================= */

async function handleResponse(res, defaultMsg) {
  if (!res.ok) {
    let message = defaultMsg;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

/* ===================== VENDOR AUTH ===================== */

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

/* ===================== CATEGORIES ===================== */

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  return handleResponse(res, "Failed to fetch categories");
}

/* ===================== VENDOR PRODUCTS ===================== */

export async function getVendorProducts(categoryId) {
  const params = categoryId ? `?category=${categoryId}` : "";

  const res = await fetch(
    `${API_BASE}/products/vendor/my-products${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(res, "Failed to fetch vendor products");
}

export async function createVendorProduct(formData) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // ✅ NO JSON HEADER FOR FORM-DATA
    },
    body: formData,
  });

  return handleResponse(res, "Failed to create product");
}

export async function updateVendorProduct(id, formData) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

/* ================= ✅ VENDOR ORDER MASTER STATUS ================= */

// ✅ VENDOR CREATES ORDER STATUS (MASTER)
export async function createVendorOrderStatus(payload) {
  const res = await fetch(`${API_BASE}/order-statuses/vendor`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res, "Failed to create order status");
}

/* ================= ✅ VENDOR ORDERS ================= */

// ✅ GET VENDOR ASSIGNED ORDERS
export async function fetchVendorOrders() {
  const res = await fetch(`${API_BASE}/orders/vendor`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(res, "Failed to fetch vendor orders");
}

// ✅ VENDOR UPDATES REAL ORDER STATUS
export async function updateVendorOrderStatus(orderId, status) {
  const res = await fetch(
    `${API_BASE}/order-statuses/vendor/${orderId}/status`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    }
  );

  return handleResponse(res, "Failed to update order status");
}
