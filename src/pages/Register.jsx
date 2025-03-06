import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // Corrected import
import "../App.css";

export default function Register() {
    const { addUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("Client");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");

    const validatePassword = (pwd) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return regex.test(pwd);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validatePassword(password)) {
            setPasswordError("Password must have at least 6 characters, one uppercase letter, one number, and one special character.");
            return;
        }
        if (password !== confirmPassword) {
            setConfirmError("Passwords do not match.");
            return;
        }
        setPasswordError("");
        setConfirmError("");
        addUser(name, email, password, role);
    };

    const handleGoogleSuccess = (credentialResponse) => {
        const userDetails = jwtDecode(credentialResponse.credential); // Correct usage
        addUser(userDetails.name, userDetails.email, "", "Client"); // Add user with Google details
        toast.success("Google sign-up successful!");
        navigate("/");
    };

    const handleGoogleFailure = () => {
        toast.error("Google sign-up failed. Please try again.");
    };

    return (
        <div className="register-container">
            <div className="form-box">
                <h2>Create an Account</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        required
                    />
                    <br /><br />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                    />
                    <br /><br />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError("");
                        }}
                        placeholder="Password"
                        required
                    />
                    {password && !validatePassword(password) && (
                        <p className="error">
                            ⚠️ Password must have at least 6 characters, one uppercase letter, one number, and one special character.
                        </p>
                    )}
                    <br /><br />

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setConfirmError("");
                        }}
                        placeholder="Confirm Password"
                        required
                    />
                    {confirmError && <p className="error">⚠️ {confirmError}</p>}
                    <br /><br />

                    <button type="submit">REGISTER</button>
                    <br /><br />

                    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleFailure}
                        />
                    </GoogleOAuthProvider>

                    <br /><br />

                    <p>
                        Already have an account?
                        <Link to="/login"><strong> Sign in!</strong></Link>
                    </p>
                </form>
            </div>
        </div>
    );
}