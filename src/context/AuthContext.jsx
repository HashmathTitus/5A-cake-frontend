import React, { createContext, useState, useEffect } from 'react';
import { clearStoredAuth } from '../api/axiosClient';

export const AuthContext = createContext();

const decodeJwt = (token) => {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalizedPayload.padEnd(normalizedPayload.length + ((4 - normalizedPayload.length % 4) % 4), '=')));
    return decoded;
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token) => {
  const decoded = decodeJwt(token);
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 <= Date.now();
};

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
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (!storedToken || isTokenExpired(storedToken)) {
      clearStoredAuth();
      return null;
    }

    return storedToken;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !isTokenExpired(token)) {
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
    clearStoredAuth();
  };

  const value = {
    admin,
    token,
    loading,
    setLoading,
    login,
    logout,
    isAuthenticated: !!token && !isTokenExpired(token),
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
