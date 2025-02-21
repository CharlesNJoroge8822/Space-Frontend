import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);  // Debugging step

      const response = await axios.get("http://127.0.0.1:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response:", response.data);  // Debugging step

      // Ensure the response structure is correct
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
        console.log("Users set in state:", response.data.users);  // Debugging step
      } else {
        console.error("Unexpected response structure:", response.data);
        toast.error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:5000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted user from state
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-center mb-6">Manage Users</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover mb-2"
              />
              <h3 className="text-xl font-medium">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>
              <span
                className={`px-3 py-1 mt-2 text-sm font-semibold rounded ${
                  user.role === "Admin"
                    ? "bg-red-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {user.role}
              </span>

              <div className="mt-4 flex space-x-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Update
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
}