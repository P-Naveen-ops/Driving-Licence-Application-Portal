import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './ModulePages.css';

const CertificatePage = () => {
  const { user, getUserApplications } = useAuth();
  const [query, setQuery] = useState('');
  const [cert, setCert] = useState(null);
  const printRef = useRef();

  const apps = getUserApplications().filter(a => a.status === 'Approved' || a.status === 'Completed');

  const handleSearch = (e) => {
    e.preventDefault();
    const found = apps.find(a => a.id.toLowerCase() === query.toLowerCase().trim());
    if (found) {
      setCert(found);
    } else {
      toast.error('No approved application found with this ID.');
      setCert(null);
    }
  };

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>DL Certificate</title>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@700&family=Noto+Sans:wght@400;600&display=swap" rel="stylesheet"/>
      <style>
        body{font-family:'Noto Sans',sans-serif;padding:40px;background:#fff;}
        .cert-print{max-width:700px;margin:0 auto;}
        h2{font-family:'Rajdhani',sans-serif;color:#003087;}
        .cert-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;}
      </style>
    </head><body>${content}</body></html>`);
    w.document.close();
    w.print();
  };

  const loadCert = (app) => { setCert(app); setQuery(app.id); };

  const issueDate = cert ? new Date(cert.createdAt) : new Date();
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 20);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="module-main">
        <div className="container" style={{ maxWidth: 780 }}>
          <div className="module-header">
            <h1>📜 Download DL Certificate</h1>
            <p>Download or print your digitally signed Driving Licence certificate for approved applications.</p>
          </div>

          <div className="form-card">
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input
                className="form-control"
                style={{ flex: 1, minWidth: 220 }}
                placeholder="Enter approved Application ID"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit" className="btn-primary">🔍 Find Certificate</button>
            </form>
          </div>

          {apps.length > 0 && (
            <div className="form-card" style={{ marginTop: 20 }}>
              <h3 style={{ marginBottom: 14 }}>Approved Applications</h3>
              {apps.map(a => (
                <div key={a.id} className="status-app-row" onClick={() => loadCert(a)} style={{ cursor: 'pointer' }}>
                  <div>
                    <strong>{a.id}</strong>
                    <span style={{ marginLeft: 10, color: 'var(--text-light)', fontSize: '0.85rem' }}>{a.licenceType}</span>
                  </div>
                  <span className="badge badge-success">{a.status}</span>
                </div>
              ))}
            </div>
          )}

          {!cert && apps.length === 0 && (
            <div className="empty-state" style={{ marginTop: 24, border: '2px dashed var(--border)' }}>
              <div className="empty-icon">📜</div>
              <h3>No Approved Applications</h3>
              <p>You need an approved application to download a certificate.</p>
            </div>
          )}

          {/* Certificate Preview */}
          {cert && (
            <div className="fade-up" style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, justifyContent: 'flex-end' }}>
                <button className="btn-secondary" onClick={handlePrint}>🖨️ Print Certificate</button>
                <button className="btn-primary" onClick={() => toast.info('PDF download coming soon!')}>⬇️ Download PDF</button>
              </div>

              <div ref={printRef} className="certificate-preview">
                <div className="cert-header">
                  <div className="cert-gov-logo">🇮🇳</div>
                  <div className="cert-gov-text">
                    <div>GOVERNMENT OF TELANGANA</div>
                    <div>TRANSPORT DEPARTMENT</div>
                    <div className="cert-title-main">DRIVING LICENCE</div>
                  </div>
                  <div className="cert-emblem">🚗</div>
                </div>

                <div className="cert-body">
                  <div className="cert-left">
                    <div className="cert-photo">👤</div>
                    <div className="cert-photo-label">Photo</div>
                    <div className="cert-sign-box">
                      <div className="cert-sign-line" />
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: 4 }}>Signature</div>
                    </div>
                  </div>

                  <div className="cert-fields">
                    {[
                      ['DL Number',   cert.id],
                      ['Full Name',   cert.name || user?.name],
                      ['Date of Birth', cert.dob || '—'],
                      ['Blood Group',  cert.bloodGroup || '—'],
                      ['Address',     cert.address || user?.address || 'Hyderabad, Telangana'],
                      ['Vehicle Classes', cert.vehicleClass || 'LMV, MCWG'],
                      ['Date of Issue', issueDate.toLocaleDateString('en-IN')],
                      ['Valid Till',    expiryDate.toLocaleDateString('en-IN')],
                      ['Issuing RTO',   cert.rto || 'Hyderabad Central (TS-09)'],
                    ].map(([k, v]) => (
                      <div key={k} className="cert-field-row">
                        <span className="cert-field-key">{k}</span>
                        <span className="cert-field-val">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cert-footer">
                  <div className="cert-barcode">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} style={{ width: 2, height: `${8 + (i % 4) * 5}px`, background: 'var(--navy)', borderRadius: 1 }} />
                    ))}
                  </div>
                  <div className="cert-footer-text">
                    <div>✅ Digitally Verified | Powered by MeeSeva</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.6, marginTop: 2 }}>Verify at sarathi.parivahan.gov.in</div>
                  </div>
                  <div className="cert-qr">
                    <div className="cert-qr-inner">QR</div>
                  </div>
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

export default CertificatePage;
