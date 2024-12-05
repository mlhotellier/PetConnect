import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import '../styles/styles.css';
import MyPet from '../components/MyPet';
import Calendar from '../components/Calendar';
import Contact from '../components/Contact';
import WeightChart from '../components/WeightChart';
import HistoriqueMedical from '../components/HistoriqueMedical';
import PetFood from '../components/PetFood';

function Profile() {
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login'; // Rediriger si le token est manquant
    }
  }, []);

  const fetchPets = async () => {
    const token = localStorage.getItem('authToken');
    setLoadingPets(true);
    try {
      const data = await apiRequest('GET', `/api/pets`, null, token);
      setPets(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des animaux:', error);
    } finally {
      setLoadingPets(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const addPet = async (petData) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour ajouter un animal.');
      return;
    }

    try {
      const newPet = await apiRequest('POST', `/api/pets/add`, petData, token);
      setPets([...pets, newPet]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'animal:', error);
    }
  };

  const updatePet = async (petId, petData) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour mettre à jour un animal.');
      return;
    }

    try {
      const updatedPet = await apiRequest('PUT', `/api/pets/update/${petId}`, petData, token);
      setPets(pets.map(pet => (pet._id === petId ? updatedPet : pet)));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'animal:', error);
    }
  };

  const deletePet = async (petId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour supprimer un animal.');
      return;
    }

    try {
      await apiRequest('DELETE', `/api/pets/remove/${petId}`, null, token);
      setPets(pets.filter(pet => pet._id !== petId));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'animal:', error);
    }
  };

  const addWeightData = async (weightData) => {
    const { petId, date, weight } = weightData;
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour ajouter/modifier le poids.');
      return;
    }

    try {
      const updatedPet = await apiRequest('PUT', `/api/pets/add-weight/${petId}`, { date, weight }, token);
      setPets(pets.map(pet => (pet._id === petId ? updatedPet : pet)));
    } catch (error) {
      console.error('Erreur lors de l\'ajout/modification du poids:', error);
    }
  };

  return (
    <div style={{ marginRight: '15px' }}>
      <div className="profile">
        <Contact />
        <Calendar />
      </div>
      <div className="profile">
        <MyPet
            pets={pets}
            loadingPets={loadingPets}
            fetchPets={fetchPets}
            addPet={addPet}
            updatePet={updatePet}
            deletePet={deletePet}
        />
        <WeightChart 
          pets={pets} 
          loadingPets={loadingPets}
          addWeightData={addWeightData}
        />
      </div>
      <div className="profile">
        <HistoriqueMedical />
        <PetFood />
      </div>
    </div>
  );
}

export default Profile;