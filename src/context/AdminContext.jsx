import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

// الباسورد المشفر (في production يجب استخدام backend وتشفير حقيقي)
const ADMIN_PASSWORD = 'Hadiya2024@Admin';
const SESSION_KEY = 'hadiya_admin_session';
const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const { timestamp } = JSON.parse(session);
        const now = Date.now();
        
        // Check if session is still valid
        if (now - timestamp < SESSION_DURATION) {
          setIsAuthenticated(true);
        } else {
          // Session expired
          localStorage.removeItem(SESSION_KEY);
        }
      } catch (error) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      const session = {
        timestamp: Date.now(),
        authenticated: true
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
