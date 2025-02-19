import React from "react";
import MainHeader from "../assets/MainHeader.png"
import secondPhoto from "../assets/secondPhoto.png"

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

                        <p>Everything is possible with Ivy Court.</p>
                    </div>
                </div>
            </div>

        
        </div>
    )
}