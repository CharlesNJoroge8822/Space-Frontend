import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css"; // Ensure this file has improved styles

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
        status: ""
    });

    // Fetch bookings from the backend
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:5000/bookings", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                credentials: "include",
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            setBookings(Array.isArray(data.bookings) ? data.bookings : []);
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
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                credentials: "include",
                body: JSON.stringify(currentBooking),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            toast.success(isEditing ? "✅ Booking updated!" : "✅ Booking created!", { autoClose: 1000 });

            fetchBookings();
            setIsEditing(false);
            setCurrentBooking({ id: null, user_id: "", space_id: "", start_time: "", end_time: "", status: "" });
        } catch (error) {
            toast.error(`❌ ${error.message}`, { autoClose: 1000 });
        }
    };

    // Delete a booking
    const deleteBooking = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/bookings/${id}`, {
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

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentBooking({ ...currentBooking, [name]: value });
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
