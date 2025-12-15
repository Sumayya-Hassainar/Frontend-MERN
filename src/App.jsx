// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

// ================= LAYOUT =================
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";

// ✅ ADMIN + VENDOR HEADERS
import AdminHeader from "./pages/admin/AdminHeader.jsx";
import VendorHeader from "./pages/vendor/VendorHeader.jsx";

// ================= COMMON PAGES =================
import Home from "./pages/common/Home.jsx";
import WishlistPage from "./pages/common/WishlistPage.jsx";
import MyAccount from "./pages/common/MyAccount.jsx";
import SearchResults from "./pages/common/SearchResults.jsx";
import HelpDesk from "./pages/common/HelpDesk.jsx";

// ================= USER PAGES =================
import Products from "./pages/user/Products.jsx";
import ProductDetailPage from "./pages/user/ProductDetails.jsx";
import CartPage from "./pages/user/CartPage.jsx";
import CheckoutPage from "./pages/user/CheckoutPage.jsx";
import PaymentPage from "./pages/user/PaymentPage.jsx";
import OrdersPage from "./pages/user/OrdersPage.jsx";
import OrderDetailPage from "./pages/user/OrderDetailPage.jsx";
import LoginPage from "./pages/user/LoginPage.jsx";
import RegisterPage from "./pages/user/RegisterPage.jsx";

// ================= REVIEWS =================
import ReviewList from "./components/reviewsection/ReviewForm.jsx";

// ================= ADMIN PAGES =================
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminPanel from "./pages/admin/AdminPanel.jsx";
import AdminOrders from "./pages/admin/AdminOrder.jsx";
import AdminOrderHandle from "./pages/admin/AdminOrderHandle.jsx"
import AdminReviewList from "./pages/admin/AdminReviewList.jsx";

// ================= VENDOR PAGES =================
import VendorLandingPage from "./pages/vendor/VendorLandingPage.jsx";
import VendorRegisterPage from "./pages/vendor/VendorRegisterPage.jsx";
import VendorLoginPage from "./pages/vendor/VendorLoginPage.jsx";
import VendorDashboard from "./pages/vendor/VendorDashboard.jsx";
import VendorOrders from "./pages/vendor/VendorOrders.jsx"

// ================= API =================
import { fetchMyNotifications, markNotificationAsRead } from "./api/accountapi.jsx";
import ResetPassword from "./utils/ResetPassword.jsx";
import UserManage from "./pages/admin/UserManage.jsx";

// ================= REVIEW WRAPPER =================
const ProductReviews = ({ role }) => {
  const { id } = useParams();
  return (
    <>
      <ReviewForm productId={id} />
      <ReviewList productId={id} userRole={role} />
    </>
  );
};

function App() {
  const [role, setRole] = useState("guest");
  const [theme, setTheme] = useState("light");
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // =============== LOAD ROLE & THEME ===============
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) setRole(savedRole);

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // =============== LOAD NOTIFICATIONS ===============
  useEffect(() => {
    if (role !== "guest") loadNotifications();
  }, [role]);

  const loadNotifications = async () => {
    try {
      const data = await fetchMyNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Notification error:", err);
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
      console.error("Mark read failed:", err);
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
      <div className="flex flex-col min-h-screen bg-white text-black">

        {/* ================= ROLE BASED HEADER ================= */}
        {role === "admin" ? (
          <AdminHeader setRole={setRole} />
        ) : role === "vendor" ? (
          <VendorHeader setRole={setRole} />
        ) : (
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
        )}

        <main className="flex-1">
          <Routes>

            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<Home query={query} />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<LoginPage setRole={setRole} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<Products query={query} />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/reviews" element={<ProductReviews role={role} />} />
            <Route path="/search" element={<SearchResults query={query} />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* ================= CUSTOMER ================= */}
            <Route path="/myaccount" element={<ProtectedRoute allowedRoles={["customer"]}><MyAccount /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute allowedRoles={["customer"]}><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute allowedRoles={["customer"]}><CheckoutPage /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute allowedRoles={["customer"]}><PaymentPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute allowedRoles={["customer"]}><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute allowedRoles={["customer"]}><OrderDetailPage /></ProtectedRoute>} />

            {/* ================= HELP DESK ================= */}
            <Route path="/help-desk" element={<ProtectedRoute allowedRoles={["customer", "vendor"]}><HelpDesk /></ProtectedRoute>} />

            {/* ================= ADMIN ================= */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["admin"]}><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/orders/:id/handle" element={<ProtectedRoute allowedRoles={["admin"]}><AdminOrderHandle /></ProtectedRoute>} />
            <Route path="/admin/panel" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPanel /></ProtectedRoute>} />
            <Route path="/admin/review" element={<ProtectedRoute allowedRoles={["admin"]}><AdminReviewList /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><UserManage/></ProtectedRoute>} />


            {/* ================= VENDOR ================= */}
            <Route path="/vendor/become-seller" element={<VendorLandingPage />} />
            <Route path="/vendor/register" element={<VendorRegisterPage />} />
            <Route path="/vendor/login" element={<VendorLoginPage setRole={setRole} />} />
            <Route path="/vendor/dashboard" element={<ProtectedRoute allowedRoles={["vendor"]}><VendorDashboard /></ProtectedRoute>} />
             <Route path="/vendor/orders" element={<ProtectedRoute allowedRoles={["vendor"]}><VendorOrders /></ProtectedRoute>} />


            {/* ================= 404 ================= */}
            <Route
              path="*"
              element={
                <div className="p-10 text-center">
                  <h1 className="text-3xl font-bold">404</h1>
                  <p>Page not found</p>
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
