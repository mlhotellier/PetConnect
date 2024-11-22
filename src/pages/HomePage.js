import React from 'react';
import '../styles/homepage.css';

function HomePage() {
  return (
    <div style={{marginRight:'15px'}} className="homepage">
      {/* Section d'accueil */}
      <section className="hero">
        <h1>
          Bienvenue sur <span style={{ color: '#f14a84' }}>MyPetDiary</span> ! 👋
        </h1>
        <h2>
          Retrouvez toutes les informations et le suivi de vos animaux dans un seul endroit.
        </h2>
      </section>

      {/* Section sur les fonctionnalités */}
      <section className="features">
        <h2>Pourquoi choisir MyPetDiary ?</h2>
        <div className="features-container">
          <div className="feature-card">
            <img
              src="https://via.placeholder.com/150"
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
              src="https://via.placeholder.com/150"
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
              src="https://via.placeholder.com/150"
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

      {/* Section sur les témoignages */}
      <section className="testimonials">
        <h2>Ce que disent nos utilisateurs</h2>
        <div className="testimonials-container">
          <blockquote>
            "Grâce à MyPetDiary, je n'oublie plus aucun vaccin pour mes chiens. C'est super pratique
            et simple à utiliser !" – <strong>Marie</strong>
          </blockquote>
          <blockquote>
            "Je peux enfin suivre les activités de mes chats et avoir une vue complète sur leur
            santé. Merci MyPetDiary !" – <strong>Thomas</strong>
          </blockquote>
        </div>
      </section>

      {/* Section Appel à l'action */}
      <section className="cta">
        <h2>Rejoignez MyPetDiary dès aujourd'hui</h2>
        <p>
          Simplifiez la gestion de vos animaux et profitez d'une expérience fluide pour tout suivre
          au même endroit.
        </p>
        <button className="cta-button">Créer un compte</button>
      </section>
    </div>
  );
}

export default HomePage;