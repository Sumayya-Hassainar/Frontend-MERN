// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, verifyOtp, forgotPassword } from "../../api/api";

export default function LoginPage({ setRole }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Login | 2 = OTP
  const [showForgot, setShowForgot] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const saveAuth = (res) => {
    localStorage.setItem("token", res.token);
    localStorage.setItem("role", res.role);
    localStorage.setItem("userName", res.user?.name || "");
    setRole?.(res.role);
    navigate(res.role === "admin" ? "/admin/panel" : res.role === "vendor" ? "/vendor" : "/products");
  };

  /* ================= VALIDATION ================= */

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; // simple length check
  };

  const validateOtp = (otp) => {
    return /^\d{6}$/.test(otp); // 6 digit numeric OTP
  };

  /* ================= LOGIN ================= */

  const submitCredentials = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    if (!form.email || !form.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    if (!validatePassword(form.password)) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await loginUser(form);

      if (res?.token && res.role === "admin") {
        saveAuth(res);
        return;
      }

      if (res?.token && (res.role === "vendor" || res.role === "customer")) {
        saveAuth(res);
        return;
      }

      if (res?.otpSent) {
        setStep(2);
        setSuccess("OTP sent to your email");
        return;
      }

      throw new Error("Invalid login response");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP VERIFY ================= */

  const submitOtp = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    if (!otp) {
      setError("OTP is required");
      setLoading(false);
      return;
    }

    if (!validateOtp(otp)) {
      setError("OTP must be a 6-digit number");
      setLoading(false);
      return;
    }

    try {
      const res = await verifyOtp({ email: form.email, otp });
      if (!res?.token) throw new Error("OTP verification failed");
      saveAuth(res);
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORGOT PASSWORD ================= */

  const submitForgotPassword = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    if (!form.email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      await forgotPassword({ email: form.email });
      setSuccess("Password reset link sent to your email");
      setShowForgot(false);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold mb-4">
        {showForgot ? "Forgot Password" : step === 2 ? "Verify OTP" : "Login"}
      </h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      {step === 1 && !showForgot && (
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
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">
            {loading ? "Processing..." : "Login"}
          </button>
          <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-indigo-600 underline">
            Forgot Password?
          </button>
        </form>
      )}

      {step === 2 && !showForgot && (
        <form onSubmit={submitOtp} className="space-y-3 p-4 border rounded">
          <p className="text-sm">
            OTP sent to <b>{form.email}</b>
            <br />
            Dummy OTP: <b>123456</b>
          </p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button type="button" onClick={() => setStep(1)} className="text-sm underline">
            Back to Login
          </button>
        </form>
      )}

      {showForgot && (
        <form onSubmit={submitForgotPassword} className="space-y-3 p-4 border rounded">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          <button type="button" onClick={() => setShowForgot(false)} className="text-sm underline">
            Back to Login
          </button>
        </form>
      )}

      <p className="mt-3 text-xs">
        Don’t have an account?
        <Link to="/register" className="text-indigo-600"> Register</Link>
      </p>
    </div>
  );
}
