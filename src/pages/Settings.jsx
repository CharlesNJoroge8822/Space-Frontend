import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Settings() {
  const { logout } = useContext(UserContext);

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <button onClick={logout} className="btn btn-danger mt-3">Logout</button>
    </div>
  );
}
