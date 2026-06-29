// src/services/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext({}); // Initialiser avec un objet vide


export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    if (!localStorage.getItem('token')) return null;

    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  });
  


  const login = async (email, password) => {
    try {
        const response = await axios.post('/api/login', { email, password });
        const { token } = response.data;
        const loggedInUser = response.data.user || { email, role: response.data.role };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
    } catch (error) {
        console.error("Erreur de connexion:", error);
        throw error;
    }
};
  

const logout = async (callback) => {
  try {
    await axios.post('/api/logout');
  } catch (error) {
    console.error('Logout Error', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (callback) callback();
  }
};



  const value = {
    user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
