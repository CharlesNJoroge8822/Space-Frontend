import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../App.css";
import logoPhoto from "../assets/logoPhoto.png";

export default function Navbar() {
  const { current_user, logout } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect based on user role after login
  useEffect(() => {
    if (current_user) {
      if (current_user.role === "Admin") {
        navigate("/manage-bookings"); // Redirect Admin to manage bookings
      } else if (current_user.role === "Client") {
        navigate("/spaces");
      }
    }
  }, [current_user, navigate]);

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/" className="navbar-logo">
        <img src={logoPhoto} className="navbar-logo-img" alt="Logo" />
        <span className="navbar-title">Ivy Court</span>
      </Link>

      {/* Navigation Links */}
      <div className="navbar-links">
        {current_user ? (
          // Links for logged-in users
          <>
            {/* Admin-specific links */}
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
                <Link
                  to="/settings"
                  className={`navbar-link ${location.pathname === "/settings" ? "active" : ""}`}
                >
                  Settings
                </Link>
              </>
            )}

            {/* Client-specific links */}
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
                <Link
                  to="/settings"
                  className={`navbar-link ${location.pathname === "/settings" ? "active" : ""}`}
                >
                  Settings
                </Link>
              </>
            )}

            {/* Logout button */}
            <button onClick={logout} className="navbar-link">
              Logout
            </button>
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
