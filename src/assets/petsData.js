import petImage1 from './ronflex.jpg'; // Remplacez par le chemin réel de l'image
import petImage2 from './tango.jpg'; // Remplacez par le chemin réel de l'image

const petsData = [
  {
    id: 1,
    name: "Ronflex",
    birthDate: "2020-07-11", // Date de naissance
    type: "Chat",
    color: "Gris - Blanc",
    image: petImage1,
    data: [
      { date: '2024-01-01', weight: 4.0 },
      { date: '2024-02-01', weight: 4.1 },
      { date: '2024-03-01', weight: 4.5 },
      { date: '2024-04-01', weight: 4.2 },
      { date: '2024-05-01', weight: 4.3 },
      { date: '2024-06-01', weight: 4.3 },
    ],
  },
  {
    id: 2,
    name: "Tango",
    birthDate: "2022-08-04", // Date de naissance
    type: "Chat",
    color: "Noir - Blanc",
    image: petImage2,
    data: [
      { date: '2024-01-01', weight: 3.8 },
      { date: '2024-02-01', weight: 4.0 },
      { date: '2024-03-01', weight: 4.2 },
      { date: '2024-04-01', weight: 4.8 },
      { date: '2024-05-01', weight: 4.6 },
      { date: '2024-06-01', weight: 4.2 },
    ],
  },
];

export default petsData;

