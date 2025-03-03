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
    }, [current_user]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!profileData.name || !profileData.email) {
            toast.error("Name and email are required!");
            return;
        }
        await updateProfile(current_user.id, profileData);
    };

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    {profileData.image && (
                        <img src={profileData.image} alt="Profile" className="profile-image" />
                    )}
                </div>
                <button type="submit" className="submit-button">
                    Update Profile
                </button>
            </form>
            <div className="logout-container">
                <button onClick={logout} className="logout-button">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;