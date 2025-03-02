import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css"; // Import the custom CSS

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBooking, setCurrentBooking] = useState({
        id: null,
        user_id: "",
        space_id: "",
        start_time: "",
        end_time: "",
        status:""
    });

    // Fetch bookings from the backend
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:5000/bookings`, {
                method: "GET",
                // headers: { "Content-Type": "application/json" },
                // credentials: "include", // Include cookies for authenticated sessions
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched data:", data);

            if (Array.isArray(data.bookings)) {
                setBookings(data.bookings);
            } else {
                setBookings([]);
                toast.warning("⚠️ No bookings found.", { autoClose: 1000 });
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setError("Error fetching bookings. Please try again.");
            toast.error("❌ Error fetching bookings.", { autoClose: 1000 });
        } finally {
            setLoading(false);
        }
    };

    // Create or update a booking
    const saveBooking = async (e) => {
        e.preventDefault();
        const url = isEditing
            ? `http://127.0.0.1:5000/bookings/${currentBooking.id}`
            : "http://127.0.0.1:5000/bookings";
        const method = isEditing ? "PATCH" : "POST";

        try {
            const response = await fetch(url, {
                method,
                // headers: { "Content-Type": "application/json" },
                // credentials: "include",
                body: JSON.stringify(currentBooking),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            toast.success(
                isEditing ? "✅ Booking updated successfully!" : "✅ Booking created successfully!",
                { autoClose: 1000 }
            );

            // Refresh the bookings list
            fetchBookings();
            // Reset the form
            setIsEditing(false);
            setCurrentBooking({
                id: null,
                user_id: "",
                space_id: "",
                start_time: "",
                end_time: "",
                status: ""
            });
        } catch (error) {
            console.error("Error saving booking:", error);
            toast.error(`❌ ${error.message}`, { autoClose: 1000 });
        }
    };

    // Delete a booking
    const deleteBooking = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/bookings/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            toast.success("✅ Booking deleted successfully!", { autoClose: 1000 });
            // Refresh the bookings list
            fetchBookings();
        } catch (error) {
            console.error("Error deleting booking:", error);
            toast.error(`❌ ${error.message}`, { autoClose: 1000 });
        }
    };

    // Set the current booking for editing
    const editBooking = (booking) => {
        setIsEditing(true);
        setCurrentBooking({
            id: booking.id,
            user_id: booking.user_id,
            space_id: booking.space_id,
            start_time: booking.start_time,
            end_time: booking.end_time,
            status: booking.status,

        });
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentBooking({ ...currentBooking, [name]: value });
    };

    // Fetch bookings when the component mounts
    useEffect(() => {
        fetchBookings();
    }, []);

    // Render loading state
    if (loading) return <div className="p-4 text-center">Loading...</div>;

    // Render error state
    if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="manage-bookings-container">
            <h1 className="manage-bookings-heading">Manage Bookings</h1>

            {/* Form for creating/updating bookings */}
            <form onSubmit={saveBooking} className="booking-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="user_id"
                        placeholder="User ID"
                        value={currentBooking.user_id}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="space_id"
                        placeholder="Space ID"
                        value={currentBooking.space_id}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="datetime-local"
                        name="start_time"
                        placeholder="Start Time"
                        value={currentBooking.start_time}
                        onChange={handleInputChange}
                        required
                    />
                       <input
                        type="text"
                        name="payment-status"
                        placeholder="payment-status"
                        value={currentBooking.status}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="datetime-local"
                        name="end_time"
                        placeholder="End Time"
                        value={currentBooking.end_time}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">
                    {isEditing ? "Update Booking" : "Create Booking"}
                </button>
            </form>

            {/* Display bookings in a table */}
            <table className="bookings-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>    
                        <th>Space ID</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.user_id}</td>
                            <td>{booking.space_id}</td>
                            <td>{new Date(booking.start_time).toLocaleString()}</td>
                            <td>{new Date(booking.end_time).toLocaleString()}</td>
                            <td>{booking.status}</td>

                            <td>
                                <button
                                    onClick={() => editBooking(booking)}
                                    className="action-button edit"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteBooking(booking.id)}
                                    className="action-button delete"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Toast notifications */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ManageBookings;