import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const getStoredAdmin = () => {
  const raw = localStorage.getItem('adminProfile');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(getStoredAdmin());
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem('adminProfile', JSON.stringify(admin));
    } else {
      localStorage.removeItem('adminProfile');
    }
  }, [admin]);

  const login = (adminData, authToken) => {
    setAdmin(adminData);
    setToken(authToken);
    localStorage.setItem('adminProfile', JSON.stringify(adminData));
    localStorage.setItem('adminToken', authToken);
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  const value = {
    admin,
    token,
    loading,
    setLoading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
