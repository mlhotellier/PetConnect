import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import HeadNav from './components/HeadNav';
import HomePage from './pages/HomePage';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Tarifs from './pages/Tarifs';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';

// Wrapper pour permettre l'utilisation de `useNavigate`
const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [redirectPath, setRedirectPath] = useState('/'); // Chemin à rediriger après connexion

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLogged(!!token);
  }, []);

  const handleLogout = () => {
    setIsLogged(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/'); // Redirection vers l'accueil après déconnexion
  };

  return (
    <div className={isLogged ? "content" : ""}>
      {isLogged ? <Navbar isLogged={isLogged} onLogout={handleLogout} /> : <HeadNav />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/tarifs" element={<Tarifs />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/profile"
          element={
            isLogged ? (
              <Profile />
            ) : (
              <AuthPage setIsLogged={setIsLogged} redirectPath={redirectPath} />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;

// Rendu de l'application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);