import React, { useEffect, useState } from "react";
import { getReviews, deleteReview } from "../../api/review";

export default function AdminReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviews(); // admin sees all reviews
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
  }, []);

  if (loading) return <p className="p-4">Loading reviews...</p>;
  if (reviews.length === 0) return <p className="p-4">No reviews found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Review Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">User</th>
              <th className="px-4 py-2 text-left text-gray-700">Product</th>
              <th className="px-4 py-2 text-left text-gray-700">Rating</th>
              <th className="px-4 py-2 text-left text-gray-700">Comment</th>
              <th className="px-4 py-2 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{r.user?.name || "Anonymous"}</td>
                <td className="px-4 py-3">{r.product?.name || r.product}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      r.rating >= 4
                        ? "text-green-500 font-semibold"
                        : r.rating === 3
                        ? "text-yellow-500 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </span>
                </td>
                <td className="px-4 py-3">{r.comment}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
