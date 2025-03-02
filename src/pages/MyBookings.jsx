import React, { useContext, useEffect, useState } from "react";
import { BookingContext } from "../context/BookingContext";
import "../App.css" 

const MyBookings = () => {
    const { bookings, fetchBookings, deleteBooking, updateBookingStatus } =
        useContext(BookingContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBookings = async () => {
            await fetchBookings();
            setLoading(false);
        };
        loadBookings();
    }, [fetchBookings]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="my-bookings-container">
            <h1>My Bookings</h1>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul className="bookings-list">
                    {bookings.map((booking) => (
                        <li key={booking.id} className="booking-item">
                            <div className="booking-details">
                                <p>
                                    <strong>Booking ID:</strong> {booking.id}
                                </p>
                                <p>
                                    <strong>Space ID:</strong> {booking.space_id}
                                </p>
                                <p>
                                    <strong>Start Time:</strong> {booking.start_time}
                                </p>
                                <p>
                                    <strong>End Time:</strong> {booking.end_time}
                                </p>
                                <p>
                                    <strong>Total Amount:</strong> ${booking.total_amount}
                                </p>
                                <p>
                                    <strong>Status:</strong> {booking.status}
                                </p>
                            </div>
                            <div className="booking-actions">
                                <button
                                    className="delete-button"
                                    onClick={() => deleteBooking(booking.id)}
                                >
                                    Delete
                                </button>
                                <select
                                    className="status-select"
                                    value={booking.status}
                                    onChange={(e) =>
                                        updateBookingStatus(booking.id, e.target.value)
                                    }
                                >
                                    {/* <option value="Pending Payment">Pending Payment</option> */}
                                   
                                </select>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyBookings;