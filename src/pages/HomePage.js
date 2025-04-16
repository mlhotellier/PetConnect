import React from 'react';
import '../styles/homepage.css';
import { Link } from 'react-router-dom';
import historic from '../assets/icons/historic.png';
import rappel from '../assets/icons/rappel.png';
import loupe from '../assets/icons/loupe.png';

function HomePage() {
  return (
    <div className="homepage">
      <section className="hero">
        <h1>
          Bienvenue sur <span style={{ color: '#f14a84' }}>PetConnect</span> ! 👋
        </h1>
        <h2>
          Retrouvez toutes les informations et le suivi de vos animaux dans un seul endroit.
        </h2>
      </section>

      <section className="features">
        <h2>Pourquoi choisir PetConnect ?</h2>
        <div className="features-container">
          <div className="feature-card">
            <img
              src={loupe}
              alt="Suivi de santé"
              className="feature-image"
            />
            <h3>Suivi de santé</h3>
            <p>
              Gardez une trace des vaccins, rendez-vous chez le vétérinaire et traitements pour
              chacun de vos animaux.
            </p>
          </div>
          <div className="feature-card">
            <img
              src={historic}
              alt="Historique des activités"
              className="feature-image"
            />
            <h3>Historique des activités</h3>
            <p>
              Enregistrez les promenades, les jeux, ou tout événement marquant dans la vie de vos
              compagnons.
            </p>
          </div>
          <div className="feature-card">
            <img
              src={rappel}
              alt="Rappels importants"
              className="feature-image"
            />
            <h3>Rappels importants</h3>
            <p>
              Configurez des rappels pour ne jamais manquer un rendez-vous ou un soin essentiel.
            </p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>Ce que disent nos utilisateurs</h2>
        <div className="testimonials-container">
          <blockquote>
            "Grâce à PetConnet, je n'oublie plus aucun vaccin pour mes chiens. C'est super pratique
            et simple à utiliser !" – <strong>Marie</strong>
          </blockquote>
          <blockquote>
            "Je peux enfin suivre les activités de mes chats et avoir une vue complète sur leur
            santé. Merci PetConnect !" – <strong>Thomas</strong>
          </blockquote>
        </div>
      </section>

      <section className="cta">
        <h2>Rejoignez PetConnect dès aujourd'hui</h2>
        <p className='cta-text'>
          Simplifiez la gestion de vos animaux et profitez d'une expérience fluide pour tout suivre
          au même endroit.
        </p>
        <Link to="/tarifs"><button className="cta-button">Créer un compte</button></Link>
      </section>
    </div>
  );
}

export default HomePage;