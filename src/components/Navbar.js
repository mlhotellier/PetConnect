import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../assets/logo.png'

const Navbar = ({ isLogged, onLogout }) => {
  return (
    <nav className="navbar-vertical">
      <div className='logo-container'>
        <img src={logo} alt="logo" className='logo'/>
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/tarifs">Tarifs</Link>
        </li>
        <li>
          <Link to="/profile">{isLogged ? 'Mon compte' : 'Se connecter'}</Link>
        </li>
        {isLogged ? 
          <button style={{margin:'10px 22px',fontSize:'18px',backgroundColor:'transparent',padding:0, color:'red'}} onClick={onLogout}>
            Déconnexion
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

