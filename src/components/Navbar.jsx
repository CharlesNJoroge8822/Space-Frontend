import React from "react";
import logoPhoto from "../assets/logoPhoto.png";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

export default function Navbar({ current_user, logout }) {
    const location = useLocation();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src={logoPhoto} className="navbar-logo-img" alt="Logo" />
                <span className="navbar-title">Ivy Court</span>
            </Link>

            <div className="navbar-links">
                {current_user ? (
                    // Links for logged-in users
                    <>
                        <Link
                            to="/"
                            className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}
                        >
                            My entries
                        </Link>
                        <Link
                            to="/profile"
                            className={`navbar-link ${location.pathname === "/profile" ? "active" : ""}`}
                        >
                            Profile
                        </Link>
                        <Link
                            to="/addentry"
                            className={`navbar-link ${location.pathname === "/addentry" ? "active" : ""}`}
                        >
                            Add an entry
                        </Link>
                        <Link
                            to="/about"
                            className={`navbar-link ${location.pathname === "/about" ? "active" : ""}`}
                        >
                            About
                        </Link>
                        <Link
                            onClick={logout}
                            className="navbar-link"
                        >
                            Logout
                        </Link>
                    </>
                ) : (
                    // Links for non-logged-in users
                    <>
                        <Link
                            to="/register"
                            className={`navbar-link ${location.pathname === "/register" ? "active" : ""}`}
                        >
                            Register
                        </Link>
                        <Link
                            to="/login"
                            className={`navbar-link ${location.pathname === "/login" ? "active" : ""}`}
                        >
                            Login
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}