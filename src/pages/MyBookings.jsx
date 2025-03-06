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
            const response = await fetch("https://space-backend-2-p4kd.onrender.com/my-bookings", {
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

    // Fetch bookings on component mount and every 30 seconds
    useEffect(() => {
        fetchUserBookings(); // Initial fetch

        // Refresh bookings every 30 seconds
        const interval = setInterval(fetchUserBookings, 30000);
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "auto",
                padding: "20px",
                borderStyle: "solid",
                borderColor: "#103436",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                paddingTop: "40px",
                paddingBottom: "40px",
                paddingRight: "40px",
                paddingLeft: "40px",
                marginBottom: "40px",
                borderBottom: "10px solid #104436",
                borderRight: "9px solid #104436",
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    color: "#104436",
                    fontFamily: "Inria Serif",
                    fontSize: "32px",
                    marginBottom: "20px",
                }}
            >
                My Bookings
            </h1>

            {loading && <p style={{ textAlign: "center", fontFamily: "Inria Serif" }}>Loading bookings...</p>}
            {error && <p style={{ color: "red", textAlign: "center", fontFamily: "Inria Serif" }}>{error}</p>}

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "Inria Serif",
                }}
            >
                <thead>
                    <tr
                        style={{
                            backgroundColor: "#104436",
                            color: "white",
                        }}
                    >
                        <th style={{ padding: "15px", textAlign: "left" }}>Space Name</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Start Time</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>End Time</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Total Amount</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <tr
                                key={booking.id}
                                style={{
                                    borderBottom: "1px solid #ddd",
                                    transition: "background-color 0.3s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                                <td style={{ padding: "15px" }}>{booking.space?.name || "Unknown Space"}</td>
                                <td style={{ padding: "15px" }}>{new Date(booking.start_time).toLocaleString()}</td>
                                <td style={{ padding: "15px" }}>{new Date(booking.end_time).toLocaleString()}</td>
                                <td style={{ padding: "15px" }}>${booking.total_amount.toFixed(2)}</td>
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
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="5"
                                style={{
                                    textAlign: "center",
                                    padding: "20px",
                                    fontFamily: "Inria Serif",
                                }}
                            >
                                No bookings found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default MyBookings;
