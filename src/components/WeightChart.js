import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// Enregistrement des composants de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeightChart = ({ pets, loadingPets, addWeightData, deleteWeightData }) => {
  // Etat pour gérer l'affichage du formulaire
  const [showForm, setShowForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState('');
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [editData, setEditData] = useState(null);

  // Fonction pour générer une couleur unique (HSL)
  const generateColor = (index) => {
    const hue = (index * 137) % 360; // Une teinte unique par animal
    return `hsl(${hue}, 70%, 50%)`; // Couleur vive
  };

  // Associer chaque animal à une couleur
  const petColors = pets.reduce((acc, pet, index) => {
    const baseColor = generateColor(index);
    acc[pet._id] = {
      point: baseColor, // Couleur pleine pour les points
      line: baseColor.replace('50%)', '50%, 40%)'), // Couleur transparente pour les lignes
    };
    return acc;
  }, {});

  // Récupérer toutes les dates uniques pour les axes
  const allDates = [];

  pets.forEach((pet) => {
    pet.data.forEach((entry) => {
      // Vérifier que la date existe et est valide avant de la formater
      if (entry.date) {
        const formattedDate = new Date(entry.date).toISOString().split('T')[0]; // Format YYYY-MM-DD
        if (!allDates.includes(formattedDate)) {
          allDates.push(formattedDate);
        }
      }
    });
  });

  // Trier les dates par ordre chronologique
  allDates.sort((a, b) => new Date(a) - new Date(b));

  // Fonction pour récupérer les poids existants (sans interpolation)
  const getWeightData = (petData, allDates) => {
    return allDates.map((date) => {
      const entry = petData.find((entry) => new Date(entry.date).toISOString().split('T')[0] === date);
      return entry ? entry.weight : null; // Si pas de donnée pour cette date, on met null
    });
  };

  // Formatage des données pour Chart.js
  const chartData = {
    labels: allDates, // Utilisation des dates triées pour l'axe des X
    datasets: pets.map((pet, index) => {
      const petWeights = getWeightData(pet.data, allDates); // Utiliser les poids existants

      return {
        label: `${pet.name}`,
        data: petWeights,
        borderColor: 'transparent', // Couleur transparente pour la ligne
        backgroundColor: petColors[pet._id].line,
        pointBackgroundColor: petColors[pet._id].point, // Couleur pleine pour les points
        pointBorderColor: petColors[pet._id].point,
        fill: false,
        tension: 0,
        pointStyle: 'circle',
        radius: 5,
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date', // Légende pour l'axe des X
        },
      },
      y: {
        title: {
          display: true,
          text: 'Poids (kg)',
        },
        min: 0,
      },
    },
    plugins: {
      tooltip: {
        mode: 'nearest',
        intersect: false,
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const element = elements[0];
        const petId = pets[element.datasetIndex]._id;
        const date = chartData.labels[element.index];
        const weight = pets[element.datasetIndex].data.find(
          (entry) => new Date(entry.date).toISOString().split('T')[0] === date
        ).weight;

        const petData = new FormData();
        petData.append('weight', weight);
        petData.append('userId', localStorage.getItem('userId'));

        setEditData({ petId, date, weight });
        setSelectedPet(petId);
        setDate(date);
        setWeight(weight);
        setShowForm(true);
      }
    },
  };

  // Basculer l'affichage du formulaire
  const toggleForm = () => {
    setShowForm(!showForm);
    setSelectedPet('');
    setDate('');
    setWeight('');
    setEditData(null);
  };

  // Fonction pour gérer l'ajout d'un nouveau poids
  const handleAddWeight = (e) => {
    e.preventDefault();

    // Vérifier que la date et le poids sont valides
    if (!date || !weight || isNaN(weight)) {
      alert("Veuillez entrer une date valide et un poids valide.");
      return;
    }

    // Ajouter la nouvelle donnée de poids pour l'animal sélectionné
    const weightData = {
      petId: selectedPet,
      date,
      weight: parseFloat(weight),
    };

    // Appeler la fonction `addWeightData` passée en props pour ajouter les données
    addWeightData(weightData);

    toggleForm();
  };

  const handleDeleteWeight = (e) => {
    e.preventDefault();

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce poids ?")) {
      return; // Ne rien faire si l'utilisateur annule
    }

    if (!date || !weight || isNaN(weight)) {
      alert("Aucun poids sélectionné à supprimer.");
      return;
    }

    const weightData = {
      petId: selectedPet,
      date,
      weight,
    };

    deleteWeightData(weightData);

    toggleForm();
  };
  
  return (
    <div className="section w-66">
      <div className="section-title">
        <h2>📈 Courbe de poids</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>+</button>
      </div>
      <div className="weight-chart weight-card">
        {loadingPets ? (
          <p>Chargement...</p>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

      {/* Formulaire pour ajouter ou supprimer un poids */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content weight-form">
            <h3>{editData ? 'Modifier un poids' : 'Ajouter un poids'}</h3>
            <button className="canceled-form-btn" type="button" onClick={toggleForm}>X</button>
            <form className="add-weight-form" onSubmit={editData ? handleDeleteWeight : handleAddWeight}>
              <div>
                <p>{editData ? 'Animal :' : 'Choisir un animal :'}</p>
                {editData ? (
                  <p>{pets.find((pet) => pet._id === selectedPet)?.name || 'Animal inconnu'}</p>
                ) : (
                  <select
                    value={selectedPet}
                    onChange={(e) => setSelectedPet(e.target.value)}
                    required
                  >
                    <option value="">Sélectionner un animal</option>
                    {pets.map((pet) => (
                      <option key={pet._id} value={pet._id}>
                        {pet.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <p>Date :</p>
                {editData ? 
                  <p>{editData.date}</p> :
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  /> 
                }
              </div>
              <div>
                <p>Poids :</p>
                {editData ? 
                  <p>{editData.weight} Kg</p> :
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Poids (kg)"
                    required
                  />
                }
              </div>
              <div className="form-actions">
                {!editData ? (
                  <button type="submit">Ajouter un poids</button>
                ) : (
                  <>
                    <button type="submit">Supprimer</button>
                    <button type="button" onClick={toggleForm}>Annuler</button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightChart;