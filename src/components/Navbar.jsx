import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logoPhoto from "../assets/logoPhoto.png";

export default function Navbar() {
  const { current_user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (current_user && location.pathname === "/") {
      if (current_user.role === "Admin") {
        navigate("/manage-bookings");
      } else if (current_user.role === "Client") {
        navigate("/spaces");
      }
    }
  }, [current_user, navigate, location.pathname]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom shadow-lg px-4 mt-2">
      <div className="container-fluid">
      <Link to="/" className="navbar-logo">
        <img src={logoPhoto} className="navbar-logo-img" alt="Logo" />
        <span className="navbar-title">Ivy Court</span>
      </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center gap-3">
            {current_user ? (
              <>
                {current_user.role === "Admin" && (
                  <>
                    <Link to="/manage-bookings" className={`nav-link ${location.pathname === "/manage-bookings" ? "active" : ""}`}>Manage Bookings</Link>
                    <Link to="/manage-users" className={`nav-link ${location.pathname === "/manage-users" ? "active" : ""}`}>Manage Users</Link>
                    <Link to="/manage-spaces" className={`nav-link ${location.pathname === "/manage-spaces" ? "active" : ""}`}>Manage Spaces</Link>
                  </>
                )}

                {current_user.role === "Client" && (
                  <>
                    <Link to="/spaces" className={`nav-link ${location.pathname === "/spaces" ? "active" : ""}`}>Spaces</Link>
                    <Link to="/bookings" className={`nav-link ${location.pathname === "/bookings" ? "active" : ""}`}>My Bookings</Link>
                    <Link to="/profile" className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}>Profile</Link>
                  </>
                )}
                <Link to="/settings" className={`nav-link ${location.pathname === "/settings" ? "active" : ""}`}>Settings</Link>
              </>
            ) : (
              <>
                <Link to="/login" className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}>Login</Link>
                <Link to="/register" className={`nav-link ${location.pathname === "/register" ? "active" : ""}`}>Register</Link>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
