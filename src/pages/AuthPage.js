import React, { useState } from 'react';
import axios from 'axios';
const serverUrl = process.env.SERVER_URL

const AuthPage = ({ setIsLogged }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // État pour basculer entre l'inscription et la connexion
  const [error, setError] = useState(''); // Nouvel état pour gérer les messages d'erreur

  // Fonction pour soumettre le formulaire d'inscription ou de connexion
  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = isSignUp
      ? `${serverUrl}/api/auth/register` // Route d'inscription
      : `${serverUrl}/api/auth/login`; // Route de connexion

    try {
      const response = await axios.post(url, { email, password });
      console.log(response.data)
      const token = response.data.token;
      const userId = response.data.userId;
      // Enregistrez le token dans localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);


      // Modifiez l'état pour marquer l'utilisateur comme connecté
      setIsLogged(true);

    } catch (error) {
      // Si une erreur se produit, affichez un message d'erreur
      setError(error.response ? error.response.data.message : 'Erreur serveur');
      console.error('Erreur:', error.response ? error.response.data.message : 'Erreur serveur');
    }
  };

  // Fonction pour basculer entre les formulaires
  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setEmail('');
    setPassword('');
    setError(''); // Réinitialiser l'erreur lors du basculement
  };

  return (
    <div className="auth-page">
      <h1 className="title">{isSignUp ? 'Créer un compte' : 'Se connecter'}</h1>
      <form onSubmit={handleSubmit} className="log-form">
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Mot de passe"
            className="form-control"
          />
        </div>
        <button type="submit" className="submit-btn">
          {isSignUp ? 'Créer un compte' : 'Se connecter'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>} {/* Affichage de l'erreur */}

      <div>
        <p>
          {isSignUp
            ? 'Vous avez déjà un compte ?'
            : "Vous n'avez pas de compte ?"}
          <button onClick={toggleForm} className="toggle-form-btn">
            {isSignUp ? 'Se connecter' : 'Créer un compte'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
