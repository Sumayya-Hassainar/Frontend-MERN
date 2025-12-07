import React, { useEffect, useState } from "react";
import {
  fetchMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../api/accountapi";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= LOAD NOTIFICATIONS =================
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchMyNotifications();

        // ✅ Safety check if backend sends { notifications: [] }
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.notifications)
          ? data.notifications
          : [];

        setNotifications(list);
      } catch (err) {
        console.error("Fetch notifications error:", err);
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // ================= MARK ONE AS READ =================
  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Mark as read failed:", err);
      alert("Failed to mark notification as read");
    }
  };

  // ================= MARK ALL AS READ =================
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Mark all as read failed:", err);
      alert("Failed to mark all notifications as read");
    }
  };

  // ================= UI STATES =================
  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 font-medium">
        {error}
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No notifications found.
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <button
          onClick={handleMarkAllRead}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Mark All as Read
        </button>
      </div>

      <ul className="space-y-2">
        {notifications.map((n) => (
          <li
            key={n._id}
            className={`p-3 border rounded transition ${
              n.read
                ? "bg-gray-100 text-gray-700"
                : "bg-white font-semibold shadow"
            }`}
          >
            <p>{n.message}</p>

            <div className="flex items-center justify-between mt-1">
              <small className="text-gray-500">
                {n.createdAt
                  ? new Date(n.createdAt).toLocaleString()
                  : ""}
              </small>

              {!n.read && (
                <button
                  onClick={() => handleMarkRead(n._id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
