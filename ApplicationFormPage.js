import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './ModulePages.css';

const licenceTypes = ['Learner\'s Licence (LL)', 'Original Driving Licence (DL)', 'DL Renewal', 'International DL'];
const vehicleClasses  = ['LMV (Light Motor Vehicle)', 'MCWG (Motorcycle With Gear)', 'MCWOG (Motorcycle Without Gear)', 'HMV (Heavy Motor Vehicle)', 'PSV (Public Service Vehicle)', 'Transport Vehicle'];

const ApplicationFormPage = () => {
  const { addApplication, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState('');
  const [form, setForm] = useState({
    licenceType: '', vehicleClass: '', rto: '',
    name: user?.name || '', dob: '', gender: '',
    bloodGroup: '', phone: user?.phone || '',
    email: user?.email || '', address: '', pincode: '',
    aadhaar: '', pan: '', emergencyContact: '',
    height: '', eyeSight: '', hearingOk: true,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateStep = (s) => {
    if (s === 1) {
      if (!form.licenceType) { toast.error('Select licence type.'); return false; }
      if (!form.vehicleClass) { toast.error('Select vehicle class.'); return false; }
      if (!form.rto) { toast.error('Select RTO.'); return false; }
    }
    if (s === 2) {
      if (!form.name || !form.dob || !form.gender || !form.bloodGroup) { toast.error('Fill all personal details.'); return false; }
      if (!form.phone || !form.email) { toast.error('Contact details required.'); return false; }
    }
    if (s === 3) {
      if (!form.aadhaar || !/^\d{12}$/.test(form.aadhaar)) { toast.error('Valid 12-digit Aadhaar required.'); return false; }
      if (!form.address || !form.pincode) { toast.error('Address and Pincode required.'); return false; }
    }
    return true;
  };

  const next = () => { if (validateStep(step)) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    const app = addApplication({ ...form });
    setAppId(app.id);
    setSubmitted(true);
    toast.success('Application submitted successfully!');
  };

  if (submitted) return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="module-main">
        <div className="container" style={{ maxWidth: 600, textAlign: 'center', paddingTop: 60 }}>
          <div className="success-animation">
            <div className="success-circle">✓</div>
          </div>
          <h2 style={{ marginBottom: 12, color: 'var(--navy)' }}>Application Submitted!</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>Your application has been received and is under review.</p>
          <div className="app-id-box">
            <span>Application ID</span>
            <strong>{appId}</strong>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', margin: '16px 0 28px' }}>
            Save this ID for future tracking. You will receive SMS/email updates.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/fee-payment')}>Pay Fees Now →</button>
            <button className="btn-secondary" onClick={() => navigate('/status')}>Track Status</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="module-main">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="module-header">
            <h1>📋 DL Application Form</h1>
            <p>Complete all steps to submit your Driving Licence application online.</p>
          </div>

          {/* Steps nav */}
          <div className="form-steps-nav">
            {['Licence Details', 'Personal Info', 'Identity & Address', 'Review'].map((label, i) => (
              <div key={i} className={`form-step-nav-item ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
                <div className="fsn-circle">{step > i + 1 ? '✓' : i + 1}</div>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="form-card">
            <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); next(); }}>

              {step === 1 && (
                <div className="form-step-body fade-in">
                  <h3>Licence Details</h3>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Type of Licence *</label>
                      <select name="licenceType" className="form-control" value={form.licenceType} onChange={handleChange}>
                        <option value="">-- Select --</option>
                        {licenceTypes.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Vehicle Class *</label>
                      <select name="vehicleClass" className="form-control" value={form.vehicleClass} onChange={handleChange}>
                        <option value="">-- Select --</option>
                        {vehicleClasses.map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Preferred RTO *</label>
                      <select name="rto" className="form-control" value={form.rto} onChange={handleChange}>
                        <option value="">-- Select RTO --</option>
                        {['Hyderabad Central (TS-09)','Hyderabad East (TS-10)','Hyderabad West (TS-11)','Secunderabad (TS-12)','Warangal (TS-05)','Nizamabad (TS-06)','Karimnagar (TS-07)'].map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-step-body fade-in">
                  <h3>Personal Information</h3>
                  <div className="form-grid-2">
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Full Name (as per Aadhaar) *</label>
                      <input name="name" className="form-control" value={form.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Date of Birth *</label>
                      <input name="dob" type="date" className="form-control" value={form.dob} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Gender *</label>
                      <select name="gender" className="form-control" value={form.gender} onChange={handleChange}>
                        <option value="">-- Select --</option>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Blood Group *</label>
                      <select name="bloodGroup" className="form-control" value={form.bloodGroup} onChange={handleChange}>
                        <option value="">-- Select --</option>
                        {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input name="phone" className="form-control" value={form.phone} onChange={handleChange} maxLength={10} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Email *</label>
                      <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Emergency Contact</label>
                      <input name="emergencyContact" className="form-control" placeholder="Parent/Spouse mobile" value={form.emergencyContact} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="form-step-body fade-in">
                  <h3>Identity & Address</h3>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Aadhaar Number *</label>
                      <input name="aadhaar" className="form-control" maxLength={12} placeholder="12-digit number" value={form.aadhaar} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>PAN Number</label>
                      <input name="pan" className="form-control" placeholder="Optional" value={form.pan} onChange={handleChange} maxLength={10} style={{ textTransform: 'uppercase' }} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Full Address *</label>
                      <textarea name="address" className="form-control" rows={3} value={form.address} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Pincode *</label>
                      <input name="pincode" className="form-control" maxLength={6} value={form.pincode} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Height (cm)</label>
                      <input name="height" className="form-control" type="number" min={100} max={250} value={form.height} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Eye Sight (if any correction)</label>
                      <input name="eyeSight" className="form-control" placeholder="e.g. -1.5 / -2.0" value={form.eyeSight} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="form-step-body fade-in">
                  <h3>Review & Submit</h3>
                  <div className="review-grid">
                    {[
                      ['Licence Type', form.licenceType],
                      ['Vehicle Class', form.vehicleClass],
                      ['RTO', form.rto],
                      ['Full Name', form.name],
                      ['Date of Birth', form.dob],
                      ['Gender', form.gender],
                      ['Blood Group', form.bloodGroup],
                      ['Mobile', form.phone],
                      ['Email', form.email],
                      ['Aadhaar', form.aadhaar ? '●●●●●●●●' + form.aadhaar.slice(-4) : '-'],
                      ['Address', form.address],
                      ['Pincode', form.pincode],
                    ].map(([k, v]) => (
                      <div key={k} className="review-row">
                        <span className="review-key">{k}</span>
                        <span className="review-val">{v || '—'}</span>
                      </div>
                    ))}
                  </div>
                  <div className="review-note">
                    ⚠️ Please verify all details before submitting. Changes cannot be made after submission.
                  </div>
                </div>
              )}

              <div className="form-nav-buttons">
                {step > 1 && <button type="button" className="btn-secondary" onClick={back}>← Back</button>}
                <button type="submit" className="btn-primary" style={{ marginLeft: step > 1 ? 0 : 'auto' }}>
                  {step === 4 ? '🚀 Submit Application' : 'Next →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApplicationFormPage;
