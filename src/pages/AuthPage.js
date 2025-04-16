import React, { useState } from 'react';
import axios from 'axios';
import '../styles/auth-page.css'

const AuthPage = ({ setIsLogged }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const url = isSignUp
      ? `${process.env.REACT_APP_SERVER_BACKEND_URL}/api/auth/register`
      : `${process.env.REACT_APP_SERVER_BACKEND_URL}/api/auth/login`;

    try {
      const { data } = await axios.post(url, { email, password });
      const { token, userId } = data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);

      setIsLogged(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur serveur. Veuillez réessayer plus tard.';
      setError(errorMessage);
      console.error('Erreur:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className="auth-page">
      <h1 className="auth-title">{isSignUp ? 'Créer un compte' : 'Se connecter'}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Mot de passe"
            className="form-input"
          />
        </div>
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Chargement...' : isSignUp ? 'Créer un compte' : 'Se connecter'}
        </button>
      </form>

      {error && <p className="auth-error">{error}</p>}

      <button className="auth-toggle-button" onClick={toggleForm}>
        {isSignUp ? 'Vous avez dejà un compte ? Se connecter' : 'Vous n\'avez pas encore de compte ? Créer un compte'}
      </button>
    </div>
  );
};

export default AuthPage;
