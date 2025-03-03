import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "../App.css";

const ManageUsers = () => {
    const { allUsers, fetchAllUsers, current_user, deleteUser, addUser, updateProfile } = useContext(UserContext);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Client" });
    const [editUser, setEditUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (current_user && current_user.role === "Admin") {
            setLoading(true);
            fetchAllUsers()
                .catch(() => toast.error("Failed to fetch users"))
                .finally(() => setLoading(false));
        }
    }, [current_user, fetchAllUsers]);

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setLoading(true);
            await deleteUser(userId)
                .then(() => toast.success("User deleted successfully"))
                .catch(() => toast.error("Failed to delete user"))
                .finally(() => setLoading(false));
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        await addUser(newUser.name, newUser.email, newUser.password, newUser.role)
            .then(() => {
                toast.success("User added successfully");
                setNewUser({ name: "", email: "", password: "", role: "Client" });
            })
            .catch(() => toast.error("Failed to add user"))
            .finally(() => setLoading(false));
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        await updateProfile(editUser.id, editUser)
            .then(() => {
                toast.success("User updated successfully");
                setEditUser(null);
            })
            .catch(() => toast.error("Failed to update user"))
            .finally(() => setLoading(false));
    };

    const handleRoleChange = async (userId, newRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            setLoading(true);
            await updateProfile(userId, { role: newRole })
                .then(() => toast.success("Role updated successfully"))
                .catch(() => toast.error("Failed to update role"))
                .finally(() => setLoading(false));
        }
    };

    if (!current_user || current_user.role !== "Admin") {
        return <p>You do not have permission to view this page.</p>;
    }

    return (
        <div className="container">
            <h1 className="title">Manage Users</h1>

            {loading && <p>Loading...</p>}

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
                    <button type="submit" disabled={loading}>Update User</button>
                    <button type="button" onClick={() => setEditUser(null)} disabled={loading}>Cancel</button>
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
                            <button className="delete-btn" onClick={() => handleDelete(user.id)} disabled={loading}>
                                Delete
                            </button>
                            <button className="edit-btn" onClick={() => setEditUser(user)} disabled={loading}>
                                Edit
                            </button>
                            {user.role === "Client" && (
                                <button className="role-btn" onClick={() => handleRoleChange(user.id, "Admin")} disabled={loading}>
                                    Make Admin
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No users available.</p>
                )}
            </div>

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
                <button type="submit" disabled={loading}>Add User</button>
            </form>
        </div>
    );
};

export default ManageUsers;