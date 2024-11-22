import React from 'react';
import '../styles/styles.css';
import '../styles/utils.css';

const HistoriqueMedical = () => {
  return (
    <div className='section w-50'>
      <div className='section-title'>
        <h2>📁 Historique Médical</h2>
        <button className='add-btn'>+</button>
      </div>
      <div className='documents-card'>
        <p>Vous n'avez aucun document.</p>
      </div>
    </div>
  );
};

export default HistoriqueMedical;
