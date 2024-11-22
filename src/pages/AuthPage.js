import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

const AuthPage = ({ setIsLogged }) => {
  const [isSignUp, setIsSignUp] = useState(false); // État pour basculer entre Sign Up et Sign In
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSignUp) {
      // Logique pour l'inscription
      alert('Compte créé avec succès !');
    } else {
      // Logique pour la connexion
      setIsLogged(true); // Simuler la connexion
      alert('Connexion réussie !');
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp); // Bascule entre Sign Up et Sign In
  };

  return (
    <div className="container auth-page" style={{ marginRight: '15px' }}>
      <h1>{isSignUp ? 'Créer un compte' : 'Se connecter'}</h1>

      {/* Formulaire de connexion ou inscription */}
      <form onSubmit={handleSubmit} className="log-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">{isSignUp ? 'S\'inscrire' : 'Se connecter'}</button>
      </form>

      {/* Lien pour basculer entre les deux formulaires */}
      <p>
        {isSignUp ? (
          <>
            Déjà un compte ? <Link to="#" onClick={toggleForm}>Se connecter</Link>
          </>
        ) : (
          <>
            Pas encore de compte ? <Link to="#" onClick={toggleForm}>Créer un compte</Link>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthPage;