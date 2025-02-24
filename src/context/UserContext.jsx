import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
    const [current_user, setCurrentUser] = useState(null);

    console.log("Current user:", current_user);

    // Function to handle Google login
    const handleGoogleLogin = () => {
        // Extract user data from URL parameters
        const user_id = searchParams.get("user_id");
        const name = searchParams.get("name");
        const email = searchParams.get("email");
        const role = searchParams.get("role");

        if (user_id && name && email && role) {
            // Update the current_user state
            setCurrentUser({
                id: user_id,
                name: name,
                email: email,
                role: role,
            });

            // Clear the URL parameters
            navigate(location.pathname, { replace: true });

            // Show success message
            toast.success("Successfully logged in with Google!");

            // Redirect based on role
            if (role === "Client") {
                navigate("/spaces");
            } else if (role === "Admin") {
                navigate("/manage-bookings");
            }
        }
    };

    // Check for Google login data on component mount
    useEffect(() => {
        handleGoogleLogin();
    }, [searchParams]);

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

                    // Redirect based on role
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
        console.log("Logout function triggered");

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
            console.log("Logout response:", response);

            if (response.success) {
                sessionStorage.removeItem("token");
                setAuthToken(null);
                setCurrentUser(null);

                toast.dismiss();
                setTimeout(() => {
                    toast.success("Successfully Logged out");
                }, 100);

                navigate("/login");
            } else {
                toast.dismiss();
                toast.error("Logout failed. Please try again.");
            }
        })
        .catch((error) => {
            toast.dismiss();
            toast.error("An error occurred while logging out. Please try again.");
            console.error("Logout error:", error);
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
                role: role === "Admin" ? "Admin" : "Client",
            });
    
            const token = localStorage.getItem('token');
    
            const response = await fetch("http://127.0.0.1:5000/users", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
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
        <UserContext.Provider value={{ authToken, login, current_user, setCurrentUser, logout, addUser, updateProfile, handleGoogleLogin }}>
            {children}
        </UserContext.Provider>
    );
};