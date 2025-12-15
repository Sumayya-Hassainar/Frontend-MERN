// src/api/reviewApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");
  return { Authorization: `Bearer ${token}` };
};

// ================= CREATE =================
export const createReview = async ({ product, rating, comment }) => {
  try {
    const response = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        product,                // must be a valid ObjectId string
        rating: Number(rating), // ensure it's a number
        comment,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create review");
    }

    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};


// ================= GET =================
// GET all reviews for admin
export const getReviews = async () => {
  const { data } = await axios.get(`${API_BASE}/reviews`, {
    headers: authHeaders(),
  });
  return data;
};
// ================= UPDATE =================
export const updateReview = async (id, { rating, comment }) => {
  const res = await axios.put(
    `${API_BASE}/review/${id}`,
    { rating, comment },
    { headers: authHeaders() }
  );
  return res.data;
};

// ================= DELETE =================
export const deleteReview = async (id) => {
  const { data } = await axios.delete(`${API_BASE}/reviews/${id}`, {
    headers: authHeaders(),
  });
  return data;
};