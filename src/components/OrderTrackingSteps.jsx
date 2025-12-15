// src/components/OrderTrackingSteps.jsx
import React from "react";
import {
  FaTruck,
  FaBoxOpen,
  FaHome,
  FaCheckCircle,
} from "react-icons/fa";

/* ================= CONFIG ================= */
const stepsConfig = [
  { key: "Pending", label: "Order Placed", icon: FaBoxOpen },
  { key: "Shipped", label: "Shipped", icon: FaTruck },
  { key: "OutForDelivery", label: "Out for Delivery", icon: FaHome },
  { key: "Delivered", label: "Delivered", icon: FaCheckCircle },
];

/* ================= COMPONENT ================= */
export default function OrderTrackingSteps({
  timeline = [],
  currentStatus = "Pending",
}) {
  // 🔥 SOURCE OF TRUTH
  const latestStatus =
    timeline.length > 0
      ? timeline[timeline.length - 1].status
      : currentStatus;

  const currentIndex = Math.max(
    stepsConfig.findIndex((s) => s.key === latestStatus),
    0
  );

  return (
    <div className="w-full">
      {/* ================= STEPS ================= */}
      <div className="flex items-center justify-between mb-4">
        {stepsConfig.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;

          return (
            <div
              key={step.key}
              className="flex-1 flex flex-col items-center"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg
                ${isActive ? "bg-indigo-600" : "bg-gray-300"}`}
              >
                <Icon />
              </div>

              <p
                className={`mt-2 text-xs font-medium text-center
                ${isActive ? "text-indigo-700" : "text-gray-500"}`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* ================= PROGRESS BAR ================= */}
      <div className="relative h-1 bg-gray-200 rounded">
        <div
          className="absolute left-0 top-0 h-1 bg-indigo-600 rounded transition-all duration-300"
          style={{
            width: `${
              (currentIndex / (stepsConfig.length - 1)) * 100
            }%`,
          }}
        />
      </div>

      {/* ================= TIMELINE LIST ================= */}
      {timeline.length > 0 && (
        <div className="mt-4 space-y-2 text-sm">
          {timeline.map((item, i) => (
            <div
              key={i}
              className="flex justify-between text-gray-600"
            >
              <span>{item.status}</span>
              <span>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
