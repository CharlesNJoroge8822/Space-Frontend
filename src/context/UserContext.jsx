import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
    const [current_user, setCurrentUser] = useState(() => {
        const storedUser = sessionStorage.getItem("current_user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [allUsers, setAllUsers] = useState(() => {
        const storedUsers = sessionStorage.getItem("all_users");
        return storedUsers ? JSON.parse(storedUsers) : [];
    });

    /** ✅ Fetch all users (Admin Only) */
    const fetchAllUsers = async () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            toast.error("Unauthorized! Please log in.");
            return;
        }

        try {
            console.log("🔄 Fetching users...");
            const response = await fetch("https://space-backend-2-p4kd.onrender.com/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch users.");
            }

            const data = await response.json();
            console.log("✅ Users fetched successfully:", data.users);

            setAllUsers([...data.users]); // ✅ Ensures React state updates
            sessionStorage.setItem("all_users", JSON.stringify(data.users)); // ✅ Cache users

        } catch (error) {
            console.error("❌ Fetch Users Error:", error.message);
            setAllUsers([]); // Prevent stale data
            toast.error(error.message);
        }
    };

    /** ✅ Fetch Current User */
    const fetchCurrentUser = async () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            setCurrentUser(null);
            sessionStorage.removeItem("current_user");
            return;
        }

        try {
            const response = await fetch("https://space-backend-2-p4kd.onrender.com/current_user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user");
            }

            const user = await response.json();

            setCurrentUser(user);
            sessionStorage.setItem("current_user", JSON.stringify(user));

        } catch (error) {
            console.error("❌ Fetch user error:", error.message);
            setCurrentUser(null);
            sessionStorage.removeItem("current_user");
        }
    };

    /** ✅ Load current user from sessionStorage */
    useEffect(() => {
        fetchCurrentUser();
    }, []);

    /** ✅ Ensure fetchAllUsers runs when Admin logs in */
    useEffect(() => {
        if (current_user?.role === "Admin") {
            console.log("👤 Admin detected, fetching all users...");
            fetchAllUsers();
        }
    }, [current_user]);

    /** ✅ Log `allUsers` updates */
    useEffect(() => {
        console.log("📌 `allUsers` updated:", allUsers);
    }, [allUsers]);

    console.log("Current user:", current_user);

    // Function to handle Google login
    const handleGoogleLogin = () => {
        const user_id = searchParams.get("user_id");
        const name = searchParams.get("name");
        const email = searchParams.get("email");
        const role = searchParams.get("role");

        if (user_id && name && email && role) {
            setCurrentUser({ id: user_id, name, email, role });

            // Clear the URL parameters
            navigate(window.location.pathname, { replace: true });

            toast.success("Successfully logged in with Google!");

            navigate(role === "Client" ? "/spaces" : "/manage-bookings");
        }
    };

    useEffect(() => {
        handleGoogleLogin();
    }, [searchParams]);

    /** ✅ Update Profile */
    const updateProfile = async (userId, updatedData) => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            toast.error("Unauthorized! Please log in.");
            return;
        }

        try {
            console.log(`✏️ Updating user ${userId}...`, updatedData);

            const response = await fetch(`https://space-backend-2-p4kd.onrender.com/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update user.");
            }

            const updatedUser = await response.json();
            toast.success("Profile updated successfully!");

            setCurrentUser(updatedUser);
            sessionStorage.setItem("current_user", JSON.stringify(updatedUser));

            return updatedUser;
        } catch (error) {
            console.error("❌ Update user error:", error.message);
            toast.error(error.message);
            return null;
        }
    };

    return (
        <UserContext.Provider value={{
            authToken,
            login,
            current_user,
            setCurrentUser,
            logout,
            fetchAllUsers,
            allUsers,
            setAllUsers,
            fetchCurrentUser,
            handleGoogleLogin,
            googleLogin,
            addUser,
            deleteUser,
            updateProfile
        }}>
            {children}
        </UserContext.Provider>
    );
};
