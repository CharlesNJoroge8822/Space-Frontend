import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const SpaceContext = createContext();

export const SpaceProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /** ✅ Fetch Spaces */
    const fetchSpaces = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:5000/spaces", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched spaces:", data);

            if (Array.isArray(data.spaces)) {
                setSpaces(data.spaces);
            } else {
                setSpaces([]);
            }
        } catch (error) {
            console.error("Error fetching spaces:", error);
            setError(`Error fetching spaces: ${error.message}`);
            setSpaces([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /** ✅ Create Space */
    const createSpace = async (spaceData) => {
        if (!spaceData.name || !spaceData.description || !spaceData.location) {
            toast.error("⚠️ All fields are required!");
            return;
        }

        const toastId = toast.loading("⏳ Creating space...");
        try {
            const response = await fetch("http://127.0.0.1:5000/spaces", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(spaceData),
            });

            if (!response.ok) throw new Error("Failed to create space.");

            const data = await response.json();
            setSpaces((prev) => [...prev, data]);

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

    /** ✅ Update Space */
    const updateSpace = async (spaceId, updatedData) => {
        const toastId = toast.loading("⏳ Updating space...");
        try {
            const response = await fetch(`http://127.0.0.1:5000/spaces/${spaceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(updatedData),
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

    /** ✅ Delete Space */
    const deleteSpace = async (spaceId) => {
        const toastId = toast.loading("⏳ Deleting space...");
        try {
            const response = await fetch(`http://127.0.0.1:5000/spaces/${spaceId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete space.");
            }

            setSpaces((prev) => prev.filter((space) => space.id !== spaceId));

            toast.update(toastId, {
                render: "✅ Space deleted successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (error) {
            toast.update(toastId, {
                render: `🚨 ${error.message}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    /** ✅ Auto-fetch spaces when authToken is available */
    useEffect(() => {
        if (authToken) fetchSpaces();
    }, [authToken]);

    return (
        <SpaceContext.Provider
            value={{
                authToken,
                spaces,
                fetchSpaces,
                createSpace,
                updateSpace,
                deleteSpace,
                loading,
                error,
            }}
        >
            {children}
        </SpaceContext.Provider>
    );
};