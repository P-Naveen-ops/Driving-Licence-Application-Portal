import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './ModulePages.css';

const statuses = ['Submitted', 'In Review', 'Approved', 'Rejected', 'Completed'];

const AdminPanelPage = () => {
  const { getAllApplications, addNotification } = useAuth();
  const [applications, setApplications] = useState(getAllApplications());
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const users = JSON.parse(localStorage.getItem('dlp_users') || '[]');

  const filtered = applications.filter(a => {
    const matchFilter = filter === 'All' || a.status === filter;
    const matchSearch = !search || a.id.toLowerCase().includes(search.toLowerCase()) || (a.name || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const updateStatus = (appId, newStatus) => {
    const allApps = JSON.parse(localStorage.getItem('dlp_applications') || '[]');
    const updated = allApps.map(a => a.id === appId ? { ...a, status: newStatus } : a);
    localStorage.setItem('dlp_applications', JSON.stringify(updated));
    setApplications(updated);
    addNotification({ type: newStatus === 'Approved' ? 'success' : 'info', message: `Application ${appId} status updated to ${newStatus}.`, time: new Date().toISOString() });
    toast.success(`Status updated to "${newStatus}"`);
  };

  const statColors = {
    Submitted: '#1565C0', 'In Review': '#E65100',
    Approved: '#18A558', Rejected: '#D32F2F', Completed: '#18A558',
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'Submitted' || a.status === 'In Review').length,
    approved: applications.filter(a => a.status === 'Approved' || a.status === 'Completed').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="module-main">
        <div className="container">
          <div className="module-header">
            <h1>🛡️ Admin Panel</h1>
            <p>Manage all applications, update statuses, and oversee portal activity.</p>
          </div>

          {/* Stats */}
          <div className="admin-stats-grid">
            {[
              { label: 'Total Applications', value: stats.total, color: '#003087', icon: '📋' },
              { label: 'Pending Review',      value: stats.pending, color: '#E65100', icon: '⏳' },
              { label: 'Approved',            value: stats.approved, color: '#18A558', icon: '✅' },
              { label: 'Rejected',            value: stats.rejected, color: '#D32F2F', icon: '❌' },
              { label: 'Total Users',         value: users.length, color: '#7B1FA2', icon: '👥' },
            ].map((s, i) => (
              <div key={i} className="admin-stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
                <div className="admin-stat-icon" style={{ color: s.color }}>{s.icon}</div>
                <div className="admin-stat-val" style={{ color: s.color }}>{s.value}</div>
                <div className="admin-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="form-card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                className="form-control"
                style={{ flex: 1, minWidth: 200 }}
                placeholder="Search by App ID or Name"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="filter-tabs">
                {['All', ...statuses].map(f => (
                  <button key={f}
                    className={`filter-tab ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="apps-table-wrap">
            <table className="apps-table">
              <thead>
                <tr>
                  <th>App ID</th>
                  <th>Applicant</th>
                  <th>Type</th>
                  <th>Vehicle</th>
                  <th>RTO</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>No applications found.</td></tr>
                ) : (
                  filtered.map(app => (
                    <tr key={app.id}>
                      <td><strong style={{ color: 'var(--navy)' }}>{app.id}</strong></td>
                      <td>{app.name || 'N/A'}</td>
                      <td style={{ fontSize: '0.82rem' }}>{app.licenceType || 'LL'}</td>
                      <td style={{ fontSize: '0.82rem' }}>{app.vehicleClass || 'LMV'}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{(app.rto || '').split('(')[0]}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <span className="status-badge" style={{ background: `${statColors[app.status]}18`, color: statColors[app.status] }}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          style={{ padding: '5px 8px', fontSize: '0.8rem', minWidth: 130 }}
                          value={app.status}
                          onChange={e => updateStatus(app.id, e.target.value)}>
                          {statuses.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--text-light)' }}>
            Showing {filtered.length} of {applications.length} applications
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanelPage;
