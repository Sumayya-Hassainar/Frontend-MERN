import axios from "axios";

const API_BASE =import.meta.env.VITE_API_URL || "http://localhost:3000/api"; // replace with your backend URL

const token = localStorage.getItem("token");

// Create a review
export const createReview = async ({ product, rating, comment }) => {
  const res = await axios.post(
    `${API_BASE}/reviews`,
    { product, rating, comment },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Get all reviews
export const getReviews = async (productId) => {
  const res = await axios.get(`${API_BASE}/reviews${productId ? `?product=${productId}` : ""}`);
  return res.data;
};

// Update a review
export const updateReview = async (id, { rating, comment }) => {
  const res = await axios.put(
    `${API_BASE}/reviews/${id}`,
    { rating, comment },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Delete a review
export const deleteReview = async (id) => {
  const res = await axios.delete(`${API_BASE}/reviews/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
