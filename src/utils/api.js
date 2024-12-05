import axios from 'axios';

// Fonction générique pour les requêtes API
export const apiRequest = async (method, url, data = null, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    };
    const response = await axios({ 
      method, 
      url: `${process.env.REACT_APP_SERVER_BACKEND_URL}${url}`,
      data, 
      ...config 
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la requête API:', error);
    throw error; // On laisse l'erreur se propager
  }
};