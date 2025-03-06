import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "../App.css";

const ManageUsers = () => {
    const { allUsers = [], fetchAllUsers, current_user, deleteUser, addUser } = useContext(UserContext);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Client" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (current_user?.role === "Admin") {
            console.log("Fetching all users...");  // ✅ Debugging Step
            fetchAllUsers();
        }
    }, [current_user]);  // ✅ Ensure it only runs when the user changes

    const fetchUsers = async () => {
        setLoading(true);
        try {
            await fetchAllUsers();
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        toast.info(
            <div>
                <p>Are you sure you want to delete this user?</p>
                <button onClick={() => confirmDelete(userId)}>Yes</button>
                <button onClick={() => toast.dismiss()}>No</button>
            </div>,
            { autoClose: false }
        );
    };

    const confirmDelete = async (userId) => {
        setLoading(true);
        try {
            await deleteUser(userId);
            toast.dismiss(); // Dismiss the confirmation toast
            console.log("User deleted successfully");
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error("Failed to delete user:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addUser(newUser.name, newUser.email, newUser.password, newUser.role);
            setNewUser({ name: "", email: "", password: "", role: "Client" });
            fetchUsers();
        } catch (error) {
            console.error("Failed to add user:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!current_user || current_user.role !== "Admin") {
        return <p>You do not have permission to view this page.</p>;
    }

    return (
        <div className="container">
            <h1 className="title">Manage Users</h1>

            {loading && <p className="loading-text">Loading...</p>}

            {/* User List */}
            <div className="user-list">
                {allUsers && allUsers.length > 0 ? (
                    allUsers.map((user) => (
                        <div key={user.id} className="user-card">
                            <p className="user-name">{user.name}</p>
                            <p className="user-email">{user.email}</p>
                            <p className="user-role">Role: {user.role}</p>
                            <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                                Delete
                            </button>
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
