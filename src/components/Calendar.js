import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { apiRequest } from '../utils/api';
import 'react-calendar/dist/Calendar.css';
import '../styles/styles.css';
import '../styles/utils.css';

const CalendarCard = ({ pets }) => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);  // Liste des événements à venir
  const [showModal, setShowModal] = useState(false);  // Contrôle de la modale
  const [newEvent, setNewEvent] = useState({
    date: '',
    petId: '',
    description: '',
  });

  // Ajouter un état pour basculer entre événements passés et à venir
  const [showUpcoming, setShowUpcoming] = useState(true); // true pour "à venir", false pour "passé"

  // Fonction pour formater une date au format français
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Fonction pour formater une date au format YYYY-MM-DD (sans l'heure)
  const formatDateOnly = (date) => {
    return date.toISOString().split('T')[0];  // Extrait la partie date (YYYY-MM-DD)
  };

  // Gérer l'ouverture de la modale
  const handleModalOpen = () => {
    setShowModal(true);
  };

  // Gérer la fermeture de la modale
  const handleModalClose = () => {
    setShowModal(false);
    setNewEvent({
      date: '',
      petId: '',
      description: '',
    });
  };

  // Gérer le changement de valeurs dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fonction pour récupérer les événements
  const fetchEvents = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour voir les événements.');
      return;
    }

    try {
      const events = await apiRequest('GET', '/api/evenements/', null, token);
      setAppointments(events);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      alert('Une erreur est survenue lors de la récupération des événements.');
    }
  };

  // Appel à fetchEvents au montage du composant
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const { date, petId, description } = newEvent;
  
    if (!date || !petId || !description) {
      alert('Tous les champs sont obligatoires');
      return;
    }
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour ajouter/modifier un contact.');
      return;
    }
  
    try {
      // Effectuer la requête POST pour ajouter l'événement
      const response = await apiRequest('POST', '/api/evenements/add', newEvent, token);
  
      // Ajouter l'événement à appointments (tous les événements)
      setAppointments((prevAppointments) => {
        return [...prevAppointments, response];
      });
  
      // Fermer la modale après ajout
      handleModalClose();
    } catch (error) {
      console.error('Erreur:', error.response || error);
      alert('Une erreur est survenue lors de l\'ajout de l\'événement');
    }
  };
  
   

  // Filtrer et trier les événements à venir et passés
  const filterEvents = (events, upcoming = true) => {
    const currentDate = formatDateOnly(new Date()); // Utiliser le format YYYY-MM-DD pour la date actuelle
    
    // Filtrage des événements futurs ou passés
    const filteredEvents = events.filter((event) => {
      const eventDate = formatDateOnly(new Date(event.date)); // Utiliser le même format pour les événements
      return upcoming ? eventDate > currentDate : eventDate < currentDate;
    });

    // Trier les événements
    return filteredEvents.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return upcoming ? dateA - dateB : dateB - dateA;  // Trier pour les événements futurs (du plus proche au plus lointain) ou passés (du plus récent au plus ancien)
    });
  };

  const upcomingEvents = filterEvents(appointments, true);
  const pastEvents = filterEvents(appointments, false);

  // Gérer les événements du jour
  const eventsToday = appointments.filter(
    (event) => formatDateOnly(new Date(event.date)) === formatDateOnly(date)
  );

  return (
    <div className="section w-66">
      <div className="section-title">
        <h2>📆 Événements et Rendez-vous</h2>
        <button className="add-btn" onClick={handleModalOpen}>+</button>
      </div>

      <div className="calendar-card">
        {/* Affichage du calendrier */}
        <Calendar onChange={setDate} value={date} />

        <div className='all-events-section'>
          {/* Section des événements du jour */}
          <div className="events-today-section">
            <h3>Aujourd'hui, {formatDate(date)}</h3>
            <ul>
              {eventsToday.length === 0 ? (
                <li>Rien à faire ce jour</li>
              ) : (
                eventsToday.map((event, index) => (
                  <li key={index}>
                    <strong>{event.name}</strong> - {formatDate(new Date(event.date))} - {event.description}
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Section des rendez-vous à venir / passés */}
          <div className="upcoming-events-section">
            <h3>Evènements</h3>
            <div className="event-toggle">
              <button
                className={showUpcoming ? 'active' : ''}
                onClick={() => setShowUpcoming(true)}
              >
                à venir
              </button>
              <button
                className={!showUpcoming ? 'active' : ''}
                onClick={() => setShowUpcoming(false)}
              >
                passés
              </button>
            </div>
            <ul>
              {(showUpcoming ? upcomingEvents : pastEvents).length === 0 ? (
                <li>Aucun rendez-vous pour cette période.</li>
              ) : (
                (showUpcoming ? upcomingEvents : pastEvents).map((event, index) => (
                  <li key={index}>
                    <strong>{event.name}</strong> - {formatDate(new Date(event.date))} - {event.description}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Modale pour ajouter un événement */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Ajouter un événement</h3>
            <button className="canceled-form-btn" onClick={handleModalClose}>X</button>
            <form onSubmit={handleEventSubmit}>
              <div>
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="petId">Sélectionner un animal</label>
                <select
                  name="petId"
                  value={newEvent.petId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Choisir un animal</option>
                  {pets.map((pet) => (
                    <option key={pet._id} value={pet._id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <button type="submit">Ajouter</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarCard;