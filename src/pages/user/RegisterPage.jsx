// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // default role
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    console.log("📝 Submitting register form:", form);
    const data = await registerUser(form);
    console.log("✅ Registered:", data);
    navigate("/login");
  } catch (err) {
    console.error("❌ Register error:", err);
    setError(err.message || "Registration failed");
  }
};


  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-4">Create an account</h1>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Register As</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 bg-white"
            required
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700"
        >
          Register
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
