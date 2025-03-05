import { createContext, useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export const SpaceContext = createContext();

export const SpaceProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fetch Spaces - Prevents duplicate toasts and handles errors properly
     */
    const fetchSpaces = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("https://space-backend-7.onrender.com/spaces", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to fetch spaces.");

            const data = await response.json();
            console.log("Fetched spaces:", data);

            if (Array.isArray(data.spaces) && data.spaces.length > 0) {
                // Parse the availability field for each space
                const parsedSpaces = data.spaces.map(space => ({
                    ...space,
                    availability: JSON.parse(space.availability) // Parse JSON string to object
                }));
                setSpaces(parsedSpaces);
                console.log("Updated Spaces State:", parsedSpaces);
            } else {
                setSpaces([]);
                toast.warning("⚠️ No spaces found.");
            }
        } catch (error) {
            console.error("Error fetching spaces:", error);
            setError("Error fetching spaces. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Create Space - Properly updates UI and prevents duplicate toast messages
     */
    const createSpace = async (spaceData) => {
        if (!spaceData.name || !spaceData.description || !spaceData.location) {
            toast.error("⚠️ All fields are required!");
            return;
        }

        // Convert availability to JSON string
        const availability = JSON.stringify({ slots: ["09:00-12:00", "13:00-17:00"] }); // Example slots
        const payload = {
            ...spaceData,
            availability: availability, // Send as JSON string
        };

        const toastId = toast.loading("⏳ Creating space...");
        try {
            const response = await fetch("https://space-backend-7.onrender.com/spaces", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to create space.");

            const data = await response.json();
            setSpaces((prev) => [...prev, data.space]);

            toast.update(toastId, {
                render: "✅ Space created successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (error) {
            toast.update(toastId, {
                render: `🚨 ${error.message || "Network error, please try again."}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    /**
     * Update Space - Prevents duplicate toasts
     */
    const updateSpace = async (spaceId, updatedData) => {
        // Convert availability to JSON string if it exists in updatedData
        const payload = {
            ...updatedData,
            availability: updatedData.availability ? JSON.stringify(updatedData.availability) : undefined,
        };

        const toastId = toast.loading("⏳ Updating space...");
        try {
            const response = await fetch(`https://space-backend-7.onrender.com/spaces/${spaceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to update space.");

            setSpaces((prev) =>
                prev.map((space) => (space.id === spaceId ? { ...space, ...updatedData } : space))
            );

            toast.update(toastId, {
                render: "✅ Space updated successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (error) {
            toast.update(toastId, {
                render: `🚨 ${error.message || "Network error, please try again."}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    /**
     * Delete Space - Handles errors properly and prevents duplicate toasts
     */
    const deleteSpace = async (spaceId) => {
        const toastId = toast.loading("⏳ Deleting space...");
        try {
            const response = await fetch(`https://space-backend-7.onrender.com/spaces/${spaceId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) throw new Error("Failed to delete space.");

            setSpaces((prev) => prev.filter((space) => space.id !== spaceId));

            toast.update(toastId, {
                render: "✅ Space deleted successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (error) {
            toast.update(toastId, {
                render: `🚨 ${error.message || "Network error, please try again."}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    // Auto-fetch spaces when authToken is available
    useEffect(() => {
        if (authToken) fetchSpaces();
    }, [authToken]);

    return (
        <SpaceContext.Provider
            value={{ authToken, spaces, fetchSpaces, createSpace, updateSpace, deleteSpace, loading, error }}
        >
            {children}
            <ToastContainer position="top-right" autoClose={3000} className="fixed top-0 right-0 m-4 z-50" />
        </SpaceContext.Provider>
    );
};