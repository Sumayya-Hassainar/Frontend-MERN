// src/api/accountapi.jsx
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleJsonResponse(res, defaultMessage) {
  if (!res.ok) {
    let message = defaultMessage;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch (err) {}
    throw new Error(message);
  }
  return res.json();
}

// ✅ Matches /api/account GET
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
