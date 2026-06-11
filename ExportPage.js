import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './ModulePages.css';

const ExportPage = () => {
  const { getAllApplications } = useAuth();
  const [format, setFormat] = useState('CSV');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const all = getAllApplications();

  const filtered = all.filter(a => {
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (dateFrom && new Date(a.createdAt) < new Date(dateFrom)) return false;
    if (dateTo && new Date(a.createdAt) > new Date(dateTo)) return false;
    return true;
  });

  const exportCSV = () => {
    if (filtered.length === 0) { toast.error('No data to export.'); return; }
    const headers = ['Application ID', 'Name', 'Licence Type', 'Vehicle Class', 'RTO', 'Status', 'Date'];
    const rows = filtered.map(a => [
      a.id, a.name || '', a.licenceType || '', a.vehicleClass || '',
      a.rto || '', a.status, new Date(a.createdAt).toLocaleDateString('en-IN'),
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `DL_Applications_${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} records as CSV.`);
  };

  const exportJSON = () => {
    if (filtered.length === 0) { toast.error('No data to export.'); return; }
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `DL_Applications_${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} records as JSON.`);
  };

  const handleExport = () => {
    if (format === 'CSV') exportCSV();
    else if (format === 'JSON') exportJSON();
    else { toast.info('PDF export requires jsPDF integration. CSV/JSON available.'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="module-main">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="module-header">
            <h1>📤 Export Data</h1>
            <p>Export application records in CSV, JSON, or PDF format for reporting and analysis.</p>
          </div>

          <div className="form-card">
            <h3 style={{ marginBottom: 20 }}>Export Settings</h3>
            <div className="auth-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Export Format</label>
                  <select className="form-control" value={format} onChange={e => setFormat(e.target.value)}>
                    <option>CSV</option>
                    <option>JSON</option>
                    <option>PDF (Summary)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Filter by Status</label>
                  <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option>All</option>
                    {['Submitted', 'In Review', 'Approved', 'Rejected', 'Completed'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date From</label>
                  <input type="date" className="form-control" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Date To</label>
                  <input type="date" className="form-control" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                </div>
              </div>

              <div className="export-preview-box">
                <div className="export-preview-stat">
                  <span>Records to Export</span>
                  <strong style={{ color: 'var(--navy)', fontSize: '1.8rem' }}>{filtered.length}</strong>
                </div>
                <div className="export-preview-stat">
                  <span>Total in DB</span>
                  <strong>{all.length}</strong>
                </div>
                <div className="export-preview-stat">
                  <span>Format</span>
                  <strong>{format}</strong>
                </div>
              </div>

              <button className="btn-primary" style={{ justifyContent: 'center', width: '100%', padding: 14 }} onClick={handleExport}>
                📤 Export {filtered.length} Records as {format}
              </button>
            </div>
          </div>

          {/* Preview Table */}
          {filtered.length > 0 && (
            <div className="form-card" style={{ marginTop: 24 }}>
              <h3 style={{ marginBottom: 14 }}>Preview (first 5 rows)</h3>
              <div className="apps-table-wrap">
                <table className="apps-table">
                  <thead>
                    <tr><th>App ID</th><th>Name</th><th>Type</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 5).map(a => (
                      <tr key={a.id}>
                        <td><strong>{a.id}</strong></td>
                        <td>{a.name || 'N/A'}</td>
                        <td style={{ fontSize: '0.82rem' }}>{a.licenceType || 'LL'}</td>
                        <td><span className="badge badge-info">{a.status}</span></td>
                        <td>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length > 5 && <p style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--text-light)' }}>...and {filtered.length - 5} more records.</p>}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExportPage;
