import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('dlp_user');
    const storedApps = localStorage.getItem('dlp_applications');
    const storedNotifs = localStorage.getItem('dlp_notifications');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedApps) setApplications(JSON.parse(storedApps));
    if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
  }, []);

  const login = (userData) => {
    const users = JSON.parse(localStorage.getItem('dlp_users') || '[]');
    const found = users.find(
      u => u.email === userData.email && u.password === userData.password
    );
    if (found) {
      const { password, ...safe } = found;
      setUser(safe);
      localStorage.setItem('dlp_user', JSON.stringify(safe));
      return { success: true, user: safe };
    }
    return { success: false, message: 'Invalid email or password.' };
  };

  const signup = (userData) => {
    const users = JSON.parse(localStorage.getItem('dlp_users') || '[]');
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered.' };
    }
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('dlp_users', JSON.stringify(users));
    const { password, ...safe } = newUser;
    setUser(safe);
    localStorage.setItem('dlp_user', JSON.stringify(safe));
    return { success: true, user: safe };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dlp_user');
  };

  const addApplication = (app) => {
    const newApp = {
      id: 'DL' + Date.now(),
      userId: user?.id,
      createdAt: new Date().toISOString(),
      status: 'Submitted',
      ...app,
    };
    const updated = [...applications, newApp];
    setApplications(updated);
    localStorage.setItem('dlp_applications', JSON.stringify(updated));

    // Auto-notification
    addNotification({
      type: 'success',
      message: `Application ${newApp.id} submitted successfully.`,
      time: new Date().toISOString(),
    });
    return newApp;
  };

  const addNotification = (notif) => {
    const n = { id: Date.now(), read: false, ...notif };
    setNotifications(prev => {
      const updated = [n, ...prev];
      localStorage.setItem('dlp_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('dlp_notifications', JSON.stringify(updated));
  };

  const getUserApplications = () =>
    applications.filter(a => a.userId === user?.id);

  const getAllApplications = () => applications;

  return (
    <AuthContext.Provider value={{
      user, login, signup, logout,
      addApplication, getUserApplications, getAllApplications,
      notifications, addNotification, markNotificationsRead,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
