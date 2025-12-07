import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalItems } from "../redux/slice/CartSlice.jsx";
import { fetchProducts } from "../api/api.jsx"; // ✅ ADD THIS

export default function Header({
  role,
  setRole,
  notifications = [],
  unreadCount = 0,
  onMarkAsRead = () => {},
  query = "",
  setQuery = () => {},
  showSearch = false,
}) {
  const [theme, setTheme] = useState("light");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // ✅ SEARCH SUGGESTION STATES
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useSelector(selectTotalItems);

  const shouldShowSearch =
    showSearch || location.pathname === "/" || location.pathname === "/search";

  // ✅ LOAD PRODUCTS ONCE FOR SEARCH
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

  // ✅ FILTER SUGGESTIONS ON TYPE
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matches = allProducts
      .filter((p) =>
        p.name?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 6); // ✅ limit to 6 results

    setSuggestions(matches);
    setShowSuggestions(true);
  }, [query, allProducts]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole("guest");
    navigate("/login");
  };

  // ✅ ENTER KEY SEARCH
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      navigate("/search");
    }
  };

  return (
    <>
      {/* ================= TOP HEADER ================= */}
      <header className="bg-[#2874F0] dark:bg-gray-900 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4 relative">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-xl">MarketVerse</span>
            <span className="text-xs text-yellow-200">Explore Plus</span>
          </Link>

          {/* ✅ LIVE SEARCH */}
          {shouldShowSearch && (
            <div className="flex-1 max-w-md ml-4 relative">
              <div className="flex">
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
                  className="bg-white text-black px-4 py-1.5 text-sm rounded-r"
                  onClick={() => navigate("/search")}
                >
                  🔍
                </button>
              </div>

              {/* ✅ SUGGESTION DROPDOWN */}
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
          )}

          {/* DARK MODE */}
          <button
            onClick={toggleTheme}
            className="text-sm bg-white text-[#2874F0] px-3 py-1 rounded"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* NOTIFICATIONS */}
          {role !== "guest" && (
            <div className="relative">
              <button onClick={() => setShowNotifDropdown(!showNotifDropdown)}>
                🔔
              </button>

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-black rounded shadow-lg">
                  {notifications.length === 0 && (
                    <p className="p-3 text-sm">No notifications</p>
                  )}

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

          {/* CART */}
          <Link to="/cart" className="hidden md:flex items-center gap-1 relative">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* AUTH */}
          {role === "guest" ? (
            <div className="hidden md:flex gap-2">
              <Link to="/login" className="bg-white text-[#2874F0] px-3 py-1 rounded">
                Login
              </Link>
              <Link to="/register" className="border px-3 py-1 rounded">
                Sign Up
              </Link>
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
      </header>
    </>
  );
}
