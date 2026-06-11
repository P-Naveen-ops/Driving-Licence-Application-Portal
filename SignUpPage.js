import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AuthPages.css';

const SignUpPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dob: '',
    aadhaar: '', address: '', state: 'Telangana',
    password: '', confirmPassword: '', agreeTerms: false,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const validateStep1 = () => {
    if (!form.name.trim()) { toast.error('Full name is required.'); return false; }
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) { toast.error('Valid email required.'); return false; }
    if (!form.phone || !/^\d{10}$/.test(form.phone)) { toast.error('Valid 10-digit phone required.'); return false; }
    if (!form.dob) { toast.error('Date of birth required.'); return false; }
    const age = Math.floor((new Date() - new Date(form.dob)) / (365.25 * 24 * 3600 * 1000));
    if (age < 16) { toast.error('Minimum age is 16 years.'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!form.aadhaar || !/^\d{12}$/.test(form.aadhaar)) { toast.error('Valid 12-digit Aadhaar required.'); return false; }
    if (!form.address.trim()) { toast.error('Address is required.'); return false; }
    return true;
  };

  const validateStep3 = () => {
    if (!form.password || form.password.length < 8) { toast.error('Password must be at least 8 characters.'); return false; }
    if (!/[A-Z]/.test(form.password)) { toast.error('Password must contain an uppercase letter.'); return false; }
    if (!/[0-9]/.test(form.password)) { toast.error('Password must contain a number.'); return false; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match.'); return false; }
    if (!form.agreeTerms) { toast.error('Please accept terms and conditions.'); return false; }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep3()) return;
    setLoading(true);
    setTimeout(() => {
      const result = signup(form);
      if (result.success) {
        toast.success('Account created! Welcome to MeeSeva DL Portal.');
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
      setLoading(false);
    }, 900);
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return { level: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const map = [
      { level: 1, label: 'Weak', color: 'var(--error)' },
      { level: 2, label: 'Fair', color: 'var(--warning)' },
      { level: 3, label: 'Good', color: 'var(--gold)' },
      { level: 4, label: 'Strong', color: 'var(--success)' },
    ];
    return map[score - 1] || { level: 0, label: '', color: '' };
  };
  const strength = passwordStrength();

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-layout">
        {/* Left */}
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-left-badge">🚗 New Registration</div>
            <h2>Create Your MeeSeva Account</h2>
            <p>Register once and access all Telangana transport services — DL, vehicle registration, fitness certificates, and more.</p>

            {/* Step Indicators */}
            <div className="signup-steps-visual">
              {[{ n: 1, label: 'Personal Info' }, { n: 2, label: 'Identity' }, { n: 3, label: 'Security' }].map(s => (
                <div key={s.n} className={`signup-step-dot ${step >= s.n ? 'done' : ''} ${step === s.n ? 'active' : ''}`}>
                  <div className="dot-circle">{step > s.n ? '✓' : s.n}</div>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="auth-emblem">🇮🇳</div>
          </div>
        </div>

        {/* Right */}
        <div className="auth-right">
          <div className="auth-form-box fade-up">
            <div className="auth-form-header">
              <h1>Create Account</h1>
              <p>Step {step} of 3 — {step === 1 ? 'Personal Details' : step === 2 ? 'Identity Verification' : 'Account Security'}</p>
            </div>

            {/* Progress bar */}
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${(step / 3) * 100}%` }} />
            </div>

            <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} className="auth-form">

              {/* Step 1 */}
              {step === 1 && (
                <>
                  <div className="form-group">
                    <label>Full Name (as per Aadhaar)</label>
                    <input name="name" className="form-control" placeholder="e.g. Ravi Kumar Patel" value={form.name} onChange={handleChange} />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input name="email" type="email" className="form-control" placeholder="your@email.com" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number</label>
                      <input name="phone" className="form-control" placeholder="10-digit mobile" maxLength={10} value={form.phone} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input name="dob" type="date" className="form-control" value={form.dob} onChange={handleChange} max={new Date().toISOString().split('T')[0]} />
                  </div>
                </>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <>
                  <div className="form-group">
                    <label>Aadhaar Number</label>
                    <input name="aadhaar" className="form-control" placeholder="12-digit Aadhaar" maxLength={12} value={form.aadhaar} onChange={handleChange} />
                    <span className="field-hint">🔒 Your Aadhaar is encrypted and never stored in plain text.</span>
                  </div>
                  <div className="form-group">
                    <label>Full Address</label>
                    <textarea name="address" className="form-control" placeholder="Door No, Street, Area, City" rows={3} value={form.address} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <select name="state" className="form-control" value={form.state} onChange={handleChange}>
                      <option>Telangana</option>
                      <option>Andhra Pradesh</option>
                      <option>Karnataka</option>
                      <option>Maharashtra</option>
                      <option>Tamil Nadu</option>
                    </select>
                  </div>
                </>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <>
                  <div className="form-group">
                    <label>Create Password</label>
                    <div className="password-wrap">
                      <input name="password" type={showPass ? 'text' : 'password'} className="form-control" placeholder="Min 8 chars, 1 uppercase, 1 number" value={form.password} onChange={handleChange} />
                      <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</button>
                    </div>
                    {form.password && (
                      <div className="strength-bar-wrap">
                        <div className="strength-segments">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="strength-seg" style={{ background: i <= strength.level ? strength.color : 'var(--light-gray)' }} />
                          ))}
                        </div>
                        <span style={{ color: strength.color, fontSize: '0.78rem', fontWeight: 600 }}>{strength.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input name="confirmPassword" type="password" className="form-control" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} />
                  </div>
                  <label className="checkbox-label terms-check">
                    <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} />
                    I agree to the <a href="#!" className="auth-link">Terms of Service</a> and <a href="#!" className="auth-link">Privacy Policy</a>
                  </label>
                </>
              )}

              <div className="form-nav-row">
                {step > 1 && (
                  <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}>
                    ← Back
                  </button>
                )}
                <button type="submit" className="btn-primary auth-submit-btn" disabled={loading} style={{ marginLeft: step > 1 ? '0' : 'auto' }}>
                  {loading ? <span className="btn-loader" /> : step === 3 ? '🎉 Create Account' : 'Next →'}
                </button>
              </div>
            </form>

            <div className="auth-alt-action">
              Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;
