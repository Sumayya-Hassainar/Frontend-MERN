import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalItems } from "../redux/slice/CartSlice.jsx";
import { fetchProducts } from "../api/api.jsx";

export default function Header({
  role,
  setRole,
  notifications = [],
  unreadCount = 0,
  onMarkAsRead = () => { },
  query,
  setQuery,
}) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useSelector(selectTotalItems);

  // Load products for search
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setAllProducts(data || []);
      } catch (err) {
        console.error("Search product load error:", err);
      }
    };
    loadProducts();
  }, []);

  // Filter suggestions
  useEffect(() => {
    if (!query?.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const matches = allProducts
      .filter((p) => p.name?.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
    setSuggestions(matches);
    setShowSuggestions(true);
  }, [query, allProducts]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole("guest");
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      navigate("/search");
    }
  };
    // THEME STATE
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  // Apply theme on mount & when theme changes
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");



  return (
    <>
      {/* ================= TOP HEADER ================= */}
      <header className="bg-[#2874F0] dark:bg-yellow-500 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4 relative">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-xl">MarketVerse</span>
            <span className="text-xs text-yellow-200">Explore Plus</span>
          </Link>

          {/* SEARCH */}
          <div className="flex-1 flex max-w-md ml-4 relative">
            <input
              type="text"
              value={query}
              placeholder="Search products..."
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              onFocus={() => query && setShowSuggestions(true)}
              className="w-full px-3 py-1.5 text-sm text-white rounded-l"
            />
            <button
              type="button"
              className="bg-white text-black px-4 py-1.5 text-sm rounded-r"
              onClick={() => navigate("/search")}
            >
              🔍
            </button>

            {/* SUGGESTIONS */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 bg-white text-black rounded shadow-lg mt-1 z-50 max-h-72 overflow-y-auto">
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      navigate(`/products/${item._id}`);
                      setShowSuggestions(false);
                      setQuery("");
                    }}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 border-b"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded bg-teal-600 text-white"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

          {/* NOTIFICATIONS */}
          {role !== "guest" && (
            <div className="relative">
              <button onClick={() => setShowNotifDropdown(!showNotifDropdown)}>🔔</button>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-black rounded shadow-lg">
                  {notifications.length === 0 && <p className="p-3 text-sm">No notifications</p>}
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      className="p-2 border-b cursor-pointer hover:bg-gray-100"
                      onClick={() => onMarkAsRead(n._id)}
                    >
                      <p className="text-sm">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DESKTOP BECOME SELLER */}
          {role !== "vendor" && (
            <button
              onClick={() => navigate("/vendor/become-seller")}
              className="hidden md:block text-sm px-3 py-1 rounded hover:bg-[#255fcb]"
            >
              Become a Seller
            </button>
          )}

          {/* DESKTOP CART */}
          <Link to="/cart" className="hidden md:flex items-center gap-1 relative">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* DESKTOP AUTH */}
          {role === "guest" ? (
            <div className="hidden md:flex gap-2">
              <Link to="/login" className="bg-white text-[#2874F0] px-3 py-1 rounded">Login</Link>
              <Link to="/register" className="border px-3 py-1 rounded">Sign Up</Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="hidden md:block bg-white text-[#2874F0] px-3 py-1 rounded"
            >
              Logout
            </button>
          )}
        </div>

        {/* DESKTOP BOTTOM NAV */}
        <div className="hidden md:block bg-yellow-300">
          <div className="max-w-7xl mx-auto px-4 h-10 flex items-center gap-6 text-sm">
            <Link to="/products">Products</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/myaccount">My Account</Link>
            <Link to="/contact">💬 Contact</Link>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
        <div className="flex justify-around items-center h-14 text-xs">
          <Link to="/products" className="flex flex-col items-center">🛍️ Products</Link>
          <Link to="/orders" className="flex flex-col items-center">📦 Orders</Link>
          {role !== "vendor" && (
            <Link to="/cart" className="flex flex-col items-center text-blue-600 font-bold">🛒 Cart</Link>
          )}
          <Link to="/wishlist" className="flex flex-col items-center">❤️ Wishlist</Link>
          <Link to="/contact" className="flex flex-col items-center">💬 Contact</Link>
        </div>
      </div>
    </>
  );
}
