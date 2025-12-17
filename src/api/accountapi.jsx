// src/api/accountapi.jsx

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://backend-mern-ex49.onrender.com/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleJsonResponse(res, defaultMessage = "Request failed") {
  if (!res.ok) {
    let message = defaultMessage;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/* ================= ACCOUNT ================= */

// ✅ GET /api/account/me
export async function fetchMyAccount() {
  const res = await fetch(`${API_BASE}/account/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  return handleJsonResponse(res, "Failed to fetch account");
}

/* ================= USER NOTIFICATIONS ================= */

// ✅ FIXED ✅ GET /api/notifications/my
export async function fetchMyNotifications() {
  const res = await fetch(`${API_BASE}/notifications/my`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  return handleJsonResponse(res, "Failed to fetch notifications");
}

// ✅ FIXED ✅ PUT /api/notifications/read/:id
export async function markNotificationAsRead(id) {
  const res = await fetch(`${API_BASE}/notifications/read/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  return handleJsonResponse(res, "Failed to mark notification as read");
}

// ✅ FIXED ✅ PUT /api/notifications/read-all
export async function markAllNotificationsAsRead() {
  const res = await fetch(`${API_BASE}/notifications/read-all`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  return handleJsonResponse(res, "Failed to mark all notifications as read");
}

/* ================= ADMIN NOTIFICATIONS ================= */

// ✅ GET /api/notifications  (admin)
export async function fetchNotifications() {
  const res = await fetch(`${API_BASE}/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  return handleJsonResponse(res, "Failed to fetch notifications");
}

// ✅ POST /api/notifications   (admin)
export async function createNotification(payload) {
  const res = await fetch(`${API_BASE}/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse(res, "Failed to create notification");
}

