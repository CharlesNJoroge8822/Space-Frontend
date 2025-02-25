import { createContext, useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const SpaceContext = createContext();

export const SpaceProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
    const [spaces, setSpaces] = useState([]);

    const fetchSpaces = useCallback(async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/spaces", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            
            const data = await response.json();
            console.log("Fetched spaces:", data);

            if (Array.isArray(data.spaces) && data.spaces.length > 0)
                 {
                setSpaces(data.spaces);
                toast.success("Spaces loaded successfully.");
            } else {
                setSpaces([]);
                toast.warning("No spaces found.");
            }
        }
         catch (error) {
            console.error("Error fetching spaces:", error);
            toast.error("Error fetching spaces. Please try again later.");
            setSpaces([]);
        }
    }, []);

    useEffect(() => {
        if (authToken) fetchSpaces();
    }, [authToken, fetchSpaces]);

    const createSpace = async (spaceData) => {
        if (!spaceData.name || !spaceData.description || !spaceData.location) {
            toast.error("All fields are required!");
            return;
        }

        const toastId = toast.loading("Creating space...");
        try {
            const response = await fetch("http://127.0.0.1:5000/spaces", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(spaceData),
            });

            const data = await response.json();
            toast.dismiss(toastId);

            if (response.ok) {
                setSpaces((prev) => [...prev, data.space]);
                toast.success("Space created successfully!");
            } else {
                toast.error(data.msg || "Failed to create space.");
            }
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("Network error, please try again.");
            console.error("Space creation error:", error);
        }
    };

    const updateSpace = async (spaceId, updatedData) => {
        const toastId = toast.loading("Updating space...");
        try {
            const response = await fetch(`http://127.0.0.1:5000/spaces/${spaceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();
            toast.dismiss(toastId);

            if (response.ok) {
                setSpaces((prev) =>
                    prev.map((space) => (space.id === spaceId ? { ...space, ...updatedData } : space))
                );
                toast.success("Space updated successfully!");
            } else {
                toast.error(data.msg || "Failed to update space.");
            }
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("Network error, please try again.");
            console.error("Space update error:", error);
        }
    };

    const deleteSpace = async (spaceId) => {
        const toastId = toast.loading("Deleting space...");
        try {
            const response = await fetch(`http://127.0.0.1:5000/spaces/${spaceId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            const data = await response.json();
            toast.dismiss(toastId);

            if (response.ok) {
                setSpaces((prev) => prev.filter((space) => space.id !== spaceId));
                toast.success("Space deleted successfully!");
            } else {
                toast.error(data.msg || "Failed to delete space.");
            }
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("Network error, please try again.");
            console.error("Space deletion error:", error);
        }
    };

    return (
        <SpaceContext.Provider value={{ authToken, spaces, fetchSpaces, createSpace, updateSpace, deleteSpace }}>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
        </SpaceContext.Provider>
    );
};
