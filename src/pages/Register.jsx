import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
// import { UserContext } from "../context/UserContext";

export default function Register() {

    // const {addUser} = useContext(UserContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // ---> Handle form submission 
    const handleSubmit = (e) => {
        e.preventDefault();

        // addUser(name, email, password)

        console.log('name:', name)
        console.log('email:', email)
        console.log('password:', password)
    }

    return (
        <div className="register-container">
            <div className="form-box">
                <h2>Create an account</h2>
                <form onSubmit={handleSubmit}>
                    <br></br>
                    <input type="text" value = {name} onChange={(e) => setName(e.target.value)} placeholder="Name"/>
                    <br></br>
                    <br></br>
                    <input type="email" value = {email} onChange={(e) => setEmail(e.target.value)}  placeholder="Email"/>
                    <br></br>
                    <br></br>
                    <input type="password" value = {password} onChange={(e) => setPassword(e.target.value)}  placeholder="Password" />
                    <br></br>
                    <br></br>
                    <p>Forgot password?</p>
                    <br></br>
                    <button type="submit">REGISTER</button>
                    <br></br>
                    <br></br>
                    <button type="submit">Sign up with Google</button>
                    <br></br>
                    <br></br>
                    <button type="submit">Sign up with Facebook</button>
                    <br></br>
                    <br></br>
                    <p>Do you already have an account?<Link to="/Login"><strong> Sign in!</strong></Link></p>
                </form>
            </div>
        </div>
    )
}