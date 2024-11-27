import React from 'react';
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

const WeightChart = ({ pets, loadingPets }) => {
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
        label: `${pet.name} - Poids`,
        data: petWeights, // Poids de l'animal pour chaque date
        borderColor: index % 2 === 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)', // Couleur de chaque courbe
        backgroundColor: index % 2 === 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        fill: false, // Pas de remplissage sous la courbe
        tension: 0, // Pas de lissage de la courbe, juste des points
        pointStyle: 'circle', // Utiliser des points
        radius: 5, // Taille des points
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

  return (
    <div className="section w-66">
      <div className="section-title">
        <h2>📈 Courbe de poids</h2>
      </div>
      <div className="weight-chart weight-card">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default WeightChart;