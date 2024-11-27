import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';
import MyPet from './components/MyPet';

// Wrapper pour permettre l'utilisation de `useNavigate`
const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation
  const [isLogged, setIsLogged] = useState(false); // État pour gérer l'authentification

  // Vérification de l'état d'authentification lors du chargement de l'application
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLogged(!!token); // Si un token est présent, l'utilisateur est connecté
  }, []);

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    setIsLogged(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/profile'); // Rediriger vers la page de profil
  };

  return (
    <div className="content">
      <Navbar isLogged={isLogged} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/profile"
          element={isLogged ? <Profile /> : <AuthPage setIsLogged={setIsLogged} />}
        />
        <Route
          path="/my-pets"
          element={isLogged ? <MyPet /> : <AuthPage setIsLogged={setIsLogged} />}
        />
      </Routes>
    </div>
  );
};

// Rendu de l'application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);