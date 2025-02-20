import React from "react";
import { UserContext } from "../context/UserContext";


export default function Settings(){
const { current_user, logout } = useContext(UserContext);
    
    return (
        <li className="nav-item">
        <button onClick={logout} className="btn btn-danger ms-3">Logout</button>
      </li>
    )
}