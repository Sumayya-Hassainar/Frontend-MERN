// src/pages/MyAccount.jsx
import React, { useEffect, useState } from "react";
import { fetchMyAccount } from "../../api/accountapi";

export default function MyAccount() {
  const [data, setData] = useState(null);       // backend data
  const [localUser, setLocalUser] = useState(null); // localStorage user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 1) Read local user immediately
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      try {
        setLocalUser(JSON.parse(stored));
      } catch {}
    }

    // 2) Try to fetch backend profile (if token exists)
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // no token → no backend call
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const res = await fetchMyAccount();
        setData(res);
      } catch (err) {
        console.error("MyAccount error:", err);
        setError(err.message || "Failed to load account from server");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ---------- RENDER LOGIC ----------

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <p className="text-sm text-gray-500">Loading account...</p>
      </div>
    );
  }

  // Case 3: No backend data AND no local user → Guest
  if (!data && !localUser) {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-2">
        <h1 className="text-2xl font-semibold">My Account</h1>
        <p className="text-sm text-gray-600">
          You are currently browsing as a <span className="font-medium">Guest</span>.
        </p>
        <p className="text-sm text-gray-500">
          Please log in or sign up to view your account details and orders.
        </p>
        {/* add login/register buttons links */}
      </div>
    );
  }

  // If backend succeeded, use it
  const role = data?.role || localUser?.role || "unknown";
  const profile = data?.profile || {
    name: localUser?.name,
    email: localUser?.email,
  };
  const vendorProfile = data?.vendorProfile || null;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">My Account</h1>
        <p className="text-gray-600 text-sm">
          Currently using this device as{" "}
          <span className="font-medium">
            {profile?.name || "Unknown User"}
          </span>{" "}
          (
          <span className="capitalize">
            {role === "customer" ? "customer" : role}
          </span>
          )
        </p>

        {error && (
          <p className="mt-1 text-xs text-orange-600">
            {error} – showing last known info from this device.
          </p>
        )}
      </div>

      {/* Basic profile info */}
      <section className="bg-white border rounded-lg p-4 space-y-2">
        <h2 className="text-lg font-semibold mb-2">Profile Details</h2>
        <div className="text-sm">
          <p>
            <span className="font-medium">Name:</span> {profile?.name || "-"}
          </p>
          <p>
            <span className="font-medium">Email:</span> {profile?.email || "-"}
          </p>
        </div>
      </section>

      {/* Vendor extra info only if backend gave vendorProfile */}
      {role === "vendor" && (
        <section className="bg-white border rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-semibold mb-2">Vendor Profile</h2>
          {vendorProfile ? (
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Shop Name:</span>{" "}
                {vendorProfile.shopName}
              </p>
              <p>
                <span className="font-medium">Description:</span>{" "}
                {vendorProfile.description || "-"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Vendor details not loaded from server. Please log in again to
              refresh.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
