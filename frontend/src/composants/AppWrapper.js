// src/AppWrapper.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Importez BrowserRouter
import App from '../App';
import { AuthProvider } from '../services/AuthContext';

const AppWrapper = () => {
  return (
    <AuthProvider>
      <Router> {/* Enveloppez tout avec le composant Router */}
        <App />
      </Router>
    </AuthProvider>
  );
};

export default AppWrapper;
