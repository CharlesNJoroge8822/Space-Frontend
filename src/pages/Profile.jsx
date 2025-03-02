import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "../App.css";


const Profile = () => {
    const { current_user, updateProfile, logout } = useContext(UserContext);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        image: "default.jpg",
    });

    useEffect(() => {
        if (current_user) {
            setProfileData({
                name: current_user.name,
                email: current_user.email,
                image: current_user.image || "default.jpg",
            });
        }
    }, [current_user]); // ✅ Added dependency to ensure correct data updates

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        toast.loading("Uploading image...");

        const formData = new FormData();
        formData.append("file", file);

        const token = sessionStorage.getItem("token") || localStorage.getItem("jwt_token");

        try {
            const response = await fetch("http://127.0.0.1:5000/upload-image", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setProfileData({ ...profileData, image: data.image_url });
                toast.dismiss();
                toast.success("Image uploaded successfully!");
            } else {
                throw new Error(data.error || "Upload failed");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Image upload failed: " + error.message);
        }
    };

    // ✅ Ensure handleSubmit is defined before being used
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!profileData.name || !profileData.email) {
            toast.error("Name and email are required!");
            return;
        }
        await updateProfile(current_user.id, profileData);
    };
    

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        disabled
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full p-2 border rounded"
                    />
                    {profileData.image && <img src={profileData.image} alt="Profile" className="mt-2 w-32 h-32 rounded-full" />}
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Update Profile
                </button>
            </form>
            {/* Logout Button */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <br />
            <br />
            <button
              onClick={logout}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                fontSize: "14px",
                cursor: "pointer",
                backgroundColor: "#dc3545",
                color: "#fff",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
            >
              Logout
            </button>
          </div>
        </div>
    );
};

export default Profile;