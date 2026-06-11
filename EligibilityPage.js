import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ModulePages.css';

const EligibilityPage = () => {
  const [form, setForm] = useState({ age: '', licenceType: '', hasLL: '', convictions: '', medicalIssues: '' });
  const [result, setResult] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const check = (e) => {
    e.preventDefault();
    const age = parseInt(form.age);
    const issues = [];
    const passed = [];

    // Age check
    if (form.licenceType === 'MCWOG' && age >= 16) passed.push('Age ≥ 16 for MCWOG ✓');
    else if (form.licenceType === 'MCWOG' && age < 16) issues.push('Minimum age for MCWOG is 16 years.');
    else if (age >= 18) passed.push('Age ≥ 18 for selected vehicle class ✓');
    else issues.push('Minimum age for selected vehicle class is 18 years.');

    // LL check for DL
    if (form.licenceType === 'DL') {
      if (form.hasLL === 'yes') passed.push('Learner\'s Licence held ✓');
      else issues.push('You must hold a valid Learner\'s Licence for at least 30 days before applying for DL.');
    }

    // Convictions
    if (form.convictions === 'no') passed.push('No disqualifying convictions ✓');
    else if (form.convictions === 'yes') issues.push('Persons with certain motor vehicle convictions may be disqualified. Please visit your RTO.');

    // Medical
    if (form.medicalIssues === 'no') passed.push('Medical fitness confirmed ✓');
    else if (form.medicalIssues === 'yes') issues.push('Applicants with certain medical conditions must submit a medical fitness certificate (Form 1A).');

    setResult({ eligible: issues.length === 0, passed, issues });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="module-main">
        <div className="container" style={{ maxWidth: 680 }}>
          <div className="module-header">
            <h1>✅ Eligibility Check</h1>
            <p>Answer a few questions to verify if you meet the eligibility criteria for your DL application.</p>
          </div>

          <div className="form-card">
            <form onSubmit={check} className="auth-form">
              <div className="form-group">
                <label>Your Age *</label>
                <input name="age" type="number" className="form-control" placeholder="Enter your age" value={form.age} onChange={handleChange} required min={1} max={100} />
              </div>
              <div className="form-group">
                <label>Applying For *</label>
                <select name="licenceType" className="form-control" value={form.licenceType} onChange={handleChange} required>
                  <option value="">-- Select --</option>
                  <option value="LL">Learner's Licence (LL)</option>
                  <option value="MCWOG">Motorcycle Without Gear (16+)</option>
                  <option value="DL">Original Driving Licence (DL)</option>
                  <option value="Renewal">DL Renewal</option>
                </select>
              </div>
              {form.licenceType === 'DL' && (
                <div className="form-group fade-in">
                  <label>Do you have a valid Learner's Licence? *</label>
                  <select name="hasLL" className="form-control" value={form.hasLL} onChange={handleChange} required>
                    <option value="">-- Select --</option>
                    <option value="yes">Yes, held for 30+ days</option>
                    <option value="no">No</option>
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Any motor vehicle convictions or disqualifications? *</label>
                <select name="convictions" className="form-control" value={form.convictions} onChange={handleChange} required>
                  <option value="">-- Select --</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label>Any medical conditions affecting driving? *</label>
                <select name="medicalIssues" className="form-control" value={form.medicalIssues} onChange={handleChange} required>
                  <option value="">-- Select --</option>
                  <option value="no">No</option>
                  <option value="yes">Yes (epilepsy, vision issues, etc.)</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
                🔍 Check Eligibility
              </button>
            </form>
          </div>

          {result && (
            <div className={`eligibility-result fade-up ${result.eligible ? 'eligible' : 'not-eligible'}`}>
              <div className="result-icon">{result.eligible ? '🎉' : '⚠️'}</div>
              <h3>{result.eligible ? 'You Are Eligible!' : 'Not Eligible Yet'}</h3>
              <p>{result.eligible ? 'You meet all the criteria. Proceed with your application.' : 'Please address the issues below before applying.'}</p>

              {result.passed.length > 0 && (
                <div className="result-list passed">
                  {result.passed.map((p, i) => <div key={i} className="result-item">✅ {p}</div>)}
                </div>
              )}
              {result.issues.length > 0 && (
                <div className="result-list issues">
                  {result.issues.map((p, i) => <div key={i} className="result-item">❌ {p}</div>)}
                </div>
              )}

              {result.eligible && (
                <a href="/apply" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
                  Proceed to Apply →
                </a>
              )}
            </div>
          )}

          {/* Requirements Table */}
          <div className="form-card" style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 16, color: 'var(--navy)' }}>📋 Quick Eligibility Reference</h3>
            <table className="apps-table">
              <thead>
                <tr><th>Licence Type</th><th>Min Age</th><th>Key Requirements</th></tr>
              </thead>
              <tbody>
                <tr><td>Learner's Licence (LL)</td><td>16 / 18</td><td>16 for MCWOG, 18 for others. Written test required.</td></tr>
                <tr><td>Original DL</td><td>18</td><td>Valid LL for 30+ days. Driving test at RTO.</td></tr>
                <tr><td>DL Renewal</td><td>—</td><td>Apply within 1 year of expiry. Medical form for 50+.</td></tr>
                <tr><td>International DL</td><td>18</td><td>Valid Indian DL required. Passport mandatory.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EligibilityPage;
