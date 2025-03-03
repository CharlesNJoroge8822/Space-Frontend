import { useContext, useEffect, useState } from "react";
import { SpaceContext } from "../context/SpaceContext";
import { PaymentsContext } from "../context/PaymentsContext";
import { BookingContext } from "../context/BookingContext";
import { UserContext } from "../context/UserContext";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import "../../././src/space.css";

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