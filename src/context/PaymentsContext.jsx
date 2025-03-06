import { createContext, useState, useCallback } from "react";
import { toast } from "react-toastify";

export const PaymentsContext = createContext();

export const PaymentsProvider = ({ children }) => {
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    /**
     * ✅ Initiate M-Pesa STK Push Payment
     */
    const stkPush = useCallback(async (phoneNumber, amount, bookingId) => {
        console.log(`STK Push Initiated: 
            📞 Phone Number: ${phoneNumber}
            💰 Amount: ${amount} 
            📌 Booking ID: ${bookingId}`);

        setIsPaymentProcessing(true);
        try {
            const payload = {
                phone_number: Number(phoneNumber),
                amount: amount,
                order_id: bookingId, // Booking ID used for order reference
            };

            const response = await fetch("https://space-backend-2-p4kd.onrender.com/stkpush", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to initiate STK push.");

            const data = await response.json();
            toast.success("✅ M-Pesa STK Push request sent! Approve the prompt on your phone.");

            // ✅ Wait for payment confirmation
            const paymentStatus = await checkPaymentStatus(data.mpesa_transaction_id);
            if (paymentStatus === "Confirmed") {
                await updateBookingStatusAfterPayment(bookingId); // ✅ Update Booking
            }

            return data;
        } catch (error) {
            toast.error("Failed to initiate STK push.");
            console.error("STK Push Error:", error);
            throw error;
        } finally {
            setIsPaymentProcessing(false);
        }
    }, []);

    /**
     * ✅ Check Payment Status
     */
    const checkPaymentStatus = useCallback(async (transactionId) => {
        try {
            const response = await fetch(`https://space-backend-2-p4kd.onrender.com/payments/${transactionId}`);
            if (!response.ok) throw new Error("Failed to fetch payment status.");
            const data = await response.json();
            console.log(`🔍 Payment Status: ${data.status}`);
            return data.status;
        } catch (error) {
            console.error("Error checking payment status:", error);
            throw error;
        }
    }, []);

    /**
     * ✅ Update Booking Status After Successful Payment
     */
    const updateBookingStatusAfterPayment = async (bookingId) => {
        try {
            const response = await fetch(`https://space-backend-2-p4kd.onrender.com/bookings/${bookingId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Booked" }),
            });

            if (!response.ok) throw new Error("Failed to update booking status.");

            toast.success("✅ Booking confirmed successfully!");
        } catch (error) {
            console.error("Error updating booking status:", error);
            toast.error("Failed to update booking status.");
        }
    };

    /**
     * ✅ Delete Payment
     */
    const deletePayment = async (id) => {
        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                toast.error("You must be logged in to delete a payment.");
                return;
            }

            const response = await fetch(`https://space-backend-2-p4kd.onrender.com/payments/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Unauthorized! Your session might have expired. Please log in again.");
                    return;
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            toast.success("✅ Payment deleted successfully!", { autoClose: 1000 });
        } catch (error) {
            console.error("Error deleting payment:", error);
            toast.error(`❌ ${error.message}`, { autoClose: 1000 });
        }
    };

    return (
        <PaymentsContext.Provider
            value={{
                stkPush,
                checkPaymentStatus,
                updateBookingStatusAfterPayment,
                isPaymentProcessing,
                setIsPaymentProcessing,
                deletePayment,
            }}
        >
            {children}
        </PaymentsContext.Provider>
    );
};
