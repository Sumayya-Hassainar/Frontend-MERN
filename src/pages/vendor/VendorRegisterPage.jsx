// src/pages/VendorRegisterPage.jsx
import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { registerVendor } from "../../api/vendorApi";

export default function VendorRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",          // owner name (User)
    email: "",
    password: "",
    shopName: "",
    description: "",
    gstNumber: "",
    address: "",
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Payload shape – match whatever your backend expects
      const payload = {
        // if your backend simultaneously creates User + Vendor:
        name: form.name,
        email: form.email,
        password: form.password,
        shopName: form.shopName,
        description: form.description,
        gstNumber: form.gstNumber,
        address: form.address,
        bankDetails: {
          accountName: form.accountName,
          accountNumber: form.accountNumber,
          ifscCode: form.ifscCode,
          bankName: form.bankName,
        },
      };

      const data = await registerVendor(payload);
      console.log("Vendor register response:", data);

      alert("Vendor registration successful! Please login as vendor.");
      navigate("/vendor/login");
    } catch (err) {
      console.error("Vendor register error:", err);
      setError(err.message || "Vendor registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Become a Seller</h1>
      <p className="text-gray-600 text-sm mb-4">
        Create your seller account to list products, manage orders and grow your business.
      </p>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 space-y-4">
        {/* Owner / user details */}
        <div>
          <h2 className="text-sm font-semibold mb-2">Account Details</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="border rounded px-3 py-2 text-sm w-full"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
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
          </div>
        </div>

        {/* Shop details */}
        <div>
          <h2 className="text-sm font-semibold mb-2">Shop Details</h2>
          <div className="space-y-3">
            <input
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              placeholder="Shop name"
              className="border rounded px-3 py-2 text-sm w-full"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your shop / products"
              className="border rounded px-3 py-2 text-sm w-full"
              rows={3}
            />
            <input
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
              placeholder="GST Number (optional)"
              className="border rounded px-3 py-2 text-sm w-full"
            />
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Business address"
              className="border rounded px-3 py-2 text-sm w-full"
            />
          </div>
        </div>

        {/* Bank details */}
        <div>
          <h2 className="text-sm font-semibold mb-2">Bank Details</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              name="accountName"
              value={form.accountName}
              onChange={handleChange}
              placeholder="Account holder name"
              className="border rounded px-3 py-2 text-sm w-full"
            />
            <input
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="Account number"
              className="border rounded px-3 py-2 text-sm w-full"
            />
            <input
              name="ifscCode"
              value={form.ifscCode}
              onChange={handleChange}
              placeholder="IFSC code"
              className="border rounded px-3 py-2 text-sm w-full"
            />
            <input
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              placeholder="Bank name"
              className="border rounded px-3 py-2 text-sm w-full"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Creating seller account..." : "Create Seller Account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/vendor/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
