import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('propwise_token');
      const savedUser = localStorage.getItem('propwise_user');
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify with backend
          const res = await authAPI.getMe();
          setUser(res.data);
          localStorage.setItem('propwise_user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Token verification error:", err);
          localStorage.removeItem('propwise_token');
          localStorage.removeItem('propwise_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const res = await authAPI.login({ email, password, remember_me: rememberMe });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('propwise_token', access_token);
    localStorage.setItem('propwise_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    const { access_token, user: newUserData } = res.data;
    localStorage.setItem('propwise_token', access_token);
    localStorage.setItem('propwise_user', JSON.stringify(newUserData));
    setUser(newUserData);
    return newUserData;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('propwise_token');
    localStorage.removeItem('propwise_user');
    setUser(null);
  };

  const isCustomer = user?.account_type === 'Customer';
  const isBankOfficer = user?.account_type === 'Bank Officer';
  const isAnalyst = user?.account_type === 'Property Analyst';
  const isAdmin = user?.account_type === 'Admin';
  const canReviewLoans = isAdmin || isBankOfficer;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isCustomer,
        isBankOfficer,
        isAnalyst,
        isAdmin,
        canReviewLoans,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
