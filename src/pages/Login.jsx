import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Import UserContext
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify functions  
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS  

export default function Login() {
    const { login } = useContext(UserContext); // Destructure login function from context

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Client'); // Added role state
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Added isLoggedIn state

    // ====> Handle form submission
    const handleSubmit = async (e) => {  
        e.preventDefault();   

        try {
            await login(email, password, role); // Include role in login function if needed
            setIsLoggedIn(true); // Update state on successful login
            setTime(); // Call setTime to track login time
            toast.success(`Login successful as ${role}!`); // Display success notification  
        } catch (error) {  
            setIsLoggedIn(false); // Ensure state is updated on failure
            toast.error("Login failed! Please check your credentials."); // Display error notification  
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
                    {/* Role Selection Dropdown */}
                    {/* <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Client">Client</option>
                        <option value="Admin">Admin</option>
                    </select> */}
                    {/* <br /><br /> */}
                    <p>Forgot password?</p>
                    <br />
                    <button type="submit">LOGIN</button>
                    <br /><br />
                    <p>
                        Don't have an account?
                        <Link to="/Register"><strong> Register</strong></Link>
                    </p>

                </form>
                {/* Show message when logged in */}
                {isLoggedIn && <p>You are logged in as {role}!</p>}
            </div>
            {/* Add ToastContainer here */}
            <ToastContainer />
        </div>
    );
}
