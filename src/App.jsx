// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./redux/store";

// ---------- Layout ----------
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";

// ---------- Common pages ----------
import Home from "./pages/common/Home.jsx";
import WishlistPage from "./pages/common/WishlistPage.jsx";

// ---------- User pages ----------
import Products from "./pages/user/Products.jsx";
import ProductDetailPage from "./pages/user/ProductDetails.jsx";
import CartPage from "./pages/user/CartPage.jsx";
import CheckoutPage from "./pages/user/CheckoutPage.jsx";
import PaymentPage from "./pages/user/PaymentPage.jsx";
import OrdersPage from "./pages/user/OrdersPage.jsx";
import OrderDetailPage from "./pages/user/OrderDetailPage.jsx";
import LoginPage from "./pages/user/LoginPage.jsx";
import RegisterPage from "./pages/user/RegisterPage.jsx";

// ---------- Admin pages ----------
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminPanel from "./pages/admin/AdminPanel.jsx";

// ---------- Vendor pages ----------
import VendorLandingPage from "./pages/vendor/VendorLandingPage.jsx";
import VendorRegisterPage from "./pages/vendor/VendorRegisterPage.jsx";
import VendorLoginPage from "./pages/vendor/VendorLoginPage.jsx";
import VendorDashboard from "./pages/vendor/VendorDashboard.jsx";
import MyAccount from "./pages/common/MyAccount.jsx";

function App() {
  const [role, setRole] = useState("guest");

  // Load saved role from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) setRole(savedRole);
  }, []);

  return (
    <Provider store={store}>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header role={role} setRole={setRole} />

        <main className="flex-1">
          <Routes>
            {/* ---------- PUBLIC ROUTES ---------- */}
            <Route path="/" element={<Home />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<LoginPage setRole={setRole} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/account" element={<MyAccount/>} />

            {/* ---------- USER PROTECTED ROUTES ---------- */}
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
              path="/orders/:orderId"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />

            {/* ---------- ADMIN PROTECTED ROUTES ---------- */}
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

            {/* Vendor Routes */}
            <Route path="/vendor/become-seller" element={<VendorLandingPage />} />
            <Route path="/vendor/register" element={<VendorRegisterPage />} />
            <Route
              path="/vendor/login"
              element={<VendorLoginPage setRole={setRole} />}
            />
            <Route
              path="/vendor/dashboard"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />


            {/* ---------- 404 PAGE ---------- */}
            <Route
              path="*"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-3xl font-bold mb-2">404</h1>
                  <p className="text-gray-600">Page not found</p>
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
