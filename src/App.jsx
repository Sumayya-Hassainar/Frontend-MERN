// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

// Layout
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";

// Common pages
import Home from "./pages/common/Home.jsx";
import WishlistPage from "./pages/common/WishlistPage.jsx";
import MyAccount from "./pages/common/MyAccount.jsx";
import SearchResults from "./pages/common/SearchResults.jsx";

// User pages
import Products from "./pages/user/Products.jsx";
import ProductDetailPage from "./pages/user/ProductDetails.jsx";
import CartPage from "./pages/user/CartPage.jsx";
import CheckoutPage from "./pages/user/CheckoutPage.jsx";
import PaymentPage from "./pages/user/PaymentPage.jsx";
import OrdersPage from "./pages/user/OrdersPage.jsx";
import OrderDetailPage from "./pages/user/OrderDetailPage.jsx";
import LoginPage from "./pages/user/LoginPage.jsx";
import RegisterPage from "./pages/user/RegisterPage.jsx";

// Review components
import ReviewList from "./components/ReviewList.jsx";
import ReviewForm from "./components/ReviewForm.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminPanel from "./pages/admin/AdminPanel.jsx";

// Vendor pages
import VendorLandingPage from "./pages/vendor/VendorLandingPage.jsx";
import VendorRegisterPage from "./pages/vendor/VendorRegisterPage.jsx";
import VendorLoginPage from "./pages/vendor/VendorLoginPage.jsx";
import VendorDashboard from "./pages/vendor/VendorDashboard.jsx";

// API
import { fetchMyNotifications, markNotificationAsRead } from "./api/accountapi.jsx";

// Wrapper component for Reviews using useParams
const ProductReviews = ({ role }) => {
  const { id } = useParams();
  return (
    <>
      <ReviewForm productId={id} onReviewCreated={() => {}} />
      <ReviewList productId={id} userRole={role} />
    </>
  );
};

function App() {
  const [role, setRole] = useState("guest");
  const [theme, setTheme] = useState("light");
  const [query, setQuery] = useState(""); // live search query

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load role + theme on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) setRole(savedRole);

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (role !== "guest") loadNotifications();
  }, [role]);

  const loadNotifications = async () => {
    try {
      const data = await fetchMyNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <Provider store={store}>
      <div
        className={`flex flex-col min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-white text-black" : "bg-white text-black"
        }`}
      >
        {/* Header with live search */}
        <Header
          role={role}
          setRole={setRole}
          theme={theme}
          setTheme={toggleTheme}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={handleMarkAsRead}
          query={query}
          setQuery={setQuery}
        />

        <main className="flex-1">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home query={query} />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<LoginPage setRole={setRole} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<Products query={query} />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/reviews" element={<ProductReviews role={role} />} />
            <Route path="/search" element={<SearchResults query={query} />} />

            {/* USER PROTECTED ROUTES */}
            <Route
              path="/myaccount"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <MyAccount />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />

            {/* ADMIN ROUTES */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/panel"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* VENDOR ROUTES */}
            <Route path="/vendor/become-seller" element={<VendorLandingPage />} />
            <Route path="/vendor/register" element={<VendorRegisterPage />} />
            <Route path="/vendor/login" element={<VendorLoginPage setRole={setRole} />} />
            <Route
              path="/vendor/dashboard"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-3xl font-bold mb-2">404</h1>
                  <p className="text-gray-600 dark:text-gray-300">Page not found</p>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Provider>
  );
}

export default App;
