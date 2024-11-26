import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';
import MyPet from './components/MyPet';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLogged(true);
    }
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    setIsLogged(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/profile');
  };

  return (
    <div className='content'>
      <Navbar isLogged={isLogged} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={isLogged ? <Profile isLogged={isLogged} /> : <AuthPage setIsLogged={setIsLogged} />} />
        <Route path="/my-pets" element={isLogged ? <MyPet /> : <AuthPage setIsLogged={setIsLogged} />} />
      </Routes>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);