import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
    const [current_user, setCurrentUser] = useState(null);

    console.log("Current user:", current_user);

    const login = async (email, password, role) => {
        toast.loading("Logging you in ... ");
        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await response.json();

            if (data.access_token) {
                toast.dismiss();
                sessionStorage.setItem("token", data.access_token);
                setAuthToken(data.access_token);

                const userResponse = await fetch("http://127.0.0.1:5000/current_user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${data.access_token}`,
                    },
                });

                const user = await userResponse.json();
                if (user.email) {
                    setCurrentUser(user);
                    toast.success("Successfully Logged in!");


                    // ✅ Redirect based on role
                    if (user.role === "Client") {
                        navigate("/spaces");
                    } else if (user.role === "Admin") {
                        navigate("/manage-bookings");
                    }
                }
            } else {
                toast.dismiss();
                toast.error(data.error || "Failed to login");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("An error occurred. Please try again.");
        }
    };
    
    const logout = () => {
        console.log("Logout function triggered"); // Check if logout function is being triggered
    
        // Show loading toast
        toast.loading("Logging out ... ");
        
        fetch("http://127.0.0.1:5000/logout", {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then((resp) => resp.json())
        .then((response) => {
            console.log("Logout response:", response); // Check server response structure
    
            // Check if the response indicates success
            if (response.success) {
                // Remove token and user data
                sessionStorage.removeItem("token");
                setAuthToken(null);
                setCurrentUser(null);
    
                // Dismiss the loading toast and show the success message
                toast.dismiss(); // Dismiss loading toast
                setTimeout(() => {
                    toast.success("Successfully Logged out"); // Delay to ensure toast is shown after dismiss
                }, 100);
    
                // Navigate to the login page
                navigate("/login");
            } else {
                // If logout failed, show error toast
                toast.dismiss();
                toast.error("Logout failed. Please try again.");
            }
        })
        .catch((error) => {
            // Handle network errors
            toast.dismiss();
            toast.error("An error occurred while logging out. Please try again.");
            console.error("Logout error:", error); // Log error for debugging
        });
    };
    

    const updateProfile = async (userId, newProfileData) => {
        toast.loading("Updating profile...");
        try {
            const response = await fetch(`http://127.0.0.1:5000/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(newProfileData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Failed to update profile.");
            }

            toast.dismiss();
            toast.success("Profile updated successfully!");
            setCurrentUser((prevUser) => ({
                ...prevUser,
                ...newProfileData,
            }));
        } catch (error) {
            toast.dismiss();
            console.error("Error updating profile:", error);
            toast.error("Profile update failed. Please try again.");
        }
    };

    const addUser = async (name, email, password, role) => {
        if (!name || !email || !password) {
            toast.error("All fields are required!");
            return;
        }

        toast.loading("Registering...");

        try {
            const payload = JSON.stringify({
                name: name.trim(),
                email: email.trim(),
                password: password.trim(),
                role: role === "Admin" ? "Admin" : "Client", // Ensures valid role
            });

            const response = await fetch("http://127.0.0.1:5000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload,
            });

            const data = await response.json();

            toast.dismiss();
            if (response.ok) {
                toast.success(data.message || "Registration successful!");
                navigate("/login");
            } else {
                toast.error(data.error || "Registration failed. Please try again.");
            }
        } catch (error) {
            toast.dismiss();
            console.error("Network error:", error);
            toast.error("Network error, please try again.");
        }
    };

    return (
        <UserContext.Provider value={{ authToken, login, current_user, setCurrentUser, logout, addUser, updateProfile }}>
            {children}
        </UserContext.Provider>
    );
};
