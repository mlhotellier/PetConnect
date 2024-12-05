import React, { useState } from 'react';
import '../styles/contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simuler un envoi de formulaire (à remplacer par une logique d'envoi réelle)
    alert("Formulaire envoyé !");
  };

  return (
    <div style={{ marginRight: '15px' }}>
      <h1>Nous contacter ! 👋</h1>
      <p>
        Vous souhaitez en savoir plus ? Vous avez un problème ? N'hésitez pas à nous contacter,
        notre équipe vous répondra dans les plus brefs délais.
      </p>

      {/* Formulaire de contact */}
      <form onSubmit={handleSubmit} className="contact-card-form">
        <div className="form-group">
          <label htmlFor="name">Nom :</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Entrez votre nom"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Entrez votre email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Sujet :</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Entrez le sujet"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message :</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Votre message"
          />
        </div>

        <button type="submit" className="submit-button">Envoyer</button>
      </form>
    </div>
  );
}

export default Contact;
