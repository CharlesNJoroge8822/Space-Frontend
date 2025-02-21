import React from "react";
import aboutPhoto from "../assets/aboutPhoto.png"
import sndPhoto from "../assets/sndPhoto.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // ---> import for FontAwesomeIcon
import { faLocationDot, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';


export default function About(){
    return (
        <div className="about">
            <img src={aboutPhoto} alt="About photo" />

            <div class="about-container">
            
                <div class="text">
                    
                    <h3>About Us</h3>
                    <div class="paragraph">
                        <p>Ivy Court was created to help you make your dreams come true. We offer spaces to help you create something unique that resonates with your style and personal taste. All of our spaces can be used for anything you would like whether it's a restaurant, bar, store, gym e.t.c. <br></br><br></br>We also offer apartments to rent and stay for as long as you like. Interested in working with us? Contact us below.
                        </p>
                    </div>
                </div>

                {/* Contact info */}
                        <div class="third-container">
                
                                <div class="text-third">
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
                
                                <img src = {sndPhoto} alt="A photo of a dining room" className="normal-image"/>
                            </div>
            </div>
        </div>
    )
}