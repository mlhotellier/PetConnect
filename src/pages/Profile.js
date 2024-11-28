import React, { useEffect, useState } from 'react';
import '../styles/styles.css';
import MyPet from '../components/MyPet';
import Calendar from '../components/Calendar';
import Contact from '../components/Contact';
import WeightChart from '../components/WeightChart';
import HistoriqueMedical from '../components/HistoriqueMedical';
import PetFood from '../components/PetFood';
import axios from 'axios';

function Profile() {
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login'; // Rediriger si le token est manquant
    }
  }, []);

  // Récupérer les animaux depuis l'API
  const fetchPets = async () => {
      const token = localStorage.getItem('authToken');
      setLoadingPets(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_BACKEND_URL}/api/pets`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setPets(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des animaux:', error);
      } finally {
        setLoadingPets(false);
      }
    };
  useEffect(() => {
    fetchPets();
  }, []);

  // Ajouter un animal
  const addPet = async (petData) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('Vous devez être connecté pour ajouter un animal.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_BACKEND_URL}/api/pets/add`, petData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log(response.data)
      setPets([...pets, response.data]); // Ajouter le nouvel animal à la liste
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'animal:', error);
    }
  };  

  // Mettre à jour un animal
  const updatePet = async (petId, petData) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('Vous devez être connecté pour ajouter un animal.');
      return;
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_SERVER_BACKEND_URL}/api/pets/update/${petId}`, petData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setPets(pets.map(pet => (pet._id === petId ? response.data : pet))); // Mettre à jour l'animal
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'animal:', error);
    }
  };

  // Supprimer un animal
  const deletePet = async (petId) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('Vous devez être connecté pour ajouter un animal.');
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_BACKEND_URL}/api/pets/remove/${petId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
    });
      setPets(pets.filter(pet => pet._id !== petId)); // Retirer l'animal supprimé
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'animal:', error);
    }
  };

  // Ajouter un poids pour un animal
  const addWeightData = async (weightData) => {
    const { petId, date, weight } = weightData;
    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('Vous devez être connecté pour modifier un animal.');
      return;
    }
  
    try {
      // Vérification que la date est supérieure à la date de naissance
      const pet = pets.find(pet => pet._id === petId);
      const birthDate = new Date(pet.birthDate); // Date de naissance de l'animal
      const selectedDate = new Date(date); // Date sélectionnée pour le poids
  
      // Si la date sélectionnée est avant la date de naissance, ne pas permettre l'ajout
      if (selectedDate <= birthDate) {
        alert("La date sélectionnée doit être après la date de naissance de l'animal.");
        return;
      }
  
      // Si la date est valide, envoyer la requête au backend
      const response = await axios.put(`${process.env.REACT_APP_SERVER_BACKEND_URL}/api/pets/add-weight/${petId}`, {
        date,
        weight,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      // Mettre à jour les données de l'animal dans l'état
      setPets(pets.map(pet => (pet._id === petId ? response.data : pet)));
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