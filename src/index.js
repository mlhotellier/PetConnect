import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';

const App = () => {
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
        <Route path="/profile" element={isLogged ? <Profile /> : <AuthPage setIsLogged={setIsLogged} />} />
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