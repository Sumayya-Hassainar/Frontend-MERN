// src/components/OrderTrackingSteps.jsx
import React from "react";
import { FaTruck, FaBoxOpen, FaHome, FaCheckCircle } from "react-icons/fa";

const stepsConfig = [
  { key: "Pending", label: "Order Placed" },
  { key: "Shipped", label: "Shipped" },
  { key: "OutForDelivery", label: "Out for Delivery" },
  { key: "Delivered", label: "Delivered" },
];

const iconMap = {
  Pending: FaBoxOpen,
  Shipped: FaTruck,
  OutForDelivery: FaHome,
  Delivered: FaCheckCircle,
};

export default function OrderTrackingSteps({ currentStatus = "Pending" }) {
  const currentIndex =
    stepsConfig.findIndex((step) => step.key === currentStatus) ?? 0;

  return (
    <div className="w-full">
      {/* Step icons */}
      <div className="flex items-center justify-between mb-4">
        {stepsConfig.map((step, index) => {
          const Icon = iconMap[step.key] || FaBoxOpen;
          const isActive = index <= currentIndex;

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg
                  ${isActive ? "bg-indigo-600" : "bg-gray-300"}`}
              >
                <Icon />
              </div>
              <p
                className={`mt-2 text-xs font-medium ${
                  isActive ? "text-indigo-700" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="relative h-1 bg-gray-200 rounded">
        <div
          className="absolute left-0 top-0 h-1 bg-indigo-600 rounded"
          style={{
            width: `${(currentIndex / (stepsConfig.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
