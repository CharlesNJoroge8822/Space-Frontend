import { createContext, useCallback, useState } from "react";
import { toast } from "react-toastify";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState([]);

    /**
     * ✅ Create a New Booking (Pending Payment)
     */
    const createBooking = useCallback(async (bookingData) => {
        try {
            console.log("Sending Booking Payload:", bookingData);

            const response = await fetch("https://space-backend-2-p4kd.onrender.com/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...bookingData, status: "Pending Payment" }),
            });

            if (!response.ok) throw new Error("Failed to create booking.");

            const data = await response.json();
            toast.success("✅ Booking created successfully!");
            return data;
        } catch (error) {
            toast.error("❌ Failed to create booking. Please try again.");
            console.error("Create Booking Error:", error);
            throw error;
        }
    }, []);

    /**
     * ✅ Fetch All Bookings
     */
    const fetchBookings = useCallback(async () => {
        try {
            const response = await fetch("https://space-backend-2-p4kd.onrender.com/bookings", {
                method: "GET",
            });

            const data = await response.json();
            setBookings(data.bookings || []);
            return data;
        } catch (error) {
            console.error("Fetch Bookings Error:", error);
            throw error;
        }
    }, []);

    /**
     * ✅ Fetch User Bookings
     */
    const fetchUserBookings = async (userId) => {
        try {
            const response = await fetch(`https://space-backend-2-p4kd.onrender.com/bookings?user_id=${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to fetch user bookings.");

            const data = await response.json();
            setBookings(data.bookings || []);
        } catch (error) {
            toast.error("❌ Failed to fetch user bookings. Please try again.");
            console.error("Fetch User Bookings Error:", error);
        }
    };

    /**
     * ✅ Delete a Booking
     */
    const deleteBooking = async (id) => {
        try {
            const response = await fetch(`https://space-backend-2-p4kd.onrender.com/bookings/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Unauthorized! Please log in again.");
                    return;
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            toast.success("✅ Booking deleted successfully!", { autoClose: 1000 });

            fetchBookings(); // Refetch the bookings from the backend

        } catch (error) {
            console.error("Error deleting booking:", error);
            toast.error(`❌ ${error.message}`, { autoClose: 1000 });
        }
    };

    return (
        <BookingContext.Provider
            value={{
                bookings,
                createBooking,
                fetchBookings,
                fetchUserBookings,
                deleteBooking,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};
