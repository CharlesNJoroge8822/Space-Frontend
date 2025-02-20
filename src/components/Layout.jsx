import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar - Always at the Top */}
      <Navbar />

      {/* Main Content - Expands Dynamically */}
      <div className="flex-grow-1 container-fluid bg-light d-flex flex-column align-items-center">
        <div className="w-100 p-4">
          <Outlet />
        </div>
        <ToastContainer />
      </div>

      {/* Footer - Stays at the Bottom */}
      <Footer />
    </div>
  );
}
