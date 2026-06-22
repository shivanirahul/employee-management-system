import "./Footer.css";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top">
        <div className="subscribe-text">
          <p>STAY CONNECTED</p>
          <h2>Get Updates</h2>
        </div>

        <div className="subscribe-form">
          <input
            type="email"
            placeholder="Enter your email address"
          />
          <button>SUBMIT</button>
        </div>
      </div>

      <div className="footer-container">

        <div className="footer-section">
          <h2>EmpTrack</h2>
          <p>
            Smart Employee Management System built with
            React, Node.js and MongoDB.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
  <li>
    <Link to="/dashboard">Dashboard</Link>
  </li>

  <li>
    <Link to="/employees">Employees</Link>
  </li>

  <li>
    <Link to="/add-employee">Add Employee</Link>
  </li>
</ul>
        </div>

        <div className="footer-section">
          <h3>Information</h3>
          <ul>
            <li>Our Team</li>
            <li>Data Protection</li>
            <li>Contact us</li>
            
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>

          <div className="social-icons">
            <span><FaFacebookF /></span>
            <span><FaTwitter /></span>
            <span><FaLinkedinIn /></span>
            <span><FaInstagram /></span>
          </div>
        </div>

      </div>

      <hr />

      <div className="footer-bottom">
        © 2026 EmpTrack • Employee Management System • All Rights Reserved
      </div>

    </footer>
  );
}

export default Footer;