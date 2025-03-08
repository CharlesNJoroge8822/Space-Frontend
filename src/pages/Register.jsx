import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../App.css";
import { toast } from "react-toastify";

export default function Register() {
    const { addUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Client');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');

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
        setPasswordError('');
        setConfirmError('');
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

                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => { 
                            setPassword(e.target.value); 
                            setPasswordError(''); 
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
                            setConfirmError(''); 
                        }} 
                        placeholder="Confirm Password" 
                        required 
                    />
                    {confirmError && <p className="error">⚠️ {confirmError}</p>}
                    <br /><br />

                    <label>
                        <input 
                            type="checkbox" 
                            checked={role === 'Admin'} 
                            onChange={(e) => setRole(e.target.checked ? 'Admin' : 'Client')} 
                        />
                        Register as Admin
                    </label>
                    <br /><br />

                    <button type="submit">REGISTER</button>
                    <br /><br />

                    <button
                        type="button"
                        onClick={() => (window.location.href = "https://space-backend-6.onrender.com/authorize_google")}
                        style={{ cursor: "pointer" }}
                    >
                        Sign up with Google
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