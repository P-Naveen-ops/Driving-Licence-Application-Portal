import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './ModulePages.css';

const rtoSlots = {
  'Hyderabad Central (TS-09)': ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
  'Hyderabad East (TS-10)':    ['09:30 AM', '10:30 AM', '12:00 PM', '02:30 PM'],
  'Secunderabad (TS-12)':      ['10:00 AM', '11:30 AM', '01:00 PM', '03:30 PM'],
  'Warangal (TS-05)':          ['09:00 AM', '11:00 AM', '02:00 PM'],
};

const TestSchedulerPage = () => {
  const { addNotification } = useAuth();
  const [form, setForm] = useState({ testType: '', rto: '', date: '', time: '', appId: '' });
  const [booked, setBooked] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const minDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const handleBook = (e) => {
    e.preventDefault();
    if (!form.testType || !form.rto || !form.date || !form.time) { toast.error('Please fill all fields.'); return; }
    addNotification({ type: 'info', message: `Test scheduled at ${form.rto} on ${form.date} at ${form.time}.`, time: new Date().toISOString() });
    setBooked(true);
    toast.success('Test scheduled successfully!');
  };

  if (booked) return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="module-main">
        <div className="container" style={{ maxWidth: 560, textAlign: 'center', paddingTop: 60 }}>
          <div className="success-circle" style={{ margin: '0 auto 20px', fontSize: '2rem', width: 72, height: 72, lineHeight: '72px', background: '#E8F5E9', color: 'var(--success)', borderRadius: '50%' }}>📅</div>
          <h2 style={{ color: 'var(--navy)', marginBottom: 10 }}>Test Scheduled!</h2>
          <div className="app-id-box" style={{ marginBottom: 8 }}>
            <span>Test Type</span><strong>{form.testType}</strong>
          </div>
          <div className="app-id-box" style={{ marginBottom: 8 }}>
            <span>RTO</span><strong>{form.rto}</strong>
          </div>
          <div className="app-id-box" style={{ marginBottom: 8 }}>
            <span>Date & Time</span><strong>{form.date} at {form.time}</strong>
          </div>
          <p style={{ marginTop: 20, color: 'var(--text-light)', fontSize: '0.9rem' }}>Carry original Aadhaar, LL (if applicable), and this confirmation on test day.</p>
          <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => setBooked(false)}>Schedule Another Test</button>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="module-main">
        <div className="container" style={{ maxWidth: 680 }}>
          <div className="module-header">
            <h1>📅 Test Scheduler</h1>
            <p>Book your Learner's Test or Driving Test at your preferred RTO location and time slot.</p>
          </div>
          <div className="form-card">
            <form onSubmit={handleBook} className="auth-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Test Type *</label>
                  <select name="testType" className="form-control" value={form.testType} onChange={handleChange} required>
                    <option value="">-- Select Test --</option>
                    <option>Learner's Licence Test (Written)</option>
                    <option>Driving Test (Practical)</option>
                    <option>Re-Test (Failed Previously)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Application ID (optional)</label>
                  <input name="appId" className="form-control" placeholder="e.g. DL1234567890" value={form.appId} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>RTO Location *</label>
                  <select name="rto" className="form-control" value={form.rto} onChange={handleChange} required>
                    <option value="">-- Select RTO --</option>
                    {Object.keys(rtoSlots).map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input name="date" type="date" className="form-control" min={minDate()} value={form.date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Time Slot *</label>
                  <select name="time" className="form-control" value={form.time} onChange={handleChange} required disabled={!form.rto}>
                    <option value="">-- Select Time --</option>
                    {form.rto && rtoSlots[form.rto]?.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="info-notice">
                📌 Test slots must be booked at least 3 days in advance. Bring original documents on test day.
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
                📅 Schedule Test
              </button>
            </form>
          </div>

          <div className="form-card" style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 14, color: 'var(--navy)' }}>📋 Test Day Checklist</h3>
            <div className="checklist">
              {[
                ['Original Aadhaar Card', 'Mandatory for identity verification'],
                ['Application Form Copy', 'Printed copy of submitted application'],
                ['Learner\'s Licence (for Driving Test)', '30+ days old LL required'],
                ['Passport-size photographs', '2 recent photos with white background'],
                ['Fee Payment Receipt', 'Digital or printed payment confirmation'],
              ].map(([title, desc], i) => (
                <div key={i} className="checklist-item">
                  <span className="checklist-icon">📎</span>
                  <div><strong>{title}</strong><span>{desc}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestSchedulerPage;
