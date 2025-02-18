import React from "react";
import logoPhoto from '../assets/logoPhoto.png'
import { Link } from "react-router-dom";


export default function Navbar(){
    return (
        <div className="navbar">
            <Link to="/" className="navbar-logo">
                <img src={logoPhoto} className="navbar-logo-img" alt="Logo" />
                <span className="navbar-title">Ivy Court</span>
            </Link>

            <div className="navbar-links">
                <Link to="/" className="navbar-link">Home</Link>
                <Link to="/profile" className="navbar-link">Profile</Link>
                <Link to="/bookings" className="navbar-link">Bookings</Link>
                <Link to="/register" className="navbar-link">Register</Link>
                <Link to="/login" className="navbar-link">Login</Link>
                <Link to="/settings" className="navbar-link">Settings</Link>
            </div>
        </div>
    )
}