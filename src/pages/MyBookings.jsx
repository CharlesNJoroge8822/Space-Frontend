import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css"; // Ensure this file has improved styles

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch bookings for the current user
    const fetchUserBookings = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://space-backend-6.onrender.com/my-bookings", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to fetch user bookings.");

            const data = await response.json();
            console.log("🔍 My Bookings API Response:", data);

            setBookings(Array.isArray(data.bookings) ? data.bookings : []);
        } catch (error) {
            toast.error("❌ Failed to fetch bookings.");
            console.error("Fetch Bookings Error:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUserBookings();
    }, []);

    return (
        <div className="manage-bookings-container">
            <h1 className="manage-bookings-heading">My Bookings</h1>

            {loading && <p>Loading bookings...</p>}
            {error && <p className="error">{error}</p>}

            <table className="bookings-table">
                <thead>
                    <tr>
                        <th>Space Name</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.space?.name || "Unknown Space"}</td> {/* ✅ Fix here */}
                                <td>{new Date(booking.start_time).toLocaleString()}</td>
                                <td>{new Date(booking.end_time).toLocaleString()}</td>
                                <td>${booking.total_amount.toFixed(2)}</td>
                                <td className={`status ${booking.status.toLowerCase().replace(" ", "-")}`}>
                                    {booking.status}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>No bookings found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default MyBookings;
