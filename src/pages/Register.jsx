import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Register() {
    const { addUser } = useContext(UserContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Client'); // Default role as Client
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');

    // Password validation function
    const validatePassword = (pwd) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return regex.test(pwd);
    };

    // Handle form submission
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

        setPasswordError('');
        setConfirmError('');

        // Call addUser function from context to register the user
        addUser(name, email, password, role);
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

                    {/* Password Input */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(''); // Clear error when typing
                        }}
                        placeholder="Password"
                        required
                    />
                    {password && !validatePassword(password) && (
                        <p className="error">⚠️ Password must have at least 6 characters, one uppercase letter, one number, and one special character.</p>
                    )}
                    <br /><br />

                    {/* Confirm Password Input */}
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setConfirmError('');
                        }}
                        placeholder="Confirm Password"
                        required
                    />
                    {confirmError && <p className="error">⚠️ {confirmError}</p>}
                    <br /><br />

                    {/* Role Selection */}

                    <br /><br />

                    <p className="forgot-password">Forgot password?</p>
                    <br />

                    {/* Register Button */}
                    <button type="submit">REGISTER</button>
                    <br /><br />

                    {/* Social Sign-up Options */}
                    <button 
                        type="button" 
                        onClick={() => window.location.href = "http://127.0.0.1:5000/google_login"} 
                        style={{ cursor: 'pointer' }}
                    >
                        Sign up with Google
                    </button>
                        <br></br>
                        <br></br>
                    <button 
                        type="button" 
                        style={{ cursor: 'pointer' }}
                    >
                        Sign up with Facebook
                    </button>
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
