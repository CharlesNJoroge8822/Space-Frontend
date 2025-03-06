import { createContext, useState, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { BookingContext } from "./BookingContext"; // ✅ Ensure bookings update
import { SpaceContext } from "./SpaceContext"; // ✅ Ensure spaces update

export const PaymentsContext = createContext();

export const PaymentsProvider = ({ children }) => {
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const { fetchBookings } = useContext(BookingContext);
    const { fetchSpaces } = useContext(SpaceContext);

    /** ✅ Initiate STK Push */
    const stkPush = useCallback(async (phoneNumber, amount, orderId) => {
        console.log(`STK Push Initiated: 
            📞 Phone Number: ${phoneNumber}
            💰 Amount: ${amount} 
            🛒 Order ID: ${orderId}`);

        setIsPaymentProcessing(true);

        try {
            const payload = {
                phone_number: phoneNumber,
                amount: amount,
                order_id: orderId,
            };

            const response = await fetch("http://127.0.0.1:5000/stkpush", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Capture error response
                throw new Error(`Payment request failed. Status: ${response.status}, Error: ${errorText}`);
            }

            const data = await response.json();
            console.log("STK Push Response:", data); // Debugging

            if (!data.mpesa_transaction_id) {
                throw new Error("Invalid STK Push response. No transaction ID received.");
            }

            toast.success("✅ M-Pesa STK Push request sent! Approve the prompt on your phone.", { autoClose: 2000 });
            return data;
        } catch (error) {
            toast.error(`❌ STK Push Failed: ${error.message}`, { autoClose: 2000 });
            console.error("STK Push Error:", error);
            throw error;
        } finally {
            setIsPaymentProcessing(false);
        }
    }, []);

    /** ✅ Check Payment Status */
    const checkPaymentStatus = useCallback(async (transactionId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/payments/${transactionId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to fetch payment status.");
            const data = await response.json();

            // ✅ If payment is confirmed, refresh bookings & spaces
            if (data.status === "Confirmed") {
                fetchBookings();
                fetchSpaces();
            }

            return data.status; // e.g., "Completed", "Processing"
        } catch (error) {
            console.error("Error checking payment status:", error);
            throw error;
        }
    }, [fetchBookings, fetchSpaces]);

    /** ✅ Delete Payment */
    const deletePayment = async (id) => {
        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                toast.error("You must be logged in to delete a payment.", { autoClose: 2000 });
                return;
            }

            console.log("JWT Token being sent:", token); // Debugging

            const response = await fetch(`http://127.0.0.1:5000/payments/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Unauthorized! Your session might have expired. Please log in again.", { autoClose: 2000 });
                    return;
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            toast.success("✅ Payment deleted successfully!", { autoClose: 2000 });

            // ✅ After deletion, refresh bookings & spaces
            fetchBookings();
            fetchSpaces();
        } catch (error) {
            console.error("Error deleting payment:", error);
            toast.error(`❌ ${error.message}`, { autoClose: 2000 });
        }
    };

    return (
        <PaymentsContext.Provider
            value={{
                stkPush,
                checkPaymentStatus,
                isPaymentProcessing,
                setIsPaymentProcessing,
                deletePayment,
            }}
        >
            {children}
        </PaymentsContext.Provider>
    );
};