// authService.js

import axios from 'axios';

const baseURL = 'http://localhost:8000/api'; // Remplacez cela par l'URL de votre API Laravel

const authService = {
  // Fonction pour se connecter
  login: async (email, password) => {
    try {
      const response = await axios.post(`${baseURL}/login`, { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Fonction pour se déconnecter
  logout: async () => {
    try {
      // Implémentez la logique de déconnexion ici si nécessaire
    } catch (error) {
      throw error;
    }
  },

  // Fonction pour vérifier l'état de l'authentification
  checkAuthStatus: async () => {
    try {
      // Implémentez la logique pour vérifier si l'utilisateur est authentifié ici
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
