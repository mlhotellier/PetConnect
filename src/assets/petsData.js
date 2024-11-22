import petImage1 from './ronflex.jpg'; // Remplacez par le chemin réel de l'image
import petImage2 from './tango.jpg'; // Remplacez par le chemin réel de l'image

const petsData = [
  {
    id: 1,
    name: "Ronflex",
    age: "3 ans",
    type: "Chat",
    color: "Gris - Blanc",
    image: petImage1,
    data: [
      { date: '2024-01-01', weight: 4.5 },
      { date: '2024-02-01', weight: 4.7 },
      { date: '2024-03-01', weight: 4.9 },
      { date: '2024-04-01', weight: 5.0 },
      { date: '2024-05-01', weight: 5.1 },
      { date: '2024-06-01', weight: 5.3 },
    ],
  },
  {
    id: 2,
    name: "Tango",
    age: "1 an",
    type: "Chat",
    color: "Noir - Blanc",
    image: petImage2,
    data: [
      { date: '2024-01-01', weight: 5.2 },
      { date: '2024-02-01', weight: 5.4 },
      { date: '2024-03-01', weight: 5.6 },
      { date: '2024-04-01', weight: 5.8 },
      { date: '2024-05-01', weight: 6.0 },
      { date: '2024-06-01', weight: 6.1 },
    ],
  },
];

export default petsData;
