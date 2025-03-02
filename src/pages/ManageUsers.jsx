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