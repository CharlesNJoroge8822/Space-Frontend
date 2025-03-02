import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "../App.css";

const ManageUsers = () => {
    const { allUsers, fetchAllUsers, current_user, deleteUser, addUser, updateProfile } = useContext(UserContext);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Client" });
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        if (current_user && current_user.role === "Admin") {
            fetchAllUsers();  // Fetch users on page load
        }
    }, [current_user]);

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            const response = await deleteUser(userId);

            if (response?.error) {
                toast.error(response.error);
            } else {
                toast.success("User deleted successfully");
                fetchAllUsers();  // Fetch fresh data from the backend
            }
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        await addUser(newUser.name, newUser.email, newUser.password, newUser.role);
        setNewUser({ name: "", email: "", password: "", role: "Client" });
        fetchAllUsers();
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        await updateProfile(editUser.id, editUser);
        setEditUser(null);
        fetchAllUsers();
    };

    const handleRoleChange = async (userId, newRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            await updateProfile(userId, { role: newRole });
            fetchAllUsers();
        }
    };

    return (
        <div className="container">
            <h1 className="title">Manage Users</h1>

          

            {/* Edit User Form */}
            {editUser && (
                <form onSubmit={handleUpdateUser} className="user-form">
                    <h2>Edit User</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={editUser.name}
                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={editUser.email}
                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                        required
                    />
                    <button type="submit">Update User</button>
                    <button type="button" onClick={() => setEditUser(null)}>Cancel</button>
                </form>
            )}


            {/* User List */}
            <div className="user-list">
                {allUsers.length > 0 ? (
                    allUsers.map((user) => (
                        <div key={user.id} className="user-card">
                            <p className="user-name">{user.name}</p>
                            <p className="user-email">{user.email}</p>
                            <p className="user-role">Role: {user.role}</p>
                            <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                                Delete
                            </button>
                            <button className="edit-btn" onClick={() => setEditUser(user)}>
                                Edit
                            </button>
                            {user.role === "Client" && (
                                <button className="role-btn" onClick={() => handleRoleChange(user.id, "Admin")}>
                                    Make Admin
                                </button>
                            )}

                        </div>
                        
                    ))
                ) : (
                    <p>No users available.</p>
                )}

        
            </div>

            <div>
                  {/* Add User Form */}
            <form onSubmit={handleAddUser} className="user-form">
                <h2>Add New User</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                />
                <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                    <option value="Client">Client</option>
                    <option value="Admin">Admin</option>
                </select>
                <button type="submit">Add User</button>
            </form>
            </div>
        </div>
    );
};

export default ManageUsers;
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
