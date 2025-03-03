import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../App.css";
import logoPhoto from "../assets/logoPhoto.png";

export default function Navbar() {
    const { current_user, handleGoogleLogin, logout } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();

    // Check for Google login data on component mount
    useEffect(() => {
        handleGoogleLogin();
    }, [handleGoogleLogin]); // Ensure it runs again if `handleGoogleLogin` changes

    // Redirect based on user role
    useEffect(() => {
        if (current_user?.role) {
            if (current_user.role === "Admin" && location.pathname === "/") {
                navigate("/manage-bookings");
            } else if (current_user.role === "Client" && location.pathname === "/") {
                navigate("/spaces");
            }
        }
    }, [current_user, navigate, location.pathname]);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src={logoPhoto} className="navbar-logo-img" alt="Logo" />
                <span className="navbar-title">Ivy Court</span>
            </Link>

            <div className="navbar-links">
                {current_user ? (
                    <>
                        {current_user.role === "Admin" && (
                            <>
                                <Link
                                    to="/manage-bookings"
                                    className={`navbar-link ${location.pathname === "/manage-bookings" ? "active" : ""}`}
                                >
                                    Manage Bookings
                                </Link>
                                <Link
                                    to="/manage-users"
                                    className={`navbar-link ${location.pathname === "/manage-users" ? "active" : ""}`}
                                >
                                    Manage Users
                                </Link>
                                <Link
                                    to="/manage-spaces"
                                    className={`navbar-link ${location.pathname === "/manage-spaces" ? "active" : ""}`}
                                >
                                    Manage Spaces
                                </Link>
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <button onClick={logout} className="btn btn-danger ms-3">
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </>
                        )}

                        {current_user.role === "Client" && (
                            <>
                                <Link
                                    to="/spaces"
                                    className={`navbar-link ${location.pathname === "/spaces" ? "active" : ""}`}
                                >
                                    Spaces
                                </Link>
                                <Link
                                    to="/bookings"
                                    className={`navbar-link ${location.pathname === "/bookings" ? "active" : ""}`}
                                >
                                    My Bookings
                                </Link>
                                <Link
                                    to="/profile"
                                    className={`navbar-link ${location.pathname === "/profile" ? "active" : ""}`}
                                >
                                    Profile
                                </Link>
                            </>
                        )}
                    </>
                ) : (
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
