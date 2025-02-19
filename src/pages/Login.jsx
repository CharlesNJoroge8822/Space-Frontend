import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
// import { UserContext } from "../context/UserContext";

export default function Login() {

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
                    <p>Forgot password?</p>
                    <br></br>
                    <button type="submit">LOGIN</button>
                    <br></br>
                    <br></br>
                    <button type="submit">Sign in with Google</button>
                    <br></br>
                    <br></br>
                    <button type="submit">Sign in with Facebook</button>
                    <br></br>
                    <br></br>
                    <p>Don't have an account?<Link to="/Register"><strong> Register</strong></Link></p>
                    <p><strong>Or</strong></p>
                    <p>Are you an admin?<Link to="/AdminForm"><strong> Sign in here!</strong></Link></p>
                </form>
            </div>
        </div>
    )
}
}