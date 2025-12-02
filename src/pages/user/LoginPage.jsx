// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, verifyOtp } from "../../api/api";

export default function LoginPage({ setRole }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = credentials, 2 = otp
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitCredentials = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(form);
      // if admin => backend returns token immediately
      if (res?.token && res.role === "admin") {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", "admin");
        localStorage.setItem("userName", res.user?.name || "");
        if (setRole) setRole("admin");
        navigate("/admin/panel");
        return;
      }

      // else OTP sent (for vendor/customer)
      // backend returns { message: "OTP sent...", email, role, user }
      setStep(2);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verifyOtp({ email: form.email, otp });
      // res => { token, role, user }
      if (res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);
        localStorage.setItem("userName", res.user?.name || "");
        if (setRole) setRole(res.role);

        if (res.role === "vendor") navigate("/vendor");
        else if (res.role === "admin") navigate("/admin/panel");
        else navigate("/products");
      } else {
        setError("No token returned from server");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {step === 1 && (
        <form onSubmit={submitCredentials} className="space-y-3 bg-white p-4 rounded-lg border">
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
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submitOtp} className="space-y-3 bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-700">OTP sent to <b>{form.email}</b>. Check your email.</p>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border rounded-md py-2 text-sm"
            >
              Back
            </button>
          </div>
        </form>
      )}

      <p className="mt-3 text-xs text-gray-600">
        Don’t have an account?{" "}
        <Link to="/register" className="text-indigo-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
