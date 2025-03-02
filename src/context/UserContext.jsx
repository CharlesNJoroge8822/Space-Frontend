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
    useEffect(() => {
        const storedUser = sessionStorage.getItem("current_user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    // Check for Google login data on component mount
    useEffect(() => {
        handleGoogleLogin();
    }, [searchParams]);

    // Google login
    const googleLogin = async (email) => {
        toast.loading("Logging you in ... ");
        try {
            const response = await fetch("http://127.0.0.1:5000/googlelogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
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

    const login = async (email, password, role) => {
        toast.loading("Logging you in ... ");
        try {
            const response = await fetch("http://127.0.0.1:5000/googlelogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
    
            if (data.access_token) {
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
                    sessionStorage.setItem("current_user", JSON.stringify(user)); // ✅ Store user in sessionStorage
                    toast.success("Successfully Logged in!");
    
                    navigate(user.role === "Client" ? "/spaces" : "/manage-bookings");
                }
            } else {
                toast.error(data.error || "Failed to login");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            toast.dismiss();
        }
    };
    

    const login = async (email, password, role) => {
        const loadingToast = toast.loading("Logging you in ... "); // Store loading toast ID
        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role }),
            });
            const data = await response.json();
    
            if (data.access_token) {
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
                    sessionStorage.setItem("current_user", JSON.stringify(user)); // ✅ Store user in sessionStorage
                    
                    toast.dismiss(loadingToast); // ✅ Dismiss only the loading toast
                    toast.success("Successfully Logged in!"); // ✅ Success message will now show
                    
                    navigate(user.role === "Client" ? "/spaces" : "/manage-bookings");
                }
            } else {
                toast.dismiss(loadingToast); // ✅ Dismiss only the loading toast
                toast.error(data.error || "Failed to login");
            }
        } catch (error) {
            toast.dismiss(loadingToast); // ✅ Dismiss only the loading toast
            toast.error("An error occurred. Please try again.");
        }
    };
    
    
    const logout = () => {
        console.log("Logout function triggered"); // ✅ Debugging step
    
        const loadingToast = toast.loading("Logging out ... "); // ✅ Store loading toast ID
    
        fetch("http://127.0.0.1:5000/logout", {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then((resp) => resp.json())
        .then((response) => {
            console.log("Logout response:", response); // ✅ Debugging step
    
            // ✅ **Dismiss only the loading toast**
            toast.dismiss(loadingToast); 
    
            if (response.success === "Logged out successfully") { 
                // ✅ **SHOW TOAST IMMEDIATELY (Before State Change)**
                toast.success("Successfully Logged out", { autoClose: 3000 });
    
                // ✅ **DELAY CLEARING USER STATE TO PREVENT RE-RENDER ISSUES**
                setTimeout(() => {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("current_user");
                    setAuthToken(null);
                    setCurrentUser(null);
                }, 1000); // ⏳ **Short delay ensures toast appears before re-render**
    
                // ✅ **DELAY NAVIGATION TO PREVENT TOAST FROM DISAPPEARING**
                setTimeout(() => {
                    console.log("Navigating to login page"); // ✅ Debugging step
                    navigate("/login");
                }, 3000); // ⏳ **Ensure toast is visible before redirecting**
            } else {
                toast.error("Logout failed. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Logout error:", error);
            toast.dismiss(loadingToast);
            toast.error("An error occurred while logging out.");
        });
    };
      
    
    const updateProfile = async (userId, newProfileData) => {
        toast.loading("Updating profile...");
    
        // Ensure token is retrieved correctly
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("⛔ No token found!");
            toast.error("You must be logged in to update your profile.");
            return;
        }
    
        console.log("Auth Token Being Sent:", token); // Debugging token
    
        try {
            const response = await fetch(`http://127.0.0.1:5000/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newProfileData),
            });
    
            const data = await response.json();
            console.log("Server Response:", data); // Debug response
    
            if (!response.ok) {
                throw new Error(data.error || "Failed to update profile.");
            }
    
            toast.dismiss();
            toast.success("Profile updated successfully!");
            setCurrentUser((prevUser) => ({ ...prevUser, ...newProfileData }));
        } catch (error) {
            toast.dismiss();
            console.error("Error updating profile:", error);
            toast.error(error.message);
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
        <UserContext.Provider value={{ authToken, login, current_user, setCurrentUser, logout, addUser, updateProfile, handleGoogleLogin, googleLogin }}>
            {children}
        </UserContext.Provider>
    );
};