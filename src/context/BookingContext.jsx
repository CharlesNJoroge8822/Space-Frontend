import { createContext, useCallback, useState } from "react";
import { toast } from "react-toastify";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState([]);

    // Create a new booking
    const createBooking = useCallback(async (bookingData) => {
        try {
            console.log("Sending Booking Payload:", bookingData);

            const response = await fetch("https://space-backend-6.onrender.com/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
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

    // Fetch all bookings
    const fetchBookings = useCallback(async () => {
        try {
            const response = await fetch("https://space-backend-6.onrender.com/bookings", {
                method: "GET",
                // headers: { "Content-Type": "application/json" },
            });

            // if (!response.ok) throw new Error("Failed to fetch bookings.");

            const data = await response.json();
            setBookings(data.bookings || []); // Ensure we set an array
            return data;
        } catch (error) {
            // toast.error("Failed to fetch bookings. Please try again.");
            console.error("Fetch Bookings Error:", error);
            throw error;
        }
    }, []);

    // Fetch bookings for a specific user
    const fetchUserBookings = async (userId) => {
        try {
            const response = await fetch(`https://space-backend-6.onrender.com/bookings?user_id=${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to fetch user bookings.");

            const data = await response.json();
            setBookings(data.bookings || []); // Ensure it's an array
        } catch (error) {
            toast.error("❌ Failed to fetch user bookings. Please try again.");
            console.error("Fetch User Bookings Error:", error);
        }
    };

    // Delete a booking
   // Delete a booking
const deleteBooking = async (id) => {
    try {
        // Send DELETE request to the backend API without JWT
        const response = await fetch(`https://space-backend-6.onrender.com/bookings/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Keeps session info, if needed for other things like cookies
        });

        if (!response.ok) {
            if (response.status === 401) {
                toast.error("Unauthorized! Please log in again.");
                return;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Show success toast
        toast.success("✅ Booking deleted successfully!", { autoClose: 1000 });

        // Refetch bookings to ensure UI is up to date with the server
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
