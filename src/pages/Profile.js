import React, { useEffect, useState } from 'react';
import '../styles/styles.css';
import MyPet from '../components/MyPet';
import Calendar from '../components/Calendar';
import Contact from '../components/Contact';
import User from '../components/User';
import WeightChart from '../components/WeightChart';
import HistoriqueMedical from '../components/HistoriqueMedical';
import PetFood from '../components/PetFood';
import axios from 'axios';

const serverUrl = 'http://localhost:5000'

function Profile() {
  const [user, setUser] = useState(null); // Données utilisateur
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);

  // Récupérer le profil utilisateur
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios
        .get(`${serverUrl}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUser(response.data))
        .catch((error) => console.error('Erreur lors de la récupération du profil', error));
    }
  }, []);

  // Récupérer les animaux depuis l'API
  const fetchPets = async () => {
      setLoadingPets(true);
      try {
        const response = await axios.get('http://localhost:5000/api/pets');
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
    try {
      const response = await axios.post('http://localhost:5000/api/pets/add', petData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPets([...pets, response.data]); // Ajouter le nouvel animal à la liste
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'animal:', error);
    }
  };  

  // Mettre à jour un animal
  const updatePet = async (petId, petData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/pets/update/${petId}`, petData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPets(pets.map(pet => (pet._id === petId ? response.data : pet))); // Mettre à jour l'animal
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'animal:', error);
    }
  };

  // Supprimer un animal
  const deletePet = async (petId) => {
    try {
      await axios.delete(`http://localhost:5000/api/pets/remove/${petId}`);
      setPets(pets.filter(pet => pet._id !== petId)); // Retirer l'animal supprimé
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'animal:', error);
    }
  };

  return (
    <div style={{ marginRight: '15px' }}>
      <div className="profile">
        <User user={user} />
      </div>
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
        <WeightChart pets={pets} loadingPets={loadingPets} />
      </div>
      <div className="profile">
        <HistoriqueMedical />
        <PetFood />
      </div>
    </div>
  );
}

export default Profile;