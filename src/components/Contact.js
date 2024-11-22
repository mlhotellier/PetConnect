import React from 'react';
import '../styles/styles.css';

const contactInfos = [
  {
    name: 'Dr. TELLIER Marie',
    numero: '+26278980987',
    adresse: '139, Allée du Piton, Le Tampon',
    email: 'clinique@vetmail.com',
  },
  {
    name: 'Dr. COTTARD Louise',
    numero: '+26211223344',
    adresse: '45, Boulevard des Plages, Saint-Paul',
    email: 'cotcotvet@vetmail.com',
  },
];

const Contact = () => {
  return (
    <div className="section w-33">
      <h2>📇 Contact</h2>
      {/* <div style={{height:'345px',overflowY:'scroll',  borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',padding:'0 10px',backgroundColor:'#f9f9f9'}}> */}
      {contactInfos.map((contact, index) => (
        <div className="contact-card" key={index}>
          <div className="contact-info">
            <h2 className="contact-name">🩺 {contact.name}</h2>
            <p><strong>Tél. :</strong> {contact.numero}</p>
            <p><strong>Adresse :</strong> {contact.adresse}</p>
            <p><strong>Mail :</strong> {contact.email}</p>
          </div>
        </div>
      ))}
      {/* </div> */}
    </div>
  );
};

export default Contact;