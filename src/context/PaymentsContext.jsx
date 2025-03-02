import { createContext, useState, useCallback } from "react";
import { toast } from "react-toastify";

export const PaymentsContext = createContext();

export const PaymentsProvider = ({ children }) => {
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    const stkPush = useCallback(async (phoneNumber, amount, orderId) => {
        console.log(`STK Push Initiated: 
            📞 Phone Number: ${phoneNumber}
            💰 Amount: ${amount} 
            🛒 Order ID: ${orderId}`);
        
        setIsPaymentProcessing(true);
        try {
            const payload = {
                phone_number: Number(phoneNumber), // Ensure phone number is an integer
                amount: amount,
                order_id: orderId
            };

            const response = await fetch("http://127.0.0.1:5000/stkpush", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload), // Send the correct payload
            });

            if (!response.ok) throw new Error("Failed to initiate STK push.");

            const data = await response.json();
            toast.success("✅ M-Pesa STK Push request sent! Approve the prompt on your phone.");
            return data;
        } catch (error) {
            toast.error("Failed to initiate STK push.");
            console.error("STK Push Error:", error);
            throw error;
        } finally {
            setIsPaymentProcessing(false);
        }
    }, []);

    const checkPaymentStatus = useCallback(async (transactionId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/payments/${transactionId}`);
            if (!response.ok) throw new Error("Failed to fetch payment status.");
            const data = await response.json();
            return data.status; // e.g., "Completed", "Processing"
        } catch (error) {
            console.error("Error checking payment status:", error);
            throw error;
        }
    }, []);

    return (
        <PaymentsContext.Provider value={{ stkPush, checkPaymentStatus, isPaymentProcessing, setIsPaymentProcessing }}>
            {children}
        </PaymentsContext.Provider>
    );
};