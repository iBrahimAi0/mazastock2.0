import axios from 'axios';
import axiosRetry from 'axios-retry';

// Configuration globale d'axios avec axios-retry
axiosRetry(axios, {
  retries: 3, // Nombre de nouvelles tentatives
  retryDelay: axiosRetry.exponentialDelay, // Délai d'attente exponentiel entre les tentatives
  shouldResetTimeout: true, // Réinitialise le timeout sur chaque nouvelle tentative
  retryCondition: (error) => error.response && error.response.status === 429 // Réessaie uniquement en cas de code 429
});
