import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  toggleUserStatus,
  updateUserRole,
} from "../../api/adminapi";

export default function UserManage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUsers();
      setUsers(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleBlockToggle = async (user) => {
    const msg = user.isBlocked ? "Unblock this user?" : "Block this user?";
    if (!window.confirm(msg)) return;

    await toggleUserStatus(user._id, !user.isBlocked);
    loadUsers();
  };

  const handleRoleChange = async (user, role) => {
    if (user.role === role) return;
    if (!window.confirm(`Change role to ${role}?`)) return;

    await updateUserRole(user._id, role);
    loadUsers();
  };

  if (loading) return <p className="p-6">Loading users...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">User ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="text-center">
                  <td className="p-2 border font-mono text-xs text-gray-600">
                    {u._id}
                  </td>
                  <td className="p-2 border">{u.name}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border capitalize">{u.role}</td>
                  <td className="p-2 border">
                    {u.isBlocked ? (
                      <span className="text-red-600 font-semibold">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => handleBlockToggle(u)}
                      className={`px-3 py-1 rounded text-white ${
                        u.isBlocked ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>

                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
