import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, notifications } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = user ? [
    { to: '/dashboard',      label: 'Dashboard' },
    { to: '/apply',          label: 'Apply' },
    { to: '/eligibility',    label: 'Eligibility' },
    { to: '/status',         label: 'Track Status' },
    ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ] : [];

  return (
    <>
      {/* Gov Top Bar */}
      <div className="gov-topbar">
        <div className="container">
          <span>🇮🇳 Government of Telangana — Official Portal</span>
          <span>Helpline: 1800-425-3993 | Mon–Sat 9AM–6PM</span>
        </div>
      </div>

      <nav className="navbar">
        <div className="container navbar-inner">
          {/* Brand */}
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <div className="brand-icon">
              <span>🚗</span>
            </div>
            <div className="brand-text">
              <span className="brand-name">MeeSeva</span>
              <span className="brand-sub">Driving Licence Portal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="navbar-links">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="navbar-actions">
            {user ? (
              <>
                <Link to="/notifications" className="notif-btn">
                  <span>🔔</span>
                  {unread > 0 && <span className="notif-badge">{unread}</span>}
                </Link>
                <div className="user-chip">
                  <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                  <span className="user-name">{user.name?.split(' ')[0]}</span>
                </div>
                <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }} onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                  Login
                </Link>
                <Link to="/signup" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                  Register
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`mobile-link ${location.pathname === link.to ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button className="mobile-link" style={{ background: 'none', border: 'none', textAlign: 'left', color: 'var(--error)', cursor: 'pointer' }} onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link to="/login"  className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="mobile-link" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
