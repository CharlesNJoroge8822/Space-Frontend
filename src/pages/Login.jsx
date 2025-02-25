import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const { login } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Client');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [showResetForm, setShowResetForm] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(email, password, role);
            setIsLoggedIn(true);
            toast.success(`Login successful as ${role}!`);
        } catch (error) {
            setIsLoggedIn(false);
            toast.error("Login failed! Please check your credentials.");
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            setResetMessage("Please enter your email.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/request_password_reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: resetEmail }),
            });

            const data = await response.json();
            if (response.ok) {
                setResetMessage("Password reset link sent to your email.");
            } else {
                setResetMessage(data.error || "Failed to send reset link.");
            }
        } catch (error) {
            setResetMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="form-box">
                <h2>Welcome back!</h2>
                <form onSubmit={handleSubmit}>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <br /><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <br /><br />

                    <p className="forgot-password" onClick={() => setShowResetForm(true)} style={{ cursor: "pointer", color: "blue" }}>
                        Forgot password?
                    </p>
                    <br />
                    <button type="submit">LOGIN</button>
                    <br /><br />
                    <p>
                        Don't have an account?
                        <Link to="/Register"><strong> Register</strong></Link>
                    </p>
                </form>

                {isLoggedIn && <p>You are logged in as {role}!</p>}
            </div>

            {showResetForm && (
                <div className="reset-password-modal">
                    <div className="reset-password-content">
                        <span className="close" onClick={() => setShowResetForm(false)}>&times;</span>
                        <h4>Reset Password</h4>
                        <input 
                            type="email" 
                            value={resetEmail} 
                            onChange={(e) => setResetEmail(e.target.value)} 
                            placeholder="Enter your email" 
                            required 
                        />
                        <button type="button" onClick={handlePasswordReset}>
                            Send Reset Link
                        </button>
                        {resetMessage && <p className="reset-message">{resetMessage}</p>}
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}