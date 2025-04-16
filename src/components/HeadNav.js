import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../assets/logo.png'

const HeadNav = ({ isLogged, onLogout }) => {
  return (
    <nav className='head-nav'>
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
          <Link to="/tarifs">Tarifs</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link className='account-btn' to="/profile">{isLogged ? 'Mon compte' : 'Se connecter'}</Link>
        </li>
      </ul>
    </nav>
  );
};

export default HeadNav;

