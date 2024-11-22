import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';

const App = () => {
  // Log easily set isLogged to true
  const [isLogged, setIsLogged] = useState(true);

  const handleLogout = () => {
    setIsLogged(false);
  };

  return (
    <div className='content'>
    <Router>
      <Navbar isLogged={isLogged} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={isLogged ? <Profile isLogged={isLogged} /> : <AuthPage setIsLogged={setIsLogged} />} />
      </Routes>
    </Router>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);