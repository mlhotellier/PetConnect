import React from 'react';
import '../styles/styles.css';

function HomePage() {
  return (
    <div className="container home-section">
        <h1>Bienvenue sur <span style={{color:'#ffb300'}}>MyPetDiary</span> ! 👋</h1>
        <h2>Retrouvez toutes les informations et le suivi de vos animaux dans un seul endroit</h2>
    </div>
  );
}

export default HomePage;