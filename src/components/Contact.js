import React from 'react';
import '../styles/styles.css';
import '../styles/utils.css';

const contactInfos = [
  {
    name: 'Dr. TELLIER Marie',
    numero: '+262689809876',
    adresse: '139, Allée du Piton, Le Tampon',
    email: 'm.tellier@vetmail.com',
  },
  {
    name: 'Dr. COTTARD Louise',
    numero: '+33701020304',
    adresse: '45, Place des Limousine, Bosc-Bordel',
    email: 'l.cottard@vetmail.com',
  },
];

const Contact = () => {
  return (
    <div className="section w-33">
      <div className='section-title'>
        <h2>📇 Contact</h2>
        <button className='add-btn'>+</button>
      </div>
      {contactInfos.map((contact, index) => (
        <div className="contact-card" key={index}>
          <div className="contact-info">
            <h2 className="contact-name">🩺 {contact.name}</h2>
            <p><strong>📱</strong> {contact.numero}</p>
            <p><strong>📍</strong> {contact.adresse}</p>
            <p><strong>✉️</strong> {contact.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Contact;