import React, { useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BookingContext } from "../context/BookingContext";
import "../App.css"; // Ensure this file has improved styles

const MyBookings = () => {
    const { bookings, fetchUserBookings, loading, error } = useContext(BookingContext);

    // Fetch bookings when the component mounts
    useEffect(() => {
        fetchUserBookings();
    }, [fetchUserBookings]);

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
                                <td>{booking.space?.name || "Unknown Space"}</td>
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