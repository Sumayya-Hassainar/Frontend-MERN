// src/pages/vendor/VendorHeader.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function VendorHeader({ setRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    if (setRole) setRole("guest");
    navigate("/vendor/login");
  };

  return (
    <header className="bg-indigo-300 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">Vendor Panel</h1>
      <nav className="space-x-4 text-sm">
        <Link to="/vendor/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/vendor/orders" className="hover:underline">
          Orders
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-white"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
