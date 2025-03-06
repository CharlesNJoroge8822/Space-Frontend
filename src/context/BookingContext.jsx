import { createContext, useCallback, useState, useContext } from "react";
import { toast } from "react-toastify";
import { SpaceContext } from "./SpaceContext"; // Import SpaceContext

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState([]);
    const { fetchSpaces } = useContext(SpaceContext); // Use SpaceContext

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

            fetchSpaces(); // Update spaces after successful booking
            return data;
        } catch (error) {
            toast.error("❌ Failed to create booking. Please try again.");
            console.error("Create Booking Error:", error);
            throw error;
        }
    }, [fetchSpaces]);

    // Fetch all bookings
    const fetchBookings = useCallback(async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/bookings", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to fetch bookings.");

            const data = await response.json();
            setBookings(data.bookings || []); // Ensure it’s always an array
            return data;
        } catch (error) {
            console.error("Fetch Bookings Error:", error);
            setBookings([]); // Prevent setting bookings to null
            throw error;
        }
    }, []);

    // Fetch bookings for a specific user
    const fetchUserBookings = async (userId) => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/my-bookings?user_id=${userId}`, {
            method: "GET",
          });
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error("Fetch User Bookings Error:", error);
        }
      };
      

    // Delete a booking
    const deleteBooking = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/bookings/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Unauthorized! Please log in again.");
                    return;
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            toast.success("✅ Booking deleted successfully!", { autoClose: 1000 });

            fetchBookings(); // Refetch bookings from the backend
            fetchSpaces(); // Update spaces after booking deletion
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