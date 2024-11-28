import React, { useState } from 'react';
import axios from 'axios';

const AuthPage = ({ setIsLogged }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = isSignUp
      ? `${process.env.REACT_APP_SERVER_BACKEND_URL}/api/auth/register`
      : `${process.env.REACT_APP_SERVER_BACKEND_URL}/api/auth/login`;

    try {
      const response = await axios.post(url, { email, password });
      const token = response.data.token;
      const userId = response.data.userId;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);

      setIsLogged(true);
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Erreur serveur');
      console.error('Erreur:', error.response ? error.response.data.message : 'Erreur serveur');
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
      <h1>{isSignUp ? 'Créer un compte' : 'Se connecter'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Mot de passe"
        />
        <button type="submit">{isSignUp ? 'Créer un compte' : 'Se connecter'}</button>
      </form>

      {error && <p>{error}</p>}

      <button onClick={toggleForm}>
        {isSignUp ? 'Se connecter' : 'Créer un compte'}
      </button>
    </div>
  );
};

export default AuthPage;