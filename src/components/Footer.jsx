import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // ---> import for FontAwesomeIcon
import { faInstagram, faTiktok, faFacebook } from '@fortawesome/free-brands-svg-icons'; // ---> import the icons
import logoPhoto from '../assets/logoPhoto.png'

export default function Footer() {
  return (
    <div className="footer">
      <img src={logoPhoto} alt="Logo" />
      <p>Ivy Court</p>
      <p>Come as a guest, leave as a friend</p>
      <br />
      {/* For the icons. I installed them ---> Check chatgpt */}
      <div className="social-icons">
        <a href="https://tiktok.com/yourprofile" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTiktok} size="2x" />
        </a>
        <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} size="2x" />
        </a>
        <a href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebook} size="2x" />
        </a>
      </div>
    </div>
  );
}