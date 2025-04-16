import React from 'react';
import '../styles/blog.css';

function Blog() {
  return (
    <div className='blog'>
      <section className="hero">
        <h1>Blog 📰</h1>
        <h2>Retrouvez nos conseils et astuces pour le bien-être et l'éducation de vos animaux !</h2>
        
        <div className="article-container w-100">
          {/* Première carte */}
          <div className="article-card w-33">
            <img src="https://via.placeholder.com/150" alt="Article 1" className="article-card-image" />
            <div className="article-card-content">
              <h3>5 astuces pour améliorer le bien-être de votre chat</h3>
              <p>Découvrez comment enrichir l'environnement de votre chat pour le rendre plus heureux.</p>
              <button className="article-read-more">Lire plus</button>
            </div>
          </div>

          {/* Deuxième carte */}
          <div className="article-card w-33">
            <img src="https://via.placeholder.com/150" alt="Article 2" className="article-card-image" />
            <div className="article-card-content">
              <h3>Les 3 erreurs courantes en éducation canine</h3>
              <p>Évitez ces pièges fréquents pour renforcer votre lien avec votre chien.</p>
              <button className="article-read-more">Lire plus</button>
            </div>
          </div>

          {/* Troisième carte */}
          <div className="article-card w-33">
            <img src="https://via.placeholder.com/150" alt="Article 3" className="article-card-image" />
            <div className="article-card-content">
              <h3>Quels jouets choisir pour vos rongeurs ?</h3>
              <p>Des idées de jouets pour stimuler l'activité de vos petits compagnons.</p>
              <button className="article-read-more">Lire plus</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Blog;