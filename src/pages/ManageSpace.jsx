import { useContext, useState, useEffect } from "react";
import { SpaceContext } from "../contexts/SpaceContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageSpace = () => {
    const { spaces, createSpace, updateSpace, deleteSpace, fetchSpaces } = useContext(SpaceContext);
    const [currentSpace, setCurrentSpace] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [spaceForm, setSpaceForm] = useState({
        name: "",
        description: "",
        location: "",
        price_per_hour: "",
        price_per_day: "",
        availability: true,
        images: ""
    });

    useEffect(() => {
        const getSpaces = async () => {
            setLoading(true);
            try {
                await fetchSpaces();
            } catch (error) {
                toast.error("Failed to fetch spaces.");
                console.error("Error fetching spaces:", error);
            } finally {
                setLoading(false);
            }
        };
        getSpaces();
    }, [fetchSpaces]);

    const handleChange = (e) => {
        setSpaceForm({ ...spaceForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (currentSpace) {
                await updateSpace(currentSpace.id, spaceForm);
            } else {
                await createSpace(spaceForm);
            }
            resetForm();
            await fetchSpaces();
        } catch (error) {
            toast.error("Action failed!");
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (space) => {
        setCurrentSpace(space);
        setSpaceForm({
            name: space.name || "",
            description: space.description || "",
            location: space.location || "",
            price_per_hour: space.price_per_hour || "",
            price_per_day: space.price_per_day || "",
            availability: space.availability ?? true,
            images: space.images || ""
        });
    };
    
    const resetForm = () => {
        setSpaceForm({
            name: "",
            description: "",
            location: "",
            price_per_hour: "",
            price_per_day: "",
            availability: true,
            images: ""
        });
        setCurrentSpace(null);
    };

    return (
        <div className="admin-form">
        <div className="admin-box">
            <h2>Create a New Space</h2>
            <br />
            <br />
            <form onSubmit={handleSubmit}>
            <label>Name of the space</label>
                <br />
                <br />
                <input
                    type="text"
                    name="name"
                    placeholder="Name of the space"
                    required
                />
                <br />
                <br />
                <br />
                <label>Description</label>
                <br />
                <br />
                <textarea
                    name="description"
                    placeholder="Description"
                    required
                />
                <br />
                <br />
                <br />
                <label>Add a location</label>
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
                <br />
                <label>Prices</label>
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
                <br />
                <label>Availabilty</label>
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
                <br />
                <label>Add Images</label>
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
                <br />
                <button type="submit">SUBMIT</button>
            </form>
        <div className="max-w-6xl mx-auto p-6 space-y-8 bg-red-500">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-3xl font-semibold mb-4 text-gray-800 text-center">
                    {currentSpace ? "Update Space" : "Manage Spaces"}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(spaceForm).map((key) => (
                        <input
                            key={key}
                            type={key === "images" ? "text" : key.includes("price") ? "number" : "text"}
                            name={key}
                            placeholder={key.replace("_", " ").toUpperCase()}
                            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                            value={spaceForm[key]}
                            onChange={handleChange}
                            required={key !== "images"}
                        />
                    ))}
                    <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 col-span-2" disabled={loading}>
                        {loading ? "Processing..." : currentSpace ? "Update Space" : "Create Space"}
                    </button>
                </form>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading spaces...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {spaces.length > 0 ? (
                        spaces.map(space => (
                            <div key={space.id} className="p-4 shadow-lg rounded-lg border bg-white">
                                <img 
                                    src={space.images && (space.images.startsWith("data:image") || space.images.startsWith("http"))
                                        ? space.images 
                                        : "https://source.unsplash.com/400x300/?office,workspace"} 
                                    alt="Space" 
                                    className="w-full h-48 object-cover rounded-lg" 
                                    onError={(e) => { e.target.src = "https://dummyimage.com/400x300/000/fff&text=No+Image"; }} 
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-800">{space.name || "Unnamed Space"}</h3>
                                    <p className="text-gray-600">{space.description || "No description available"}</p>
                                    <p><strong>Location:</strong> {space.location || "Unknown"}</p>
                                    <p><strong>Price per Hour:</strong> ${space.price_per_hour || 0}</p>
                                    <p><strong>Price per Day:</strong> ${space.price_per_day || 0}</p>
                                    <p><strong>Availability:</strong> <span className={`font-bold ${space.availability ? "text-green-700" : "text-red-700"}`}>
                                        {space.availability ? "Available" : "Booked"}
                                    </span></p>
                                    <div className="flex justify-between mt-4">
                                        <button onClick={() => updateSpace(space.id, { availability: !space.availability })} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
                                            Toggle Availability
                                        </button>
                                        <button onClick={() => deleteSpace(space.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
                                            Delete
                                        </button>
                                        <button onClick={() => handleEdit(space)} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No spaces available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageSpace;