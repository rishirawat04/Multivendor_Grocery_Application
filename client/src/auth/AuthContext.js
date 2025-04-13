import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import

import api from '../API/api';

// Create AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token is valid and not expired
  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000; // Convert to seconds
      if (decoded.exp < currentTime) {
        console.warn('Token has expired');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Check localStorage for token when app starts
      const token = localStorage.getItem('token');
      
      if (token) {
        if (isTokenValid(token)) {
          try {
            const decoded = jwtDecode(token);
            setUser({ id: decoded.id });
            setRole(decoded.accountType);
            
            // Verify token with server (optional but recommended)
            try {
              // You could add a verify-token endpoint if needed
              // await api.get('/users/verify-token', { withCredentials: true });
            } catch (error) {
              console.error('Token validation failed');
              localStorage.removeItem('token');
              setUser(null);
              setRole(null);
            }
          } catch (error) {
            console.error('Invalid token');
            localStorage.removeItem('token');
            setUser(null);
            setRole(null);
          }
        } else {
          // Token is expired or invalid, remove it
          localStorage.removeItem('token');
          setUser(null);
          setRole(null);
        }
      }
      
      setLoading(false); // Stop loading
    };
    
    checkAuthStatus();
    
    // Set up periodic token check (every 5 minutes)
    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token && !isTokenValid(token)) {
        console.warn('Token expired during session');
        localStorage.removeItem('token');
        setUser(null);
        setRole(null);
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    // Clean up interval on unmount
    return () => clearInterval(tokenCheckInterval);
  }, []);

  const logout = async () => {
    try {
      await api.post('users/logout', {}, { withCredentials: true });
      localStorage.removeItem('token');
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Logout failed');
      // Even if server logout fails, clear local state
      localStorage.removeItem('token');
      setUser(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, logout, setUser, setRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
