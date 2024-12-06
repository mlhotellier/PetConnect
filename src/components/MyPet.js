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
  const [imagePreview, setImagePreview] = useState(null); 
  const [formErrors, setFormErrors] = useState({});

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

  // Function to validate Formdata at adding pets
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Le nom est obligatoire.';
    if (!formData.birthDate) errors.birthDate = 'La date de naissance est obligatoire.';
    if (!formData.type) errors.type = 'Le type d’animal est obligatoire.';
    if (!formData.color) errors.color = 'La couleur est obligatoire.';
    if (!formData.weight || formData.weight <= 0) errors.weight = 'Le poids doit être supérieur à 0.';
    if (!formData.image) errors.image = 'L’image est obligatoire.';
    if (formData.image && formData.image.size > 5 * 1024 * 1024) {
      errors.image = 'La taille de l’image ne doit pas dépasser 5 Mo.';
    }
    return errors;
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
    setFormErrors({});
    setCurrentPetId(null);
    setImagePreview(null);
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === "file" && files && files.length > 0) {
      const file = files[0];
  
      // Vérification du type MIME pour s'assurer que c'est une image
      if (!file.type.startsWith("image/")) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          image: 'Le fichier doit être une image (formats acceptés : jpg, png).',
        }));
        return;
      } else {
        // Si le type est valide, retirer une éventuelle erreur précédente
        setFormErrors((prevErrors) => {
          const { image, ...rest } = prevErrors; // Supprimer l'erreur d'image
          return rest;
        });
      }
  
      // Vérification de la taille de l'image (5 Mo max)
      if (file.size > 5 * 1024 * 1024) { // 5 Mo en octets
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          image: 'La taille de l’image ne doit pas dépasser 5 Mo.',
        }));
        return;
      } else {
        // Si la taille est valide, retirer une éventuelle erreur précédente
        setFormErrors((prevErrors) => {
          const { image, ...rest } = prevErrors; // Supprimer l'erreur d'image
          return rest;
        });
      }
  
      // Si le fichier est valide, mettre à jour l'état et la prévisualisation
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Prévisualisation de l'image
      };
      reader.readAsDataURL(file);
    } else {
      // Gestion des autres champs (texte, date, nombre, etc.)
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };   

  // Soumettre le formulaire pour ajouter un animal
  const handleAdd = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

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

  // Supprimer un animal avec confirmation
  const handleDelete = (petId) => {
    const confirmDeletion = window.confirm("Êtes-vous sûr de vouloir supprimer cet animal ? Cette action est irréversible.");
    if (confirmDeletion) {
      deletePet(petId);
    }
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

    // Si l'image existe, affiche la prévisualisation
    if (pet.image) {
      setImagePreview(`${imgRepository}${pet.image}`);
    } else {
      setImagePreview(null);
    }

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
            const { years, months } = calculateAge(pet.birthDate); // Calculer l'âge
            return (
              <div key={pet._id} className="pet-card">
              <div className="pet-image">
                <img src={`${imgRepository}${pet.image}`} alt={pet.name} className="pet-photo" />
              </div>
              <div className="pet-info">
                <h2 className="pet-name">{pet.name}</h2>
                <p><strong>Type: </strong>{pet.type}</p>
                <p><strong>Couleur: </strong>{pet.color}</p>
                <p><strong>Âge: </strong>{years} an{years !== 1 ? 's' : ''} et {months} mois</p>
                <div className='pet-btn'>
                  <button className='btn modify' onClick={() => handleEditForm(pet)}>Modifier</button>
                  <button className='btn' onClick={() => handleDelete(pet._id)}>Supprimer</button>
                </div>
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
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Ajouter un animal</h3>
            <button className="canceled-form-btn" type="button" onClick={toggleForm}>X</button>
            <form onSubmit={handleAdd}>
              <div className={imagePreview ? 'input-img-preview':'input-img'}>
                {/* Champ image */}
                <div className={imagePreview ? 'input-file-preview' : 'input-file'}>
                  <p className="button-file">+ Ajouter une photo</p>
                  <p className='infos-img-type'>jpg, png : 5mo max</p>
                  {formErrors.image && <p className="error-message">{formErrors.image}</p>}
                </div>
                <input
                  className={imagePreview ? 'preview-active' : ''}
                  type="file"
                  name="image"
                  onChange={handleChange}
                />
                {imagePreview && (
                  <img
                    id="imagePreview"
                    src={imagePreview}
                    alt="Prévisualisation de l'image"
                    style={{
                      maxHeight: '110px',
                      position:'absolute',
                      maxWidth: '420px',
                      display: 'block',
                      margin: '0px auto',
                    }}
                  />
                )}
                {imagePreview ? <p className="button-file">Modifier la photo</p> : ''}
              </div>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom"
                required
              />
              {formErrors.name && <p className="error-message">{formErrors.name}</p>}

              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
              {formErrors.birthDate && <p className="error-message">{formErrors.birthDate}</p>}

              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Type"
                required
              />
              {formErrors.type && <p className="error-message">{formErrors.type}</p>}

              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Couleur"
                required
              />
              {formErrors.color && <p className="error-message">{formErrors.color}</p>}

              <input
                type="number"
                name="weight"
                min="0"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Poids"
                required
              />
              {formErrors.weight && <p className="error-message">{formErrors.weight}</p>}

              <button type="submit">Ajouter</button>
            </form>

          </div>
        </div>
      )}

      {/* Formulaire de modification d'un animal */}
      {showForm && currentPetId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Modifier l'animal</h3>
            <button className="canceled-form-btn" type="button" onClick={toggleForm}>X</button>
            <form onSubmit={handleEdit}>
              <div className={imagePreview ? 'input-img-preview':''}>
                <div className={imagePreview ? 'input-file-preview' : 'input-file'}>
                  <p className="button-file">+ Ajouter une photo</p>
                  <p className='infos-img-type'>jpg, png : 5mo max</p>
                </div>
                <input
                  className={imagePreview ? 'preview-active' : ''}
                  type="file"
                  name="image"
                  onChange={handleChange}
                />
                {/* Prévisualisation de l'image */}
                {imagePreview && (
                  <img
                    id="imagePreview"
                    src={imagePreview}
                    alt="Prévisualisation de l'image"
                    style={{
                      maxHeight: '110px',
                      position:'absolute',
                      maxWidth: '420px',
                      display: 'block',
                      margin: '0px auto',
                    }}
                  />
                )}
                  <p className="button-file">Modifier la photo</p>
              </div>

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
              <button type="submit">Modifier</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPet;