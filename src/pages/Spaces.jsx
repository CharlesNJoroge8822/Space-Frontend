import { useContext, useEffect, useState } from "react";
import { SpaceContext } from "../context/SpaceContext";
import { PaymentsContext } from "../context/PaymentsContext";
import { BookingContext } from "../context/BookingContext";
import { UserContext } from "../context/UserContext";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import "../../src/space.css";

const Spaces = () => {
    const { spaces, fetchSpaces, updateSpaceAvailability, setSpaces } = useContext(SpaceContext);
    const { stkPush, checkPaymentStatus } = useContext(PaymentsContext);
    const { createBooking, fetchUserBookings } = useContext(BookingContext);
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
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false); // ✅ FIXED: Added missing state


    // Fetch spaces on component mount
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
    }, [fetchSpaces]);

    // Calculate total price based on duration and unit
    const calculateTotalPrice = (space) => {
        return unit === "hour" ? space.price_per_hour * duration : space.price_per_day * duration;
    };

    // Open booking modal only if the space is available
    const openBookingModal = (space) => {
        if (space.availability === "1" || space.availability === true) {
            setSelectedSpace(space);
            setIsBookingModalOpen(true);
        } else {
            Swal.fire({
                icon: "error",
                title: "Space Booked",
                text: "This space is already booked and cannot be reserved.",
            });
        }
    };

    // Handle "Book Now" button click (opens payment modal)
    const handleBookNow = () => {
        if (!selectedSpace || !current_user) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Please log in to book a space." });
            return;
        }
        setIsBookingModalOpen(false);
        setIsPaymentModalOpen(true);
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
    
        if (!agreedToTerms) {
            Swal.fire({
                icon: "warning",
                title: "Agreement Required",
                text: "You must agree to the terms before proceeding with the payment.",
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
                didOpen: () => Swal.showLoading(),
            });
    
            // ✅ Ensure payment response is valid
            const paymentResponse = await stkPush(phoneNumber, totalCost, selectedSpace.id);
            console.log("Payment Response:", paymentResponse);
    
            if (!paymentResponse || !paymentResponse.mpesa_transaction_id) {
                throw new Error("Payment request failed. No transaction ID received.");
            }
    
            const transactionId = paymentResponse.mpesa_transaction_id;
    
            // ✅ Wait for payment confirmation
            let paymentStatus = "Processing";
            let retries = 0;
            while (paymentStatus === "Processing" && retries < 6) {
                await new Promise(resolve => setTimeout(resolve, 10000)); // Check every 10s for 1 min
                const statusResponse = await checkPaymentStatus(transactionId);
                console.log("Payment Status:", statusResponse);
                paymentStatus = statusResponse || "Processing";
                retries++;
            }
    
            if (paymentStatus !== "Confirmed") {
                throw new Error("Payment was not confirmed. Please try again.");
            }
    
            // ✅ Create booking ONLY if payment is confirmed
            const bookingResponse = await createBooking({
                user_id: current_user.id,
                space_id: selectedSpace.id,
                start_time: new Date().toISOString().split(".")[0],
                end_time: new Date(Date.now() + duration * (unit === "hour" ? 3600000 : 86400000)).toISOString().split(".")[0],
                total_amount: totalCost,
                status: "booked",
            });
    
            await updateSpaceAvailability(selectedSpace.id, false);
            if (spaces.length > 0) {
                await fetchSpaces();
            }
    
            Swal.fire({
                icon: "success",
                title: "Payment Confirmed!",
                text: "Your booking has been confirmed successfully.",
            });
    
            setIsPaymentModalOpen(false);
            setPhoneNumber("");
            setAgreedToTerms(false);
    
            if (current_user) {
                await fetchUserBookings();
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: error?.message || "Failed to process payment. Please try again.",
            });
            console.error("Error during payment:", error);
        } finally {
            setIsPaymentProcessing(false);
        }
    };
    

    // const handlePayment = async () => {
    //     // Validate phone number and terms agreement
    //     if (!phoneNumber.match(/^2547[0-9]{8}$/)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Invalid Phone Number",
    //             text: "Please enter a valid M-Pesa phone number (2547XXXXXXXX format).",
    //         });
    //         return;
    //     }
    
    //     if (!agreedToTerms) {
    //         Swal.fire({
    //             icon: "warning",
    //             title: "Agreement Required",
    //             text: "You must agree to the terms before proceeding with the payment.",
    //         });
    //         return;
    //     }
    
    //     const totalCost = calculateTotalPrice(selectedSpace);
    //     setIsPaymentProcessing(true);
    
    //     try {
    //         // Show loading indicator
    //         Swal.fire({
    //             title: "Processing Payment...",
    //             text: "Please wait while we process your payment.",
    //             allowOutsideClick: false,
    //             didOpen: () => Swal.showLoading(),
    //         });
    
    //         // ✅ Step 1: Initiate STK Push
    //         const paymentResponse = await stkPush(phoneNumber, totalCost, selectedSpace.id);
            
    //         // Expecting mpesa_transaction_id from backend response
    //         if (!paymentResponse || !paymentResponse.mpesa_transaction_id) {
    //             throw new Error("Payment request failed. No transaction ID received.");
    //         }
    
    //         const transactionId = paymentResponse.mpesa_transaction_id;
    
    //         // ✅ Step 2: Wait for payment confirmation
    //         let paymentStatus = "Processing";
    //         let retries = 0;
    //         while (paymentStatus === "Processing" && retries < 6) {
    //             await new Promise((resolve) => setTimeout(resolve, 10000)); // Check every 10s for 1 min
    //             const statusResponse = await checkPaymentStatus(transactionId);
    //             paymentStatus = statusResponse?.status || "Processing";
    //             retries++;
    //         }
    
    //         if (paymentStatus !== "Confirmed") {
    //             throw new Error("Payment was not confirmed. Please try again.");
    //         }
    
    //         // ✅ Step 3: Create booking with transaction ID
    //         const bookingData = {
    //             user_id: current_user.id,
    //             space_id: selectedSpace.id,
    //             start_time: new Date().toISOString(), // Use dynamic start time based on user input
    //             end_time: new Date(Date.now() + duration * (unit === "hour" ? 3600000 : 86400000)).toISOString(), // Use dynamic end time
    //             total_amount: totalCost,
    //             status: "booked",
    //             mpesa_transaction_id: transactionId, // Include transaction ID in booking
    //         };
    
    //         const bookingResponse = await createBooking(bookingData);
    //         if (!bookingResponse || !bookingResponse.id) {
    //             throw new Error("Failed to create booking. Please try again.");
    //         }
    
    //         // ✅ Step 4: Update space availability
    //         const updateResponse = await updateSpaceAvailability(selectedSpace.id, false);
    //         if (!updateResponse || !updateResponse.success) {
    //             throw new Error("Failed to update space availability. Please contact support.");
    //         }
    
    //         // Refresh spaces if needed
    //         if (spaces.length > 0) {
    //             await fetchSpaces();
    //         }
    
    //         // Show success message
    //         Swal.fire({
    //             icon: "success",
    //             title: "Payment Confirmed!",
    //             text: "Your booking has been confirmed successfully.",
    //         });
    
    //         // Reset form and close modal
    //         setIsPaymentModalOpen(false);
    //         setPhoneNumber("");
    //         setAgreedToTerms(false);
    
    //         // Fetch user bookings if logged in
    //         if (current_user) {
    //             await fetchUserBookings();
    //         }
    //     } catch (error) {
    //         // Handle errors
    //         Swal.fire({
    //             icon: "error",
    //             title: "Payment Failed",
    //             text: error?.message || "Failed to process payment. Please try again.",
    //         });
    //         console.error("Error during payment:", error);
    //     } finally {
    //         // Reset processing state
    //         setIsPaymentProcessing(false);
    //     }
    // };
    

    // Automatically update space availability after booking end time
    useEffect(() => {
        const checkBookingEndTimes = async () => {
            const now = new Date();
            let updatesNeeded = false;

            const updatedSpaces = spaces.map((space) => {
                if (space.availability === "0" || space.availability === false) {
                    const booking = space.bookings?.find((b) => new Date(b.end_time) > now);
                    if (!booking) {
                        updatesNeeded = true;
                        return { ...space, availability: true };
                    }
                }
                return space;
            });

            if (updatesNeeded) {
                setSpaces(updatedSpaces);
                if (spaces.length > 0) {
                    await fetchSpaces();
                }
            }
        };

        const interval = setInterval(checkBookingEndTimes, 60000);
        return () => clearInterval(interval);
    }, [spaces, updateSpaceAvailability]);
    

    return (
        <div className="container-center" style={{minHeight: "100vh",}}>
            <h2 className="title">Available Spaces</h2>

            {loading && <p className="text-muted">Loading spaces...</p>}
            {error && <p className="text-error">{error}</p>}
            {!loading && !error && spaces.length === 0 && <p className="text-muted">No spaces available.</p>}

            <div className="grid-container">
                {spaces.map((space) => (
                    <div
                        key={space.id}
                        className={`card ${space.availability === "1" || space.availability === true ? "cursor-pointer" : "cursor-not-allowed"}`}
                        onClick={() => (space.availability === "1" || space.availability === true) && openBookingModal(space)}
                    >
                        <img src={space.images || "https://source.unsplash.com/400x300/?office,workspace"} alt={space.name || "Space"} className="card-image" />
                        <div className="card-content">
                            <h3 className="card-title">{space.name || "Unnamed Space"}</h3>
                            <p><strong>Location:</strong> {space.location || "Unknown"}</p>
                            <p><strong>Price per Day:</strong> ${space.price_per_day || 0}</p>
                            <p className={`text-${space.availability === "1" || space.availability === true ? "success" : "error"}`}>
                                <strong>Availability:</strong> {space.availability === "1" || space.availability === true ? "Available" : "Booked"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking Modal */}
            {isBookingModalOpen && selectedSpace && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="modal-close" onClick={() => setIsBookingModalOpen(false)} aria-label="Close Modal">
                            <X size={24} />
                        </button>

                        <h5><strong>{selectedSpace.name}</strong></h5>
                        <p><strong>Location:</strong> {selectedSpace.location}</p>
                        <p><strong>Price per Hour:</strong> ${selectedSpace.price_per_hour}</p>
                        <p><strong>Price per Day:</strong> ${selectedSpace.price_per_day}</p>

                        <div className="label-modal">
                            <label>Duration</label>
                            <label>Unit</label>
                        </div>

                        <div className="modal-label">
                            <input type="number" min="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="input" />
                            <select value={unit} onChange={(e) => setUnit(e.target.value)} className="input">
                                <option value="hour">Hours</option>
                                <option value="day">Days</option>
                            </select>
                        </div>

                        <p className="total-price"><strong>Total Price:</strong> ${calculateTotalPrice(selectedSpace)}</p>

                        <button onClick={handleBookNow} className="btn-green">
                            Book Now
                        </button>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
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

                        <div className="terms-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                />
                                I agree to the terms{" "}
                                <span
                                    className="terms-link"
                                    onClick={() => setIsTermsModalOpen(true)}
                                >
                                    
                                </span>
                                .
                            </label>
                        </div>

                        <button
                            onClick={handlePayment}
                            className="btn-green"
                            disabled={isPaymentProcessing || !agreedToTerms}
                        >
                            {isPaymentProcessing ? "Processing..." : "Pay via M-Pesa"}
                        </button>
                    </div>
                </div>
            )}

            {/* Terms and Conditions Modal */}
            {isTermsModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button
                            className="modal-close"
                            onClick={() => setIsTermsModalOpen(false)}
                            aria-label="Close Modal"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="modal-title">Terms and Conditions</h3>
                        <div className="terms-content">
                            <p>
                                By proceeding with this booking, you agree to the following terms and conditions:
                            </p>
                            <ol>
                                <li>
                                    You are responsible for ensuring that the provided information is accurate.
                                </li>
                                <li>
                                    Payments are non-refundable once the booking is confirmed.
                                </li>
                                <li>
                                    The space must be used responsibly, and any damages will be charged to the user.
                                </li>
                                <li>
                                    The booking duration must be adhered to strictly. Extensions may incur additional charges.
                                </li>
                                <li>
                                    The management reserves the right to cancel bookings in case of emergencies.
                                </li>
                                <p style={{color:"red",}}>
                                DISCLAIMER : Once booked. Can't be refunded ....                            </p>
                            </ol>
                            <p>
                                If you have any questions, please contact support before proceeding.
                            </p>
                        
                        </div>

                        <button
                            onClick={() => setIsTermsModalOpen(false)}
                            className="btn-green"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Spaces;