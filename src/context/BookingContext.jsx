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

    // Delete a booking
    const deleteBooking = useCallback(async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/bookings/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to delete booking.");

            toast.success("✅ Booking deleted successfully!");
            setBookings((prev) => prev.filter((booking) => booking.id !== id)); // Remove the deleted booking from state
        } catch (error) {
            toast.error("❌ Failed to delete booking. Please try again.");
            console.error("Delete Booking Error:", error);
            throw error;
        }
    }, []);

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
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};
-
