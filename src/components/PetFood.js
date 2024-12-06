import React from 'react';
import '../styles/styles.css';
import '../styles/utils.css';
// import petsData from '../assets/petsData';

const PetFood = () => {
  return (
    <div className='section w-50'>
      <div className='section-title'>
        <h2>🦴 Nourriture</h2>
        {/* <button className='add-btn'>+</button> */}
      </div>
       <div className='food-card'>
          <p style={{padding: "10px 14px"}}>En cours de développement...</p>
        {/*<p>SPECIFIC - Adult</p>
        <p>{petsData[0].name}</p>
        <p>Portion : 65g / jour</p>
        <p>SPECIFIC - Adult</p>
        <p>{petsData[1].name}</p>
        <p>Portion : 60g / jour</p>*/}
      </div> 
    </div>
  );
};

export default PetFood;
