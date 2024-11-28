import React, { useState } from 'react';
import '../styles/styles.css';
import '../styles/utils.css';

const imgRepository = `${process.env.REACT_APP_SERVER_BACKEND_URL}/uploads/pets/optimized/`;

const MyPet = ({ pets, loadingPets, addPet, deletePet, updatePet }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    type: '',
    color: '',
    weight: '',
    image: null,
  });
  const [currentPetId, setCurrentPetId] = useState(null);

  // Fonction pour calculer l'âge du chat en années et mois
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0) {
      years--;
      months += 12; // Ajuster les mois si négatifs
    }

    return { years, months };
  };

  // Basculer l'affichage du formulaire
  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({
      name: '',
      birthDate: '',
      type: '',
      color: '',
      weight: '',
      image: null,
    });
    setCurrentPetId(null);
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value, // Si c'est un fichier, le stocker correctement
    }));
  };

  // Soumettre le formulaire pour ajouter un animal
  const handleAdd = (e) => {
    e.preventDefault();
    const { name, birthDate, type, color, weight, image } = formData;

    const petData = new FormData();
    petData.append('name', name);
    petData.append('birthDate', birthDate);
    petData.append('type', type);
    petData.append('color', color);
    petData.append('weight', weight);
    petData.append('userId', localStorage.getItem('userId'));
    
    // Vérification si l'image existe avant de l'ajouter
    if (image) {
      petData.append('image', image);
    }
    
    addPet(petData);
    toggleForm(); // Fermer le formulaire après soumission
  };

  // Soumettre le formulaire pour modifier un animal
  const handleEdit = (e) => {
    e.preventDefault();
    const { name, birthDate, type, color, weight, image } = formData;

    const petData = new FormData();
    petData.append('name', name);
    petData.append('birthDate', birthDate);
    petData.append('type', type);
    petData.append('color', color);
    petData.append('weight', weight);
    petData.append('userId', localStorage.getItem('userId'));
    if (image) petData.append('image', image);

    updatePet(currentPetId, petData); // Mise à jour de l'animal avec l'ID actuel
    toggleForm(); // Fermer le formulaire après soumission
  };

  // Supprimer un animal
  const handleDelete = (petId) => {
    deletePet(petId);
  };

  // Afficher le formulaire de modification
  const handleEditForm = (pet) => {  
    setCurrentPetId(pet._id);
    setFormData({
      name: pet.name,
      birthDate: new Date(pet.birthDate).toISOString().split('T')[0], // Format YYYY-MM-DD
      type: pet.type,
      color: pet.color,
      weight: pet.data[pet.data.length - 1]?.weight || '', // Dernier poids enregistré
      image: null, // Réinitialiser l'image
    });
    setShowForm(true);
  };

  return (
    <div className="section w-33">
      <div className="section-title">
        <h2>🐱 Mes animaux</h2>
        <button className="add-btn" onClick={toggleForm}>+</button>
      </div>

      {/* Affichage des animaux */}
      {loadingPets ? (
        <p>Chargement...</p>
      ) : (
        pets.length > 0 ? (
          pets.map((pet) => {
            const lastWeight = pet.data[pet.data.length - 1]?.weight || 'N/A'; // Dernier poids ou N/A
            const { years, months } = calculateAge(pet.birthDate); // Calculer l'âge
            return (
              <div key={pet._id} className="pet-card">
              <div className="pet-image">
                <img src={`${imgRepository}${pet.image}`} alt={pet.name} className="pet-photo" />
              </div>
              <div className="pet-info">
                <h2 className="pet-name">{pet.name}</h2>
                <p><strong>Type:</strong> {pet.type}</p>
                <p><strong>Couleur:</strong> {pet.color}</p>
                <p><strong>Poids actuel:</strong> {lastWeight} kg</p>
                <p><strong>Âge:</strong> {years} an{years !== 1 ? 's' : ''} et {months} mois</p>
                <button onClick={() => handleEditForm(pet)}>Modifier</button>
                <button onClick={() => handleDelete(pet._id)}>Supprimer</button>
              </div>
            </div>
            );
          })
        ) : (
          <p>Aucun animal trouvé. Ajoutez-en un !</p>
        )
      )}

      {/* Formulaire d'ajout d'un animal */}
      {showForm && !currentPetId && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h3>Ajouter un animal</h3>
            <form onSubmit={handleAdd}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom"
                required
              />
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Type"
                required
              />
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Couleur"
                required
              />
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Poids"
                required
              />
              <input
                type="file"
                name="image"
                onChange={handleChange}
              />
              <button type="submit">Ajouter</button>
              <button type="button" onClick={toggleForm}>Annuler</button>
            </form>
          </div>
        </div>
      )}

      {/* Formulaire de modification d'un animal */}
      {showForm && currentPetId && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h3>Modifier l'animal</h3>
            <form onSubmit={handleEdit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom"
                required
              />
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Type"
                required
              />
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Couleur"
                required
              />
              {/* <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Poids"
                required
              /> */}
              <input
                type="file"
                name="image"
                onChange={handleChange}
              />
              <button type="submit">Modifier</button>
              <button type="button" onClick={toggleForm}>Annuler</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPet;