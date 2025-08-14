import React from 'react';
import './Footer.css';

// import footer_logo from '../Assets/logo_big.png'; // File not found
import instagram_icon from '../Assets/instagram_icon.png';
// import pintrest_icon from '../Assets/pintester_icon.png'; // File not found
// import whatsapp_icon from '../Assets/whatsapp_icon.png'; // Not used

const Footer = () => {
  return (
    <footer className='footer'>
      <div className="footer-container">
        <div className="footer-top">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <h3>Damio Kids</h3>
            </div>
            <p className="footer-description">
              Quality children's clothing for every occasion. Comfort meets style in our curated collection.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-links">
            <div className="link-column">
              <h4>Shop Links</h4>
              <ul>
                <li><a href="/products">All Products</a></li>
                <li><a href="/garcon">Boys</a></li>
                <li><a href="/fille">Girls</a></li>
                <li><a href="/bébé">Baby</a></li>
                <li><a href="/about">About Us</a></li>
              </ul>
            </div>
            <div className="link-column">
              <h4>Customer Service</h4>
              <ul>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/cart">Shopping Cart</a></li>
                <li><a href="/login">Account</a></li>
                <li><a href="/checkout">Checkout</a></li>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
                <li><a href="/terms-of-service">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Store Location */}
          <div className="footer-location">
            <h4>Store Location</h4>
            <div className="location-info">
              <div className="location-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="location-text">
                <p>nouvelle ville UV17</p>
                <p>Constantine, Algeria 25000</p>
                <a href="https://maps.app.goo.gl/aCJsgkkwv6URihRK9" target="_blank" rel="noopener noreferrer" className="directions-link">
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Subscribe to get special offers and updates!</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="footer-social-icons">
            <a href="https://www.instagram.com/damio.kids?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src={instagram_icon} alt="Instagram" />
            </a>
            <a href="https://www.tiktok.com/@damio.kids?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61566857383952" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2025 Damio Kids. All Rights Reserved.</p>
            <div className="footer-legal">
              <a href="/privacy-policy">Privacy Policy</a>
              <span>•</span>
              <a href="/terms-of-service">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
