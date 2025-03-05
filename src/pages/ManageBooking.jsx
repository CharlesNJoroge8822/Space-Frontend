import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css"; // Ensure this file has improved styles

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch bookings from the backend
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://space-backend-6.onrender.com/bookings", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                credentials: "include",
            });
    
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            const data = await response.json();
            console.log("🔍 API Response:", data); // Debugging: Ensure space details are included
    
            setBookings(
                Array.isArray(data.bookings)
                    ? data.bookings.map((booking) => ({
                          ...booking,
                          userName: booking.user?.name || "Unknown User",
                          userEmail: booking.user?.email || "Unknown Email",
                          spaceName: booking.space?.name || "Unknown Space", // ✅ Fetch space.name
                      }))
                    : []
            );
    
            if (!data.bookings.length) {
                toast.warning("⚠️ No bookings found.", { autoClose: 1000 });
            }
        } catch (error) {
            setError("Error fetching bookings. Please try again.");
            toast.error("❌ Error fetching bookings.", { autoClose: 1000 });
        } finally {
            setLoading(false);
        }
    };
    

    // Delete a booking
    const deleteBooking = async (id) => {
        try {
            const response = await fetch(`https://space-backend-6.onrender.com/bookings/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                credentials: "include",
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            setBookings((prev) => prev.filter(booking => booking.id !== id));
            toast.success("✅ Booking deleted!", { autoClose: 1000 });
        } catch (error) {
            toast.error(`❌ ${error.message}`, { autoClose: 1000 });
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="manage-bookings-container">
            <h1 className="manage-bookings-heading">Manage Bookings</h1>

            {/* Bookings Table */}
            <table className="bookings-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>User Email</th>
                        <th>Space Name</th>  {/* ✅ Updated from "Space ID" to "Space Name" */}
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
                            <td>{booking.userName}</td>
                            <td>{booking.userEmail}</td>
                            <td>{booking.spaceName}</td>  {/* ✅ Display space.name */}
                            <td>{new Date(booking.start_time).toLocaleString()}</td>
                            <td>{new Date(booking.end_time).toLocaleString()}</td>
                            <td className={`status ${booking.status.toLowerCase().replace(" ", "-")}`}>
                                {booking.status}
                            </td>
                            <td>
                                <button onClick={() => deleteBooking(booking.id)} className="delete-button">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default ManageBookings;
