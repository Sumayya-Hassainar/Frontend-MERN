import React from "react";

export default function StarRatingDisplay({ count = 5 }) {
  return (
    <div className="flex gap-1">
      {[...Array(count)].map((_, i) => (
        <span key={i} className="text-yellow-400 text-xl">★</span>
      ))}
    </div>
  );
}
