import { useContext, useEffect, useState } from "react";
import { SpaceContext } from "../context/SpaceContext";
import { PaymentsContext } from "../context/PaymentsContext";
import { BookingContext } from "../context/BookingContext";
import { UserContext } from "../context/UserContext";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import "../../././src/space.css";
import React from 'react'
import { useNavigate } from "react-router-dom";

export default function Spaces() {
  
  return (
    <div>
      spaces
    </div>
  )
}
import { useContext, useEffect, useMemo, useState } from "react";
// import { SpaceContext } from "../context/SpaceContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Space = () => {
    const { spaces, fetchSpaces, bookSpace, updateSpace } = useContext(SpaceContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [duration, setDuration] = useState(1);
    const [unit, setUnit] = useState("hour");
    const [selectedSpace, setSelectedSpace] = useState(null);

    useEffect(() => {
        const loadSpaces = async () => {
            try {
                setLoading(true);
                setError(null);
                await fetchSpaces();
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to fetch spaces. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        loadSpaces();
    }, [fetchSpaces]);

    const displayedSpaces = useMemo(() => {
        return spaces?.filter(space => space.availability === "1" || space.availability === "0" || space.availability === true || space.availability === false) || [];
    }, [spaces]);

    const calculateTotalPrice = (space) => {
        const price = unit === "hour" ? (space.price_per_hour || 0) : (space.price_per_day || 0);
        return price * duration;
    };

    const handleBooking = async (space) => {
        if (space.availability !== "1" && space.availability !== true) {
            toast.error("This space is currently unavailable for booking.");
            return;
        }
        
        setSelectedSpace(space);
        const totalCost = calculateTotalPrice(space);
        const confirmBooking = window.confirm(`Confirm booking for ${duration} ${unit}(s) at $${totalCost}?`);
        
        if (confirmBooking) {
            try {
                await bookSpace(space.id, duration, unit);

                // ✅ Update spaces state locally and in admin panel
                await updateSpace(space.id, { availability: false });
                fetchSpaces(); // Refresh spaces from server
                toast.success("Booking successful!");
            } catch (error) {
                toast.error("Booking failed. Please try again.");
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">All Spaces</h2>
            {loading && <p className="text-gray-500 text-center">Loading spaces...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!loading && !error && displayedSpaces.length === 0 && <p className="text-gray-500 text-center">No spaces available at the moment.</p>}
            {!loading && !error && displayedSpaces.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedSpaces.map(space => (
                        <div key={space.id} className="p-4 shadow-lg rounded-lg border bg-green-50">
                            <img 
                                src={
                                    space.images && typeof space.images === "string" && space.images.startsWith("data:image")
                                        ? space.images
                                        : Array.isArray(space.images) && space.images.length > 0 && typeof space.images[0] === "string"
                                            ? space.images[0]
                                            : "https://source.unsplash.com/400x300/?office,workspace"
                                } 
                                alt={space.name || "Space"} 
                                className="w-full h-48 object-cover rounded-lg"
                                onError={(e) => (e.target.src = "https://dummyimage.com/400x300/000/fff&text=No+Image")}
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800">{space.name || "Unnamed Space"}</h3>
                                <p className="text-gray-600">{space.description || "No description available."}</p>
                                <p><strong>Location:</strong> {space.location || "Unknown"}</p>
                                <p><strong>Price per Hour:</strong> ${space.price_per_hour || 0}</p>
                                <p><strong>Price per Day:</strong> ${space.price_per_day || 0}</p>
                                <p className={`font-bold ${space.availability === "1" || space.availability === true ? "text-green-700" : "text-red-700"}`}>
                                    <strong>Availability:</strong> {space.availability === "1" || space.availability === true ? "Available" : "Booked"}
                                </p>
                                <div className="mt-4">
                                    <label>Duration:</label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        value={duration} 
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="border p-2 rounded"
                                    />
                                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className="ml-2 border p-2 rounded">
                                        <option value="hour">Hours</option>
                                        <option value="day">Days</option>
                                    </select>
                                </div>
                                <p><strong>Total Price:</strong> ${calculateTotalPrice(space)}</p>
                                <button onClick={() => handleBooking(space)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Spaces = () => {
    const { spaces, fetchSpaces, updateSpaceAvailability } = useContext(SpaceContext);
    const { stkPush } = useContext(PaymentsContext);
    const { createBooking } = useContext(BookingContext);
    const { current_user } = useContext(UserContext);

    const [duration, setDuration] = useState(1);
    const [unit, setUnit] = useState("hour");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchSpaces();
            } catch (err) {
                console.error("Error fetching spaces:", err);
                setError("Failed to fetch spaces. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const calculateTotalPrice = (space) => {
        return unit === "hour"
            ? space.price_per_hour * duration
            : space.price_per_day * duration;
    };

    const openBookingModal = (space) => {
        if (!space.availability) {
            Swal.fire({
                icon: "error",
                title: "Space Booked",
                text: "This space is already booked and cannot be reserved.",
            });
            return;
        }
        setSelectedSpace(space);
        setIsBookingModalOpen(true);
    };

    const handleBooking = async () => {
        if (!selectedSpace || !current_user) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please log in to book a space.",
            });
            return;
        }

        const totalCost = calculateTotalPrice(selectedSpace);

        try {
            Swal.fire({
                title: "Creating booking...",
                text: "Please wait while we process your booking.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const bookingResponse = await createBooking({
                user_id: current_user.id,
                space_id: selectedSpace.id,
                start_time: new Date().toISOString().split(".")[0],
                end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().split(".")[0],
                total_amount: totalCost,
            });

            Swal.fire({
                icon: "success",
                title: "Booking Created!",
                text: "Your booking was created successfully. Please proceed to payment.",
            });
            setIsBookingModalOpen(false);
            setIsPaymentModalOpen(true);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Booking Failed",
                text: "Failed to create booking. Please try again.",
            });
            console.error("Create Booking Error:", error);
        }
    };

    const handlePayment = async () => {
        if (!phoneNumber.match(/^2547[0-9]{8}$/)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Phone Number",
                text: "Please enter a valid M-Pesa phone number (2547XXXXXXXX format).",
            });
            return;
        }

        const totalCost = calculateTotalPrice(selectedSpace);
        setIsPaymentProcessing(true);

        try {
            Swal.fire({
                title: "Processing Payment...",
                text: "Please wait while we process your payment.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const stkResponse = await stkPush(phoneNumber, totalCost, selectedSpace.id);

            Swal.fire({
                icon: "success",
                title: "Payment Request Sent!",
                text: "Please approve the M-Pesa prompt on your phone.",
            });

            // Simulate payment status check
            setTimeout(async () => {
                // Update space availability in the backend
                await updateSpaceAvailability(selectedSpace.id, false);

                Swal.fire({
                    icon: "success",
                    title: "Payment Confirmed!",
                    text: "Your payment was confirmed successfully.",
                });
                setIsPaymentModalOpen(false);
                setPhoneNumber("");
            }, 5000); // Simulate a 5-second delay for payment confirmation
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: "Failed to process payment. Please try again.",
            });
            console.error("Error during payment:", error);
        } finally {
            setIsPaymentProcessing(false);
        }
    };

    return (
        <div className="container center">
            <h2 className="title">Available Spaces</h2>

            {loading && <p className="text-muted">Loading spaces...</p>}
            {error && <p className="text-error">{error}</p>}
            {!loading && !error && spaces.length === 0 && <p className="text-muted">No spaces available.</p>}

            {!loading && !error && spaces.length > 0 && (
                <div className="grid-container">
                    {spaces.map((space) => (
                        <div 
                            key={space.id} 
                            className="card cursor-pointer" 
                            onClick={() => openBookingModal(space)}
                        >
                            <img
                                src={space.images || "https://source.unsplash.com/400x300/?office,workspace"}
                                alt={space.name || "Space"}
                                className="card-image"
                            />
                            <div className="card-content">
                                <h3 className="card-title">{space.name || "Unnamed Space"}</h3>
                                <p className="card-text">{space.description || "No description available."}</p>
                                <p><strong>Location:</strong> {space.location || "Unknown"}</p>
                                <p><strong>Price per Hour:</strong> ${space.price_per_hour || 0}</p>
                                <p><strong>Price per Day:</strong> ${space.price_per_day || 0}</p>
                                <p className={`text-${space.availability ? "success" : "error"}`}>
                                    <strong>Availability:</strong> {space.availability ? "Available" : "Booked"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isBookingModalOpen && selectedSpace && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button
                            className="modal-close"
                            onClick={() => setIsBookingModalOpen(false)}
                            aria-label="Close Modal"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="modal-title">Book: {selectedSpace.name}</h3>
                        <p><strong>Location:</strong> {selectedSpace.location}</p>
                        <p><strong>Price per Hour:</strong> ${selectedSpace.price_per_hour}</p>
                        <p><strong>Price per Day:</strong> ${selectedSpace.price_per_day}</p>

                        <label>Duration:</label>
                        <input
                            type="number"
                            min="1"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="input"
                        />
                        <label>Unit:</label>
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="input"
                        >
                            <option value="hour">Hours</option>
                            <option value="day">Days</option>
                        </select>

                        <p className="total-price">Total Price: ${calculateTotalPrice(selectedSpace)}</p>

                        <button
                            onClick={handleBooking}
                            className="btn-green"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            )}

            {isPaymentModalOpen && selectedSpace && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button
                            className="modal-close"
                            onClick={() => setIsPaymentModalOpen(false)}
                            aria-label="Close Modal"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="modal-title">Pay for: {selectedSpace.name}</h3>
                        <p><strong>Total Amount:</strong> ${calculateTotalPrice(selectedSpace)}</p>

                        <label>Phone Number:</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="input"
                            placeholder="Enter M-Pesa number"
                        />

                        <button
                            onClick={handlePayment}
                            className="btn-green"
                            disabled={isPaymentProcessing}
                        >
                            {isPaymentProcessing ? "Processing..." : "Pay via M-Pesa"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Spaces;