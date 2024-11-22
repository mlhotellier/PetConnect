import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

const Navbar = ({ isLogged, onLogout }) => {
  return (
    <nav className="navbar-vertical">
      <ul>
        <li>
          <Link to="/">Accueil</Link>
        </li>
        <li>
          <Link to="/profile">{isLogged ? 'Mon compte' : 'Connexion'}</Link>
        </li>
        {isLogged ? 
          <button onClick={onLogout}>
            Logout
          </button>
        :
          null
        }
        {/* Ajoutez d'autres liens ici */}
      </ul>
    </nav>
  );
};

export default Navbar;

