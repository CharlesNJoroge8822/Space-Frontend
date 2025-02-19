import React from "react";
import { useState } from "react";
// import { UserContext } from "../context/UserContext";

export default function AdminForm() {

    // const {login} = useContext(UserContext)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // ====> To Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); 

    // login(email, password)

    // };
    return (
        <div className="login-container">
            <div className="form-box">
                <h2>Welcome back!</h2>
                <form onSubmit={handleSubmit}>
                    <br></br>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                    <br></br>
                    <br></br>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    <br></br>
                    <br></br>
                    <button type="submit">LOGIN</button>
                </form>
            </div>
        </div>
    )
}
}