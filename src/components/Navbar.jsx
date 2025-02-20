import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
    <nav className="navbar navbar-expand-lg navbar-dark bg- shadow-lg px-4 mt-2">
      <div className="container-fluid">
        {/* Brand */}
        <Link to="/" className="navbar-brand text-warning fw-bold fs-3 text-center w-100 d-block">
          <img src={logoPhoto} className="navbar-logo-img" alt="Logo" />
          Ivy Court
        </Link>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {current_user ? (
              // Links for logged-in users
              <>
                {/* Admin-specific links */}
                {current_user.role === "Admin" && (
                  <li className="nav-item">
                    <Link
                      to="/manage-bookings"
                      className={`nav-link ${location.pathname === "/manage-bookings" ? "active" : ""}`}
                    >
                      Manage Bookings
                    </Link>
                    <Link
                      to="/manage-users"
                      className={`nav-link ${location.pathname === "/manage-users" ? "active" : ""}`}
                    >
                      Manage User
                    </Link>
                    
                    <Link
                      to="/manage-spaces"
                      className={`nav-link ${location.pathname === "/manage-spaces" ? "active" : ""}`}
                    >
                      Manage Spaces
                    </Link>
                    <Link
                      to="/settings"
                      className={`nav-link ${location.pathname === "/settings" ? "active" : ""}`}
                    >
                      Settings
                    </Link>
                    
                  </li>
                )}

                {/* Client-specific links */}
                {current_user.role === "Client" && (
                  <li className="nav-item">
                      <Link
                      to="/spaces"
                      className={`nav-link ${location.pathname === "/spaces" ? "active" : ""}`}
                    >
                      Spaces
                    </Link>
                    <Link
                      to="/bookings"
                      className={`nav-link ${location.pathname === "/bookings" ? "active" : ""}`}
                    >
                      My Bookings
                    </Link>

                    <Link
                    to="/profile"
                    className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className={`nav-link ${location.pathname === "/settings" ? "active" : ""}`}
                  >
                    Settings
                  </Link>

                  </li>
                  
                )}





                {/* <li className="nav-item">
                  {/* <Link
                    to="/about"
                    className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
                  >
                    About
                  </Link> */}
                {/* </li> */} 

                {/* Logout button */}
                {/* <li className="nav-item">
                  <button onClick={logout} className="btn btn-danger ms-3">Logout</button>
                </li> */}
              </>
            ) : (
              // Links for non-logged-in users
              <>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className={`nav-link ${location.pathname === "/register" ? "active" : ""}`}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
