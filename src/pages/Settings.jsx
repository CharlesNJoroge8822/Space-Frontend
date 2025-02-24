import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import SettingsPhoto from "../assets/SettingsPhoto.png"

export default function Settings() {
  const { logout } = useContext(UserContext);

  return (
    <div className="settings-container">

      <img src={SettingsPhoto} alt="Photo" />

            <main className="main">
                {/* This is the empty page content */}
                
                <Link to="/about">Contact Us</Link> 
                <Link to="/agreements">Terms and Conditions</Link> 
                <br />
                <br />
                <br></br>

                <button onClick={logout} className="btn btn-danger mt-3">Logout</button>
            </main>
    </div>
  );
}
