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

