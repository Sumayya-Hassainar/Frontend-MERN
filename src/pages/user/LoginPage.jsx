// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, verifyOtp } from "../../api/api";

export default function LoginPage({ setRole }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = login → 2 = OTP verify
  const [tempUserId, setTempUserId] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // STEP 1 → LOGIN + SEND OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(form); 
      // response → { message: "OTP sent", userId }

      setTempUserId(res.userId);
      setStep(2); // move to OTP screen
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  // STEP 2 → VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await verifyOtp({ userId: tempUserId, otp });

      // data → { token, role, name, email }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userName", data.name);

      if (setRole) setRole(data.role);

      // Redirect by role
      if (data.role === "admin") {
        navigate("/admin/panel");
      } else if (data.role === "vendor") {
        navigate("/vendor");
      } else {
        navigate("/products");
      }
    } catch (err) {
      setError(err.message || "OTP Verification Failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold mb-4">
        {step === 1 ? "Login" : "Verify OTP"}
      </h1>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {/* STEP 1 — LOGIN */}
      {step === 1 && (
        <form onSubmit={handleLogin} className="space-y-3 bg-white p-4 rounded-lg border">
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
            Send OTP
          </button>
        </form>
      )}

      {/* STEP 2 — OTP VERIFY */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-3 bg-white p-4 rounded-lg border">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700"
          >
            Verify OTP
          </button>
        </form>
      )}

      {step === 1 && (
        <p className="mt-3 text-xs text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      )}
    </div>
  );
}
