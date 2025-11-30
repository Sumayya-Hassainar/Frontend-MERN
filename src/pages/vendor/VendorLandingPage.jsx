// src/pages/VendorLandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function VendorLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Become a Seller</h1>
      <p className="text-gray-600 text-sm mb-6">
        Start selling on MarketVerse and reach customers across India.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-4 text-sm">
          <h2 className="font-semibold mb-2">Zero Cost Listing</h2>
          <p className="text-gray-600">
            Add unlimited products with no listing fee. Pay only a small
            commission when you get orders.
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-sm">
          <h2 className="font-semibold mb-2">Easy Dashboard</h2>
          <p className="text-gray-600">
            Manage inventory, prices, orders and payments from one place.
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-sm">
          <h2 className="font-semibold mb-2">Secure Payments</h2>
          <p className="text-gray-600">
            Receive timely payouts directly to your bank after successful
            deliveries.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6 text-sm">
        <h3 className="font-semibold mb-2">How it works</h3>
        <ol className="list-decimal list-inside text-gray-700 space-y-1">
          <li>Register as a vendor with your business and bank details.</li>
          <li>Login to your vendor account and access the dashboard.</li>
          <li>Add products, set prices and start receiving orders.</li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate("/vendor/register")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Start Selling – Register as Vendor
        </button>
        <button
          onClick={() => navigate("/vendor/login")}
          className="border border-indigo-600 text-indigo-600 px-5 py-2 rounded-md text-sm font-medium hover:bg-indigo-50"
        >
          Already a Seller? Login
        </button>
      </div>
    </div>
  );
}
