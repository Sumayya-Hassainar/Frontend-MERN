// src/api/vendorApi.jsx
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/* ===================== AUTH HELPERS ===================== */

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders(extra = {}) {
  const token = getToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

/* ===================== VENDOR AUTH ===================== */

// --- Vendor Register ---
// NOTE: if vendor registration is different (e.g. /vendors/register) change this URL
export async function registerVendor(payload) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Vendor registration failed";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json(); // e.g. { user, token? }
}

// --- Vendor Login ---
export async function loginVendor(payload) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Vendor login failed";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json(); // { token, user }
}

/* ===================== CATEGORIES ===================== */

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`, {
    method: "GET",
  });

  if (!res.ok) {
    let msg = "Failed to fetch categories";
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }

  return res.json(); // expect array: [{ _id, name }, ...]
}

/* ===================== VENDOR PRODUCTS ===================== */

// Get only this vendor's products
// Backend route we are assuming: GET /api/products/vendor/my-products?category=...
export async function getVendorProducts(categoryId) {
  const params = categoryId ? `?category=${categoryId}` : "";
  const res = await fetch(
    `${API_BASE}/products/vendor/my-products${params}`,
    {
      method: "GET",
      headers: authHeaders({
        "Content-Type": "application/json",
      }),
    }
  );

  if (!res.ok) {
    let msg = "Failed to fetch vendor products";
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }

  return res.json(); // should be array OR { products: [...] }
}

/* ----- CREATE product (multipart/form-data) ----- */

export async function createVendorProduct(formData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: authHeaders(), // ⚠️ don't set Content-Type for FormData
    body: formData,
  });

  if (!res.ok) {
    let msg = "Failed to create product";
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }

  return res.json(); // created product
}

/* ----- UPDATE product (multipart/form-data) ----- */

export async function updateVendorProduct(id, formData) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: authHeaders(), // again, no manual Content-Type
    body: formData,
  });

  if (!res.ok) {
    let msg = "Failed to update product";
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }

  return res.json(); // updated product
}

/* ----- DELETE product ----- */

export async function deleteVendorProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
  });

  if (!res.ok) {
    let msg = "Failed to delete product";
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }

  return res.json(); // { message: "Product deleted" }
}
