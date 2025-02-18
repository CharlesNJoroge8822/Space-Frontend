import React from "react";
import logoPhoto from "../assets/logoPhoto.png";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src={logoPhoto} className="navbar-logo-img" alt="Logo" />
                <span className="navbar-title">Ivy Court</span>
            </Link>

            <div className="navbar-links">
                {[
                    { path: "/", label: "Home" },
                    { path: "/profile", label: "Profile" },
                    { path: "/bookings", label: "Bookings" },
                    { path: "/register", label: "Register" },
                    { path: "/login", label: "Login" },
                    { path: "/settings", label: "Settings" },
                ].map(({ path, label }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`navbar-link ${location.pathname === path ? "active" : ""}`}
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
