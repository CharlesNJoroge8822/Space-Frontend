import React from "react";
import { useNavigate } from "react-router-dom";

export default function AddSpace() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Add login logic here
        
        // Redirect to the AddSpace page after successful login
        navigate("/manage-space");
    };

    return (
        <div className="admin-form">
        <div className="admin-box">
            <h2>Create a New Space</h2>
            <form onSubmit={handleSubmit}>
                <br />
                <input
                    type="text"
                    name="name"
                    placeholder="Name of the space"
                    required
                />
                <br />
                <br />
                <textarea
                    name="description"
                    placeholder="Description"
                    required
                />
                <br />
                <br />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    required
                />
                <br />
                <br />
                <input
                    type="number"
                    name="price_per_hour"
                    placeholder="Price per hour"
                    required
                />
                <br />
                <br />
                <input
                    type="number"
                    name="price_per_day"
                    placeholder="Price per day"
                    required
                />
                <br />
                <br />
                <input
                    type="text"
                    name="availability"
                    placeholder="Availability"
                    required
                />
                <br />
                <br />
                <input
                    type="text"
                    name="images"
                    placeholder="Image URLs (comma-separated)"
                    required
                />
                <br />
                <br />
                <button type="submit">SUBMIT</button>
            </form>
        </div>
    </div>
    )
}