// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalItems } from "../redux/slice/CartSlice.jsx";

export default function Header({ role, setRole }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // ✅ get totalItems from Redux
  const totalItems = useSelector(selectTotalItems);
  

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole && setRole("guest");
    navigate("/login");
  };

  return (
    <header className="bg-[#2874F0] text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-semibold text-xl tracking-tight">
            MarketVerse
          </span>
          <span className="text-xs text-yellow-200">Explore Plus</span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex-1 flex items-center max-w-md ml-4"
        >
          <input
            type="text"
            value={query}
            placeholder="Search for products, brands and more"
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-l-sm border-none px-3 py-1.5 text-sm text-black focus:outline-none"
          />
          <button
            type="submit"
            className="bg-white text-[#2874F0] text-sm px-4 py-1.5 rounded-r-sm font-medium"
          >
            Search
          </button>
        </form>

        {/* Become a Seller */}
        <button
          onClick={() => navigate("/vendor/become-seller")}
          className="hidden md:inline-flex text-sm font-medium px-3 py-1 rounded hover:bg-[#255fcb]"
        >
          Become a Seller
        </button>

        {/* Cart link with badge */}
        <Link
          to="/cart"
          className="hidden md:inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded hover:bg-[#255fcb] relative"
        >
          <span>🛒</span>
          <span>Cart</span>

          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1.5 py-0.5">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Auth area */}
        {role === "guest" || !role ? (
          <div className="hidden sm:flex items-center gap-2 text-sm ml-3">
            <Link
              to="/login"
              className="px-3 py-1 bg-white text-[#2874F0] rounded text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 bg-transparent border border-white rounded text-sm font-medium"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-3 text-sm ml-3">
            {role === "vendor" && (
              <Link to="/vendor" className="hover:underline">
                Vendor Dashboard
              </Link>
            )}
            {role === "admin" && (
              <Link to="/admin" className="hover:underline">
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-white text-[#2874F0] rounded text-sm font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Bottom nav bar */}
      <div className="hidden md:block bg-[#2463d0]">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center gap-6 text-sm">
          <Link to="/products" className="cursor-pointer hover:underline">
            Products
          </Link>
          <Link to="/orders" className="cursor-pointer hover:underline">
            Orders
          </Link>
          <Link to="/wishlist" className="cursor-pointer hover:underline">
            Wishlist
          </Link>
          <Link to="/account" className="cursor-pointer hover:underline">
            My Account
          </Link>
        </div>
      </div>
    </header>
  );
}
