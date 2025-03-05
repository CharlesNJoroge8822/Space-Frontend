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
            const response = await fetch("https://space-backend-7.onrender.com/bookings", {
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
            const response = await fetch(`https://space-backend-7.onrender.com/bookings/${id}`, {
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

    // Fetch bookings on component mount and every 30 seconds
    useEffect(() => {
        fetchBookings(); // Initial fetch

        // Refresh bookings every 30 seconds
        const interval = setInterval(fetchBookings, 30000);
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <div style={{ padding: "20px", margin: "0 auto", maxWidth: "1400px" }}>
            <h1 style={{ fontFamily: "Inria Serif", textAlign: "center", color: "#104436", fontSize: "32px", marginBottom: "20px" }}>
                Manage Bookings
            </h1>

            {loading && <p style={{ textAlign: "center", fontFamily: "Inria Serif" }}>Loading bookings...</p>}
            {error && <p style={{ color: "red", textAlign: "center", fontFamily: "Inria Serif" }}>{error}</p>}

            {/* Bookings Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inria Serif" }}>
                <thead>
                    <tr style={{ backgroundColor: "#104436", color: "white" }}>
                        <th style={{ padding: "15px", textAlign: "left" }}>ID</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>User Name</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>User Email</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Space Name</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Start Time</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>End Time</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr
                            key={booking.id}
                            style={{
                                borderBottom: "1px solid #ddd",
                                transition: "background-color 0.3s ease",
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            <td style={{ padding: "15px" }}>{booking.id}</td>
                            <td style={{ padding: "15px" }}>{booking.userName}</td>
                            <td style={{ padding: "15px" }}>{booking.userEmail}</td>
                            <td style={{ padding: "15px" }}>{booking.spaceName}</td>
                            <td style={{ padding: "15px" }}>{new Date(booking.start_time).toLocaleString()}</td>
                            <td style={{ padding: "15px" }}>{new Date(booking.end_time).toLocaleString()}</td>
                            <td
                                style={{
                                    padding: "15px",
                                    color:
                                        booking.status.toLowerCase() === "confirmed"
                                            ? "green"
                                            : booking.status.toLowerCase() === "pending"
                                            ? "orange"
                                            : "red",
                                }}
                            >
                                {booking.status}
                            </td>
                            <td style={{ padding: "15px" }}>
                                <button
                                    onClick={() => deleteBooking(booking.id)}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#ff4d4d",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "20px",
                                        cursor: "pointer",
                                        fontFamily: "Inria Serif",
                                        transition: "background-color 0.3s ease",
                                    }}
                                    onMouseOver={(e) => (e.target.style.backgroundColor = "#cc0000")}
                                    onMouseOut={(e) => (e.target.style.backgroundColor = "#ff4d4d")}
                                >
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