import { createContext, useCallback, useState } from "react";
import { toast } from "react-toastify";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState([]);

    // Create a new booking
    const createBooking = useCallback(async (bookingData) => {
        try {
            console.log("Sending Booking Payload:", bookingData);

            const response = await fetch("http://127.0.0.1:5000/bookings", {
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
            const response = await fetch("http://127.0.0.1:5000/bookings", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to fetch bookings.");

            const data = await response.json();
            setBookings(data.bookings); // Update the bookings state
            return data;
        } catch (error) {
            toast.error("❌ Failed to fetch bookings. Please try again.");
            console.error("Fetch Bookings Error:", error);
            throw error;
        }
    }, []);


    // fetch user bookings

    const fetchUserBookings = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/bookings?user_id=${userId}`);
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
            throw error;
        }
    };

    const deleteBooking = async (id) => {
        try {
            const token = sessionStorage.getItem("token"); // Get the JWT token from sessionStorage
            if (!token) {
                toast.error("You must be logged in to delete a booking.");
                return;
            }
    
            const response = await fetch(`http://127.0.0.1:5000/bookings/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include the JWT token
                },
                credentials: "include", // Include credentials if using cookies
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            toast.success("✅ Booking deleted successfully!", { autoClose: 1000 });
            fetchBookings(); // Refresh the bookings list
        } catch (error) {
            console.error("Error deleting booking:", error);
            toast.error(`❌ ${error.message}`, { autoClose: 1000 });
        }
    };

    // Update booking status
    const updateBookingStatus = useCallback(async (id, status) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/bookings/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) throw new Error("Failed to update booking status.");

            toast.success("✅ Booking status updated successfully!");
            setBookings((prev) =>
                prev.map((booking) =>
                    booking.id === id ? { ...booking, status } : booking
                )
            ); // Update the booking status in state
        } catch (error) {
            toast.error("❌ Failed to update booking status. Please try again.");
            console.error("Update Booking Status Error:", error);
            throw error;
        }
    }, []);

    return (
        <BookingContext.Provider
            value={{
                bookings,
                createBooking,
                fetchBookings,
                deleteBooking,
                updateBookingStatus,
                fetchUserBookings
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};