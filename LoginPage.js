import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AuthPages.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = e => {
    setErrorMsg('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.email || !form.password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setLoading(true);

    // Small delay to show loading state
    setTimeout(() => {
      const result = login(form);
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}! 🎉`);
        navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setErrorMsg(result.message || 'Invalid email or password.');
        setLoading(false);
      }
    }, 700);
  };

  // Fill demo credentials
  const fillDemo = (role) => {
    setErrorMsg('');
    if (role === 'admin') {
      // Seed admin account if not present
      const users = JSON.parse(localStorage.getItem('dlp_users') || '[]');
      if (!users.find(u => u.email === 'admin@meeseva.gov.in')) {
        users.push({
          id: 'admin001',
          name: 'Admin User',
          email: 'admin@meeseva.gov.in',
          password: 'Admin@123',
          phone: '9000000000',
          role: 'admin',
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('dlp_users', JSON.stringify(users));
      }
      setForm({ email: 'admin@meeseva.gov.in', password: 'Admin@123' });
    } else {
      // Seed demo user if not present
      const users = JSON.parse(localStorage.getItem('dlp_users') || '[]');
      if (!users.find(u => u.email === 'ravi@example.com')) {
        users.push({
          id: 'user001',
          name: 'Ravi Kumar',
          email: 'ravi@example.com',
          password: 'Test@123',
          phone: '9876543210',
          role: 'user',
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('dlp_users', JSON.stringify(users));
      }
      setForm({ email: 'ravi@example.com', password: 'Test@123' });
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-layout">

        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-left-badge">🏛️ MeeSeva Official Portal</div>
            <h2>Your DL Journey Starts Here</h2>
            <p>Access all driving licence services in one secure portal. Apply, track, pay, and download — completely online.</p>
            <div className="auth-features">
              {[
                'Aadhaar-based eKYC',
                'Secure payments',
                'Real-time tracking',
                'Digital DL certificate',
                '33 RTOs across Telangana',
              ].map((f, i) => (
                <div key={i} className="auth-feature-item">
                  <span className="feature-check">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div className="auth-emblem">🇮🇳</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-form-box fade-up">
            <div className="auth-form-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your MeeSeva account</p>
            </div>

            {/* Demo hint */}
            <div className="demo-hint">
              <span>🧪 Demo:</span>
              <button type="button" onClick={() => fillDemo('user')}  className="demo-btn">User Login</button>
              <button type="button" onClick={() => fillDemo('admin')} className="demo-btn">Admin Login</button>
            </div>

            {/* Inline error */}
            {errorMsg && (
              <div className="inline-error fade-in">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errorMsg ? 'input-error' : ''}`}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className={`form-control ${errorMsg ? 'input-error' : ''}`}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-row-between">
                <label className="checkbox-label">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#!" className="forgot-link">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="btn-primary auth-submit-btn"
                disabled={loading}
              >
                {loading
                  ? <><span className="btn-loader" />&nbsp; Signing in...</>
                  : '🔐 Sign In'
                }
              </button>
            </form>

            <div className="auth-divider"><span>OR</span></div>

            <div className="auth-alt-action">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">Create Account</Link>
            </div>

            <div className="auth-footer-note">
              🔒 This is a secure Government of Telangana portal. Your data is protected.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
