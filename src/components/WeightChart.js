import React from 'react';
import '../styles/styles.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import petsData from '../assets/petsData'; // Import des données des animaux

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

const WeightChart = () => {
  // Trouver les animaux en fonction de leurs ids
  const pet1 = petsData.find(p => p.id === 1);  // Ronflex
  const pet2 = petsData.find(p => p.id === 2);  // Tango

  if (!pet1 || !pet2) {
    return <div>Animal non trouvé</div>; // Message d'erreur si un des animaux n'existe pas
  }

  // Formatage des données pour Chart.js
  const chartData = {
    labels: pet1.data.map(entry => entry.date), // Utilisation des mêmes dates pour les deux animaux
    datasets: [
      {
        label: `${pet1.name} - Poids`,
        data: pet1.data.map(entry => entry.weight), // Poids de Ronflex
        borderColor: 'rgba(75, 192, 192, 1)',  // Couleur de Ronflex
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4, // Courbe lissée
      },
      {
        label: `${pet2.name} - Poids`,
        data: pet2.data.map(entry => entry.weight), // Poids de Tango
        borderColor: 'rgba(255, 99, 132, 1)',  // Couleur de Tango
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4, // Courbe lissée
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
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
      <h2>📈 Courbe de poids</h2>
      <div className="weight-chart">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default WeightChart;
