import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/styles.css';
import petsData from '../assets/petsData';

const appointments = [
  { id: 1, title: petsData[0].name, date: '2024-07-11', type: '🎂', age: '4 ans' },
  { id: 2, title: petsData[1].name, date: '2024-08-04', type: '🎂', age: '2 ans' },
  { id: 3, title: petsData[1].name, date: '2024-11-08', type: '📌 RDV vétérinaire' },
  { id: 4, title: petsData[1].name, date: '2024-11-28', type: 'Vermifuge' },
  { id: 5, title: petsData[0].name, date: '2024-11-28', type: 'Vermifuge' },
  { id: 6, title: petsData[0].name, date: '2025-01-04', type: 'Vaccin' },
  { id: 7, title: petsData[0].name, date: '2025-07-11', type: '🎂', age: '5 ans' },
  { id: 8, title: petsData[1].name, date: '2025-08-04', type: '🎂', age: '3 ans' },
];

const CalendarCard = () => {
  const [date, setDate] = useState(new Date()); // Date sélectionnée dans le calendrier
  const [filter, setFilter] = useState('upcoming'); // "upcoming" ou "past"
  const [filteredAppointments, setFilteredAppointments] = useState([]); // Liste des rendez-vous filtrés

  const now = new Date();

  // Fonction pour formater une date au format français
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Filtrer les rendez-vous
  const filterAppointments = (newFilter) => {
    const newFilteredAppointments = appointments.filter((app) => {
      const appDate = new Date(app.date);
      return newFilter === 'upcoming' ? appDate >= now : appDate < now;
    });

    // Vider temporairement la liste pour éviter les doublons
    setFilteredAppointments([]);
    setTimeout(() => {
      setFilteredAppointments(newFilteredAppointments);
    }, 0); // Délais pour simuler le rafraîchissement
  };

  // Gérer le changement de vue (Passé / À venir)
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    filterAppointments(newFilter);
  };

  // Synchroniser la sélection avec le calendrier
  const handleListClick = (appointmentDate) => {
    setDate(new Date(appointmentDate)); // Met à jour la date du calendrier
  };

  useEffect(() => {
    // Charger les rendez-vous "à venir" par défaut
    filterAppointments(filter);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="section w-66">
      <h2>📆 Mes évènements</h2>
      <div className="calendar-card">
        <Calendar onChange={setDate} value={date} />
        {/* Boutons pour changer de vue */}
        <div className="meets">
          <div className="filter-buttons">
            <button
              onClick={() => handleFilterChange('past')}
              className={filter === 'past' ? 'active' : ''}
            >
              Passés
            </button>
            <button
              onClick={() => handleFilterChange('upcoming')}
              className={filter === 'upcoming' ? 'active' : ''}
            >
              À venir
            </button>
          </div>
          {/* Liste des rendez-vous filtrés */}
          <div className="appointment-list">
            <ul>
              {filteredAppointments.map((app) => (
                <li key={app.id} onClick={() => handleListClick(app.date)}>
                  <span>{formatDate(app.date)}</span> -{' '} {app.type} {app.title} {app.age ? `(${app.age})` : ''}
                  
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;