import React from "react";
import MainHeader from "../assets/MainHeader.png"
import secondPhoto from "../assets/secondPhoto.png"
import office from "../assets/office.png"
import restaurantPhoto from "../assets/restaurantPhoto.png"
import apartmentsPhoto from "../assets/apartmentsPhoto.png"
import contactPhoto from "../assets/contactPhoto.png"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // ---> import for FontAwesomeIcon
import { faLocationDot, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

export default function Home(){
    return (
        <div className="home">
            <img src={MainHeader} alt="Photo of a dining room" />

            <div class="first-container">
                <img src = {secondPhoto} alt="A collage of photos" className="normal-image"/>

                <div class="text">
                    <h4>WELCOME TO IVY COURT</h4>
                    <h3>Property leased to<br></br>your jurisdiction</h3>
                    <div class="paragraph">
                        <p>Ivy Court was created to help you make your 
                            dreams come true. Whether it is opening 
                            a restaurant, renting an apartment, hauling a 
                            shop or starting a new office. </p>
                    </div>
                </div>
            </div>
 
        {/* This is to view a single space (client) */}
        <div className="second-container">
            <p>VIEW ALL PROPERTIES</p>
            <h3>There’s no place like Ivy Court</h3>
            <div class="product-grid">
                <div class="product-item">
                <img src={apartmentsPhoto} alt="Photo fo apartments" class="normal-image" />
                <Link to="/HomeSweetHome">HOME SWEET HOME</Link>
                </div>
                <div class="product-item">
                    <img src={restaurantPhoto} alt="Restaurant Photo" />
                    <Link to="/StatementSpace">STATEMENT PLACE</Link>
                </div>
                <div class="product-item">
                    <img src={office} alt="Photo of an office" />
                    <Link to="/Business">BUSINESS VENTURES</Link>
                </div>
            </div>

        {/* Contact info */}
        <div class="third-container">

                <div class="text-third">
                    <h4>CONTACT</h4>
                    <h3>Get in Touch</h3>
                    <div class="paragraph">
                        <p>Don’t leave just yet! Feel free to connect with us for the latest updates.</p>
                    </div>
                    <div class="icons">
                        <p> 
                            <FontAwesomeIcon icon={faLocationDot} size="2x" />
                            1111, Kilimani</p>
                        <p>
                            <FontAwesomeIcon icon={faEnvelope} size="2x" />
                            ivycourt@gmail.com</p>
                        <p> 
                            <FontAwesomeIcon icon={faPhone} size="2x" />
                            +254 012 345 67</p>
                    </div>
                </div>

                <img src = {contactPhoto} alt="A photo of a dining room" className="normal-image"/>
            </div>

        </div>
        </div>
    )
}