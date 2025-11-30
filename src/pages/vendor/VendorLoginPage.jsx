// src/pages/VendorLoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginVendor } from "../../api/vendorApi";

export default function VendorLoginPage({ setRole }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginVendor(form);
      console.log("Vendor login response:", data);

      // token + role store
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("role", "vendor");
      if (setRole) setRole("vendor");

      navigate("/vendor/dashboard");
    } catch (err) {
      console.error("Vendor login error:", err);
      setError(err.message || "Vendor login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Seller Login</h1>
      <p className="text-gray-600 text-sm mb-4">
        Login to manage your products, orders and payouts.
      </p>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 bg-white border rounded-lg p-4">
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Seller email"
          className="border rounded px-3 py-2 text-sm w-full"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="border rounded px-3 py-2 text-sm w-full"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white text-sm font-medium py-2 rounded-md hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login as Seller"}
        </button>
      </form>

      <p className="mt-3 text-xs text-gray-600">
        New to MarketVerse?{" "}
        <Link to="/vendor/register" className="text-indigo-600 hover:underline">
          Become a Seller
        </Link>
      </p>
    </div>
  );
}
