import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import

import api from '../API/api';

// Create AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for token when app starts
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id });
        setRole(decoded.accountType);
      } catch (error) {
        console.error('Invalid token');
        setUser(null);
        setRole(null);
      }
    }
    setLoading(false); // Stop loading
  }, []);

  const logout = async () => {
    try {
      await api.post('users/logout', {}, { withCredentials: true });
      localStorage.removeItem('token');
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, logout, setUser, setRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
