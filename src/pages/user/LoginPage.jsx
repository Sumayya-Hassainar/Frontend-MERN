// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, verifyOtp } from "../../api/api";

export default function LoginPage({ setRole }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // -------------------------
  // LOGIN SUBMIT
  // -------------------------
  const submitCredentials = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);

      // ADMIN LOGIN
      if (res?.token && res.role === "admin") {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", "admin");
        localStorage.setItem("userName", res.user?.name || "");
        if (setRole) setRole("admin");
        navigate("/admin/panel");
        return;
      }

      // NEW USER LOGIN
      if (res?.token && (res.role === "vendor" || res.role === "customer")) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);
        localStorage.setItem("userName", res.user?.name || "");
        if (setRole) setRole(res.role);
        navigate(res.role === "vendor" ? "/vendor" : "/products");
        return;
      }

      // OLD USER → OTP REQUIRED
      setStep(2);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // OTP SUBMIT
  // -------------------------
  const submitOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await verifyOtp({ email: form.email, otp });

      if (res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);
        localStorage.setItem("userName", res.user?.name || "");

        if (setRole) setRole(res.role);
        navigate(res.role === "vendor" ? "/vendor" : "/products");
        return;
      }

      setError("Invalid OTP");
    } catch {
      setError("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      {error && <p className="text-red-600">{error}</p>}

      {/* LOGIN FORM */}
      {step === 1 && (
        <form onSubmit={submitCredentials} className="space-y-3 p-4 border rounded">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>
      )}

      {/* OTP FORM */}
      {step === 2 && (
        <form onSubmit={submitOtp} className="space-y-3 p-4 border rounded">
          <p className="text-sm">
            OTP sent to <b>{form.email}</b>  
            <br />Use dummy OTP: <b>123456</b>
          </p>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button type="button" onClick={() => setStep(1)} className="text-sm underline">
            Back to Login
          </button>
        </form>
      )}

      <p className="mt-3 text-xs">
        Don't have an account?
        <Link to="/register" className="text-indigo-600"> Register</Link>
      </p>
    </div>
  );
}
