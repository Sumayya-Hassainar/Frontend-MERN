
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminHeader({ notifications = [], unreadCount = 0, onMarkAsRead = () => {} }) {
  const navigate = useNavigate();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/admin/pannel" className="font-bold text-xl">
          Admin Panel
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link to="/admin" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/admin/orders" className="hover:underline">
            Orders
          </Link>
          <Link to="/admin/users" className="hover:underline">
            Users
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setShowNotifDropdown(!showNotifDropdown)}>
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
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

          {/* Logout */}
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
