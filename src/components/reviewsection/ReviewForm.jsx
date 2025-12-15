import React, { useState } from "react";
import { createReview } from "../../api/review";
import StarRatingInput from "./StarRatingInput";

export default function ReviewForm({ productId }) {
  const [rating, setRating] = useState(5); // default 5 stars
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!rating) {
      setError("Please select a rating.");
      setLoading(false);
      return;
    }

    try {
      await createReview({ product: productId, rating, comment });
      setSuccess(true);
      setComment("");
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <p className="text-green-600 text-sm">Thank you for your feedback!</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <StarRatingInput
        value={rating}
        onChange={(value) => setRating(Number(value))}
      />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="w-full border rounded p-2 text-sm"
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
