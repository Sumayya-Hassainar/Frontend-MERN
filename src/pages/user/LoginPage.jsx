// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/api";

export default function LoginPage({ setRole }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(form); 
      // data = { _id, name, email, role, token }

      // save in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userName", data.name);

      // update app role state
      if (setRole) setRole(data.role);

      // redirect based on role
      if (data.role === "admin") {
        navigate("/admin/panel");
      } else if (data.role === "vendor") {
        navigate("/vendor");
      } else {
        // customer or default → go to products page
        navigate("/products");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      {error && (
        <p className="mb-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-lg border">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Login
        </button>
      </form>

      <p className="mt-3 text-xs text-gray-600">
        Don’t have an account?{" "}
        <Link to="/register" className="text-indigo-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
