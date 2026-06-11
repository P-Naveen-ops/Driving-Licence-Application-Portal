import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const quickLinks = [
  { icon: '📋', label: 'New Application', to: '/apply', color: '#003087' },
  { icon: '✅', label: 'Check Eligibility', to: '/eligibility', color: '#18A558' },
  { icon: '📅', label: 'Schedule Test', to: '/test-scheduler', color: '#FF6700' },
  { icon: '💳', label: 'Pay Fees', to: '/fee-payment', color: '#D4A017' },
  { icon: '📍', label: 'Book Slot', to: '/slot-booking', color: '#7B1FA2' },
  { icon: '🔍', label: 'Track Status', to: '/status', color: '#1565C0' },
  { icon: '📜', label: 'Certificate', to: '/certificate', color: '#00695C' },
  { icon: '🔔', label: 'Notifications', to: '/notifications', color: '#E65100' },
];

const statusColors = {
  Submitted:   { bg: '#E3F2FD', color: '#1565C0' },
  'In Review': { bg: '#FFF3E0', color: '#E65100' },
  Approved:    { bg: '#E8F5E9', color: '#18A558' },
  Rejected:    { bg: '#FFEBEE', color: '#D32F2F' },
  Completed:   { bg: '#E8F5E9', color: '#18A558' },
};

const DashboardPage = () => {
  const { user, getUserApplications, notifications } = useAuth();
  const apps = getUserApplications();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="dashboard-main">
        <div className="container">

          {/* Welcome Banner */}
          <div className="welcome-banner fade-up">
            <div className="welcome-text">
              <div className="welcome-tag">👋 Welcome back</div>
              <h1>Hello, {user?.name?.split(' ')[0]}!</h1>
              <p>Manage your Driving Licence services from your personal dashboard.</p>
            </div>
            <div className="welcome-stats">
              <div className="w-stat"><span>{apps.length}</span>Applications</div>
              <div className="w-stat"><span>{apps.filter(a => a.status === 'Approved' || a.status === 'Completed').length}</span>Approved</div>
              <div className="w-stat"><span>{unread}</span>Notifications</div>
            </div>
          </div>

          {/* Quick Actions */}
          <section className="dash-section">
            <h2 className="dash-section-title">Quick Actions</h2>
            <div className="quick-grid">
              {quickLinks.map((q, i) => (
                <Link key={i} to={q.to} className="quick-card fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="quick-icon" style={{ background: `${q.color}15`, color: q.color }}>{q.icon}</div>
                  <span>{q.label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* My Applications */}
          <section className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">My Applications</h2>
              <Link to="/apply" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>+ New Application</Link>
            </div>

            {apps.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📂</div>
                <h3>No Applications Yet</h3>
                <p>Start your DL journey by submitting your first application.</p>
                <Link to="/apply" className="btn-primary" style={{ marginTop: '16px' }}>Apply Now</Link>
              </div>
            ) : (
              <div className="apps-table-wrap">
                <table className="apps-table">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Type</th>
                      <th>Vehicle Class</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apps.map(app => {
                      const sc = statusColors[app.status] || statusColors['Submitted'];
                      return (
                        <tr key={app.id}>
                          <td><strong>{app.id}</strong></td>
                          <td>{app.licenceType || 'Learner\'s Licence'}</td>
                          <td>{app.vehicleClass || 'LMV'}</td>
                          <td>{new Date(app.createdAt).toLocaleDateString('en-IN')}</td>
                          <td>
                            <span className="status-badge" style={{ background: sc.bg, color: sc.color }}>
                              {app.status}
                            </span>
                          </td>
                          <td>
                            <Link to="/status" className="table-action-btn">View →</Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Info Cards */}
          <section className="dash-section">
            <div className="info-cards-grid">
              <div className="info-card info-card-blue">
                <div className="info-card-icon">📞</div>
                <div>
                  <h4>Need Help?</h4>
                  <p>Call our helpline: <strong>1800-425-3993</strong><br />Mon–Sat, 9AM–6PM (Toll Free)</p>
                </div>
              </div>
              <div className="info-card info-card-green">
                <div className="info-card-icon">📱</div>
                <div>
                  <h4>mParivahan App</h4>
                  <p>Download the mParivahan app to carry your digital DL on your phone.</p>
                </div>
              </div>
              <div className="info-card info-card-orange">
                <div className="info-card-icon">📢</div>
                <div>
                  <h4>DL Validity Update</h4>
                  <p>DLs expiring after Jan 2020 are valid till June 2025. Check official notification.</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
