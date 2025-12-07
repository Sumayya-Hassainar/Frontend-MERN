import React, { useState } from "react";
import { createReview } from "../api/review";

export default function ReviewForm({ productId, onReviewCreated }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const review = await createReview({ product: productId, rating, comment });
      onReviewCreated(review); // notify parent to refresh reviews
      setRating(5);
      setComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Error creating review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border rounded dark:border-gray-700">
      <label className="font-medium">Rating:</label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="p-1 border rounded dark:bg-gray-800 dark:text-white"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <label className="font-medium">Comment:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="p-2 border rounded dark:bg-gray-800 dark:text-white"
        rows={4}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
