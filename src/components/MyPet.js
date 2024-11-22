import React from 'react';
import '../styles/styles.css';
import petsData from '../assets/petsData.js'

const MyPet = () => {
  return (
    <div className='section w-33'>
      <h2>🐱 Mes animaux</h2>
      {petsData.map(pet => (
        <div key={pet.id} className="pet-card">
          <div className="pet-image">
            <img src={pet.image} alt={pet.name} className="pet-photo" />
          </div>
          <div className="pet-info">
            <h2 className="pet-name">{pet.name}</h2>
            <p><strong>Type:</strong> {pet.type}</p>
            <p><strong>Color:</strong> {pet.color}</p>
            <p><strong>Age:</strong> {pet.age}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPet;
