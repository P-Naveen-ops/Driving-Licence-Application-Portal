import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './ModulePages.css';

const iconMap = { success: '✅', info: 'ℹ️', warning: '⚠️', error: '❌' };
const colorMap = {
  success: { bg: '#E8F5E9', border: '#A5D6A7', color: '#1B5E20' },
  info:    { bg: '#E3F2FD', border: '#90CAF9', color: '#0D47A1' },
  warning: { bg: '#FFF8E1', border: '#FFE082', color: '#E65100' },
  error:   { bg: '#FFEBEE', border: '#EF9A9A', color: '#B71C1C' },
};

const NotificationsPage = () => {
  const { notifications, markNotificationsRead } = useAuth();

  useEffect(() => {
    markNotificationsRead();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="module-main">
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="module-header">
            <h1>🔔 Notifications</h1>
            <p>Stay updated on your application status, payments, and important alerts.</p>
          </div>

          {notifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <h3>No Notifications</h3>
              <p>You'll receive updates here when your application status changes.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {notifications.map(n => {
                const c = colorMap[n.type] || colorMap.info;
                return (
                  <div key={n.id} className="notif-item fade-up"
                    style={{ background: c.bg, border: `1.5px solid ${c.border}`, color: c.color }}>
                    <div className="notif-icon">{iconMap[n.type] || 'ℹ️'}</div>
                    <div className="notif-body">
                      <div className="notif-message">{n.message}</div>
                      <div className="notif-time">{new Date(n.time).toLocaleString('en-IN')}</div>
                    </div>
                    {!n.read && <span className="notif-unread-dot" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationsPage;
