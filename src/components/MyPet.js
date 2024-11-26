import React, { useState, useEffect } from 'react';
import '../styles/styles.css';
import '../styles/utils.css';
import axios from 'axios';

const serverUrl = 'http://localhost:5000/uploads/pets/optimized/'

const MyPet = () => {
  const [pets, setPets] = useState([]); // Pour stocker les animaux récupérés depuis l'API
  const [showForm, setShowForm] = useState(false); // État pour afficher/masquer le formulaire
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [type, setType] = useState('');
  const [color, setColor] = useState('');
  const [image, setImage] = useState(null); // Stocke le fichier image sélectionné
  const [weight, setWeight] = useState('');
  const [currentPetId, setCurrentPetId] = useState(null); // ID de l'animal actuellement en modification

  // Calculer l'âge de l'animal en années et mois
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0) {
      years--;
      months += 12; // Ajoute les mois pour rendre l'âge positif
    }

    return { years, months };
  };

  // Récupérer les animaux depuis l'API
  useEffect(() => {
    axios.get('http://localhost:5000/api/pets')
      .then(response => {
        setPets(response.data); // Mettre à jour le state avec les animaux
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des animaux:', error);
      });
  }, []); // Le tableau vide signifie que cela sera exécuté qu'une seule fois (lors du montage du composant)

  // Fonction pour supprimer un animal
  const handleDeletePet = async (petId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/pets/remove/${petId}`);
      console.log('Animal supprimé:', response.data);

      // Mettre à jour la liste des animaux après suppression
      setPets(pets.filter(pet => pet._id !== petId));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'animal:', error);
    }
  };

  // Fonction pour remplir le formulaire avec les données existantes d'un animal
  const handleEditPet = (pet) => {
    console.log('Editing pet:', pet);  // Ajoutez ce log pour voir les données de l'animal
    setName(pet.name);
    setBirthDate(new Date(pet.birthDate).toISOString().split('T')[0]); // Convertir la date au format YYYY-MM-DD
    setType(pet.type);
    setColor(pet.color);
    setImage(null); // Réinitialiser l'image sélectionnée
    setWeight(pet.data[0]?.weight || '');
    setCurrentPetId(pet._id); // Set the current pet ID
    setShowForm(true); // Show the form to edit
  };
  
  

  // Fonction pour mettre à jour un animal
  const handleUpdatePet = async (event) => {
    event.preventDefault();
    console.log('Updating pet with ID:', currentPetId);  // Vérifiez si l'ID est bien passé
    const petData = new FormData();
    petData.append('name', name);
    petData.append('birthDate', birthDate);
    petData.append('type', type);
    petData.append('color', color);
    petData.append('weight', weight);
    if (image) petData.append('image', image); // Ajouter l'image au FormData
  
    try {
      const response = await axios.put(`http://localhost:5000/api/pets/update/${currentPetId}`, petData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Type de contenu pour l'upload d'image
        },
      });
      console.log('Updated pet:', response.data);  // Ajoutez ce log pour vérifier la réponse du backend
  
      // Mettre à jour la liste des animaux dans le state
      setPets(pets.map(pet => (pet._id === currentPetId ? response.data : pet)));
  
      // Réinitialiser le formulaire après la mise à jour
      setName('');
      setBirthDate('');
      setType('');
      setColor('');
      setImage(null);
      setWeight('');
      setCurrentPetId(null);
      setShowForm(false); // Fermer la modale après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'animal:', error);
    }
  };  

  // Fonction pour basculer l'affichage du formulaire
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Fonction pour ajouter un animal avec image
  const handleAddPet = async (event) => {
    event.preventDefault();

    const userId = localStorage.getItem('userId'); // Récupérer l'ID de l'utilisateur depuis le localStorage

    if (!userId) {
      alert('Utilisateur non connecté');
      return;
    }

    const petData = new FormData();
    petData.append('name', name);
    petData.append('birthDate', birthDate);
    petData.append('type', type);
    petData.append('color', color);
    petData.append('weight', weight);
    petData.append('userId', userId);
    if (image) petData.append('image', image); // Ajouter l'image au FormData

    try {
      const response = await axios.post('http://localhost:5000/api/pets/add', petData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Type de contenu pour l'upload d'image
        },
      });

      console.log('Animal ajouté:', response.data);
      setPets(prevPets => [...prevPets, response.data]);

      // Réinitialiser le formulaire après l'ajout
      setName('');
      setBirthDate('');
      setType('');
      setColor('');
      setWeight('');
      setImage(null);
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'animal:', error);
    }
  };

  return (
    <div className="section w-33">
      <div className="section-title">
        <h2>🐱 Mes animaux</h2>
        <button className="add-btn" onClick={toggleForm}>+</button>
      </div>

      {/* Affichage des animaux */}
      {pets.length > 0 ? (
        pets.map(pet => {
          const { years, months } = calculateAge(pet.birthDate); // Calcul de l'âge en années et mois
          const lastWeight = pet.data.length > 0 ? pet.data.length - 1 : 0; // Récupérer le dernier poids
          return (
            <div key={pet._id} className="pet-card">
              <div className="pet-image">
                <img src={`${serverUrl}${pet.image}`} alt={pet.name} className="pet-photo" />
              </div>
              <div className="pet-info">
                <h2 className="pet-name">{pet.name}</h2>
                <p><strong>Type:</strong> {pet.type}</p>
                <p><strong>Couleur:</strong> {pet.color}</p>
                <p><strong>Poids actuel:</strong> {pet.data[lastWeight].weight} kg</p>
                <p><strong>Age:</strong> {years} an{years !== 1 ? 's' : ''} et {months} mois</p>
                <button onClick={() => handleDeletePet(pet._id)}>Supprimer</button>
                <button onClick={() => handleEditPet(pet)}>Modifier</button>
              </div>
            </div>
          );
        })
      ) : (
        <p>Aucun animal trouvé. Ajoutez-en un !</p>
      )}

      {/* Modale pour ajouter ou modifier un animal */}
      {showForm && (
        <div className="modal-overlay" onClick={toggleForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{currentPetId ? 'Modifier un animal' : 'Ajouter un animal'}</h3>
            <form onSubmit={currentPetId ? handleUpdatePet : handleAddPet}>
              <div className="form-group">
                <label>Nom:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date de naissance:</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type:</label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Couleur:</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image (Télécharger une image):</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                {/* Affiche l'image actuelle si aucune nouvelle image n'est sélectionnée */}
                {!image && currentPetId && (
                  <div className="current-image-preview">
                    <p>Image actuelle :</p>
                    <img src={`${serverUrl}${pets.find(pet => pet._id === currentPetId)?.image}`} alt="actuelle" className="current-image" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Poids:</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
              <button type="submit">{currentPetId ? 'Mettre à jour l\'animal' : 'Ajouter l\'animal'}</button>
            </form>
            <button onClick={toggleForm} className="cancel-btn">Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPet;