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

const WeightChart = ({ pets, loadingPets, addWeightData }) => {
  // Etat pour gérer l'affichage du formulaire
  const [showForm, setShowForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState('');
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');

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

  // Vérification : S'assurer que les données des animaux existent et sont valides
  if (!pets || pets.length === 0) {
    return <div>Aucun animal trouvé</div>;
  }

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

  // Fonction pour interpoler les poids manquants (moyenne entre les valeurs précédentes et suivantes)
  const interpolateMissingData = (allDates, petData, birthDate) => {
    const interpolatedData = allDates.map((date) => {
      // Trouver toutes les entrées pour cette date
      const entriesForDate = petData.filter(
        (entry) => new Date(entry.date).toISOString().split('T')[0] === date
      );

      // Ignorer les poids avant la birthDate
      if (new Date(date) < new Date(birthDate)) {
        return null;
      }

      if (entriesForDate.length > 0) {
        // Si plusieurs entrées pour la même date, prendre la dernière entrée
        const lastEntry = entriesForDate[entriesForDate.length - 1];
        return lastEntry.weight;
      }

      // Si pas de donnée pour la date, on fait une interpolation
      const previousEntry = petData.find(
        (entry) =>
          entry.date &&
          new Date(entry.date).toISOString().split('T')[0] === allDates[allDates.indexOf(date) - 1]
      );
      const nextEntry = petData.find(
        (entry) =>
          entry.date &&
          new Date(entry.date).toISOString().split('T')[0] === allDates[allDates.indexOf(date) + 1]
      );

      if (previousEntry && nextEntry) {
        // Moyenne des poids précédent et suivant
        return (previousEntry.weight + nextEntry.weight) / 2;
      }

      // Si aucune donnée précédente ou suivante, on renvoie null
      return null;
    });

    return interpolatedData;
  };

  // Formatage des données pour Chart.js
  const chartData = {
    labels: allDates, // Utilisation des dates triées pour l'axe des X
    datasets: pets.map((pet, index) => {
      const petWeights = interpolateMissingData(allDates, pet.data, pet.birthDate); // Interpoler les données manquantes, en excluant les poids avant birthDate
      
      return {
        label: `${pet.name}`,
        data: petWeights,
        borderColor: petColors[pet._id].line, // Couleur transparente pour la ligne
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

    // Réinitialiser les champs
    setSelectedPet('');
    setDate('');
    setWeight('');
    setShowForm(false); // Fermer le formulaire après soumission
  };

  return (
    <div className="section w-66">
      <div className="section-title">
        <h2>📈 Courbe de poids</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>+</button>
      </div>
      <div className="weight-chart weight-card">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Formulaire pour ajouter un poids */}
      {showForm && (
        <div className="weight-form">
          <h3>Ajouter un poids</h3>
          <form onSubmit={handleAddWeight}>
            <div>
              <label>Choisir un animal :</label>
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
            </div>
            <div>
              <label>Date :</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Poids :</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Poids"
                required
              />
            </div>
            <button type="submit">Ajouter le poids</button>
            <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WeightChart;