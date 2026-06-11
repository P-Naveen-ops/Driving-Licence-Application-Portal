import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './ModulePages.css';

const mockTimeline = (status) => {
  const all = [
    { label: 'Application Submitted',    done: true,  date: '10 May 2025' },
    { label: 'Documents Verified',        done: true,  date: '12 May 2025' },
    { label: 'Fee Payment Confirmed',     done: true,  date: '13 May 2025' },
    { label: 'Test Scheduled',            done: status !== 'Submitted', date: '18 May 2025' },
    { label: 'Test Cleared',              done: ['Approved','Completed'].includes(status), date: '20 May 2025' },
    { label: 'DL Card Dispatched',        done: status === 'Completed', date: '25 May 2025' },
    { label: 'DL Delivered',              done: status === 'Completed', date: '28 May 2025' },
  ];
  return all;
};

const StatusTrackPage = () => {
  const { getUserApplications } = useAuth();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const myApps = getUserApplications();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) { toast.error('Enter an Application ID.'); return; }
    const found = myApps.find(a => a.id.toLowerCase() === query.toLowerCase().trim());
    setSearched(true);
    if (found) setResult(found);
    else setResult(null);
  };

  const statusColor = {
    Submitted:   '#1565C0',
    'In Review': '#E65100',
    Approved:    '#18A558',
    Rejected:    '#D32F2F',
    Completed:   '#18A558',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="module-main">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="module-header">
            <h1>🔍 Track Application Status</h1>
            <p>Enter your Application ID to get real-time status updates on your DL application.</p>
          </div>

          <div className="form-card">
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input
                className="form-control"
                style={{ flex: 1, minWidth: 220 }}
                placeholder="Enter Application ID (e.g. DL1234567890)"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>🔍 Track Now</button>
            </form>
          </div>

          {/* My Applications List */}
          {myApps.length > 0 && !result && (
            <div className="form-card" style={{ marginTop: 24 }}>
              <h3 style={{ marginBottom: 16 }}>📂 My Applications</h3>
              {myApps.map(app => (
                <div key={app.id} className="status-app-row" onClick={() => { setQuery(app.id); setResult(app); setSearched(true); }}>
                  <div>
                    <strong>{app.id}</strong>
                    <span style={{ marginLeft: 12, color: 'var(--text-light)', fontSize: '0.85rem' }}>{app.licenceType}</span>
                  </div>
                  <span className="status-badge" style={{ background: `${statusColor[app.status]}18`, color: statusColor[app.status] }}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Result */}
          {searched && !result && (
            <div className="form-card fade-in" style={{ marginTop: 24, textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔎</div>
              <h3 style={{ color: 'var(--text-dark)', marginBottom: 8 }}>No Application Found</h3>
              <p style={{ color: 'var(--text-light)' }}>Check the Application ID and try again. IDs start with "DL".</p>
            </div>
          )}

          {result && (
            <div className="fade-up" style={{ marginTop: 24 }}>
              {/* Status Card */}
              <div className="form-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Application ID</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)' }}>{result.id}</div>
                  </div>
                  <span className="status-badge" style={{ background: `${statusColor[result.status]}18`, color: statusColor[result.status], alignSelf: 'center', fontSize: '0.95rem', padding: '8px 20px' }}>
                    ● {result.status}
                  </span>
                </div>
                <div className="status-details-grid">
                  {[
                    ['Licence Type', result.licenceType || 'Learner\'s Licence'],
                    ['Vehicle Class', result.vehicleClass || 'LMV'],
                    ['RTO', result.rto || 'Hyderabad Central'],
                    ['Applied On', new Date(result.createdAt).toLocaleDateString('en-IN')],
                  ].map(([k, v]) => (
                    <div key={k} className="sd-item">
                      <span>{k}</span><strong>{v}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="form-card" style={{ marginTop: 20 }}>
                <h3 style={{ marginBottom: 24 }}>Application Timeline</h3>
                <div className="timeline">
                  {mockTimeline(result.status).map((t, i) => (
                    <div key={i} className={`timeline-item ${t.done ? 'done' : 'pending'}`}>
                      <div className="timeline-dot">{t.done ? '✓' : ''}</div>
                      <div className="timeline-content">
                        <strong>{t.label}</strong>
                        <span>{t.done ? t.date : 'Pending'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StatusTrackPage;
