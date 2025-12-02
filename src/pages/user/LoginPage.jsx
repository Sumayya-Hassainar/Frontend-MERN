import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, verifyOtp } from "../../api/api";

export default function LoginPage({ setRole }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = login, 2 = OTP
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Step 1: Submit email + password → send OTP
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(form);
      console.log(res);
      setStep(2); // move to OTP screen
    } catch (err) {
      setError(err.message);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await verifyOtp({ email: form.email, otp });

      // Save info
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("userName", res.user?.name);

      if (setRole) setRole(res.role);

      if (res.role === "admin") navigate("/admin/panel");
      else if (res.role === "vendor") navigate("/vendor");
      else navigate("/products");
    } catch (err) {
      setError(err.message || "Invalid OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      {error && <p className="text-red-600">{error}</p>}

      {step === 1 && (
        <form onSubmit={handleLoginSubmit} className="space-y-3">
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
          <button className="w-full bg-indigo-600 text-white py-2">
            Send OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleOtpSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border px-3 py-2"
          />
          <button className="w-full bg-green-600 text-white py-2">
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
}
