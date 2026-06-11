import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <span style={{ fontSize: '2rem' }}>🚗</span>
            <div>
              <div className="footer-logo-name">MeeSeva DL Portal</div>
              <div className="footer-logo-sub">Government of Telangana</div>
            </div>
          </div>
          <p className="footer-desc">
            Official portal for applying, scheduling, and managing Driving Licence services in Telangana. Powered by MeeSeva citizen services.
          </p>
          <div className="footer-flags">
            <span className="flag-stripe saffron" />
            <span className="flag-stripe white" />
            <span className="flag-stripe green" />
          </div>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><Link to="/apply">Learner's Licence</Link></li>
            <li><Link to="/apply">Original DL</Link></li>
            <li><Link to="/apply">DL Renewal</Link></li>
            <li><Link to="/test-scheduler">Test Scheduling</Link></li>
            <li><Link to="/slot-booking">Slot Booking</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/eligibility">Eligibility Check</Link></li>
            <li><Link to="/fee-payment">Fee Payment</Link></li>
            <li><Link to="/status">Track Status</Link></li>
            <li><Link to="/certificate">Download Certificate</Link></li>
            <li><Link to="/notifications">Notifications</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul>
            <li>📞 1800-425-3993 (Toll Free)</li>
            <li>📧 support@meeseva.telangana.gov.in</li>
            <li>🏢 TSRTC Complex, Hyderabad – 500001</li>
            <li>🕐 Mon – Sat: 9:00 AM – 6:00 PM</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <div className="container footer-bottom-inner">
        <p>© 2025 Government of Telangana. All rights reserved. | MeeSeva Citizen Services</p>
        <div className="footer-bottom-links">
          <a href="#!">Privacy Policy</a>
          <a href="#!">Terms of Use</a>
          <a href="#!">Accessibility</a>
          <a href="#!">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
