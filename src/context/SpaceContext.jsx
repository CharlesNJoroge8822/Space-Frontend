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
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Fetch Spaces
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
            console.log("Fetched spaces:", data); // Debugging

            if (Array.isArray(data.spaces)) {
                setSpaces(data.spaces); // ✅ Ensure it's always an array
            } else {
                setSpaces([]); // ✅ Prevent "map is not a function" error
            }
        } catch (error) {
            console.error("Error fetching spaces:", error);
            setError(`Error fetching spaces: ${error.message}`);
            setSpaces([]); // ✅ Ensure spaces is always an array
        } finally {
            setLoading(false);
        }
    }, []);

    // Create Space
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

    // Update Space
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

    // Delete Space
    // const deleteSpace = async (spaceId) => {
    //     const toastId = toast.loading("⏳ Deleting space...");
    //     try {
    //         const response = await fetch(`http://127.0.0.1:5000/spaces/${spaceId}`, {
    //             method: "DELETE",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${authToken}`,
    //             },
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.error || "Failed to delete space.");
    //         }

    //         setSpaces((prev) => prev.filter((space) => space.id !== spaceId));

    //         toast.update(toastId, {
    //             render: "✅ Space deleted successfully!",
    //             type: "success",
    //             isLoading: false,
    //             autoClose: 3000,
    //         });
    //     } catch (error) {
    //         toast.update(toastId, {
    //             render: `🚨 ${error.message}`,
    //             type: "error",
    //             isLoading: false,
    //             autoClose: 3000,
    //         });
    //     }
    // };

    const deleteSpace = async (spaceId) => {
        // Check if user is logged in
        if (!authToken) {
            toast.error("You must be logged in to delete a space.");
            return;
        }
    
        // Validate spaceId
        if (!spaceId || isNaN(spaceId)) {
            toast.error("Invalid space ID.");
            return;
        }
    
        const toastId = toast.loading("⏳ Deleting space...");
        try {
            const response = await fetch(`http://127.0.0.1:5000/spaces/${spaceId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
    
            // Handle non-OK responses
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    error: "Failed to delete space. Please try again.",
                }));
                throw new Error(errorData.error || "Failed to delete space.");
            }
    
            // Update state to remove the deleted space
            setSpaces((prev) => prev.filter((space) => space.id !== parseInt(spaceId)));
    
            // Show success message
            toast.update(toastId, {
                render: "✅ Space deleted successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (error) {
            // Show error message
            toast.update(toastId, {
                render: `🚨 ${error.message}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };
    
    // Update Space Availability
    const updateSpaceAvailability = async (spaceId, availability) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/spaces/${spaceId}/availability`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ availability }),
            });

            if (!response.ok) throw new Error("Failed to update space availability.");

            setSpaces((prevSpaces) =>
                prevSpaces.map((space) =>
                    space.id === spaceId ? { ...space, availability } : space
                )
            );
        } catch (error) {
            console.error("Error updating space availability:", error);
        }
    };

    // Handle Booking and Payment
    const handleBookingAndPayment = async (spaceId, bookingData, paymentData) => {
        setIsProcessingPayment(true);
        const toastId = toast.loading("⏳ Processing payment and booking...");

        try {
            // Step 1: Process Payment
            const paymentResponse = await fetch("http://127.0.0.1:5000/process-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(paymentData),
            });

            if (!paymentResponse.ok) {
                const errorData = await paymentResponse.json();
                throw new Error(errorData.error || "Payment failed. Please try again.");
            }

            // Step 2: Create Booking
            const bookingResponse = await fetch("http://127.0.0.1:5000/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ ...bookingData, spaceId }),
            });

            if (!bookingResponse.ok) {
                throw new Error("Failed to create booking.");
            }

            // Step 3: Update Space Availability
            await updateSpaceAvailability(spaceId, false);

            toast.update(toastId, {
                render: "✅ Booking and payment successful!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });

            navigate("/booking-confirmation"); // Redirect to confirmation page
        } catch (error) {
            toast.update(toastId, {
                render: `🚨 ${error.message}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        } finally {
            setIsProcessingPayment(false);
        }
    };

    // Auto-fetch spaces on mount
    useEffect(() => {
        fetchSpaces();
    }, [fetchSpaces]);

    // Auto-fetch spaces when authToken is available
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
                updateSpaceAvailability,
                handleBookingAndPayment,
                loading,
                isProcessingPayment,
                error,
            }}
        >
            {children}
            <ToastContainer position="top-right" autoClose={3000} className="fixed top-0 right-0 m-4 z-50" />
        </SpaceContext.Provider>
    );
};