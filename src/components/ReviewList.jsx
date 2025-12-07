import React, { useEffect, useState } from "react";
import { getReviews, deleteReview } from "../api/review";

export default function ReviewList({ productId, userRole }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviews(productId);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(id);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  if (loading) return <p>Loading reviews...</p>;
  if (reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((r) => (
        <div
          key={r._id}
          className="p-3 border rounded dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex justify-between">
            <strong>{r.user?.name || "Anonymous"}</strong>
            <span>Rating: {r.rating} ⭐</span>
          </div>
          <p>{r.comment}</p>
          <small>Sentiment: {r.sentiment}</small>

          {userRole === "customer" && r.user?._id === localStorage.getItem("userId") && (
            <button
              onClick={() => handleDelete(r._id)}
              className="mt-2 text-red-500 text-sm"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
