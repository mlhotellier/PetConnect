import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { apiRequest } from '../utils/api';
import 'react-calendar/dist/Calendar.css';
import '../styles/styles.css';
import '../styles/utils.css';

const CalendarCard = ({ pets }) => {
  const [date, setDate] = useState(new Date()); // Date actuelle ou sélectionnée
  const [appointments, setAppointments] = useState([]);  // Liste des événements
  const [showModal, setShowModal] = useState(false);  // Contrôle de la modale
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    petName: '',
    description: '',
  });
  const [selectedEvent, setSelectedEvent] = useState(null); // Détails d'un événement sélectionné
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Fonction pour formater une date au format jj/mm/aaaa
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Gérer l'ouverture de la modale
  const handleModalOpen = () => {
    setShowModal(true);
  };

  // Gérer la fermeture de la modale
  const handleModalClose = () => {
    setShowModal(false);
    setNewEvent({
            title: '',
            date: '',
            petName: '',
            description: '',
      });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };
  
  const handleDetailsModalClose = () => {
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      date: '',
      petName: '',
      description: '',
    });
    setEditMode(false)
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
  const getEvents = async () => {
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

  // Appel à getEvents au montage du composant
  useEffect(() => {
    getEvents();
  }, []);

  // Fonction pour ajouter un événement
  const addEvent = async (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-unused-vars
    const { title, date, petName, description } = newEvent;
  
    if (!date || !title) {
      alert('Les champs titre et date sont obligatoires');
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

  // Fonction pour supprimer un événement
  const deleteEvent = async (e) => {  
    e.preventDefault(); // Empêche le comportement par défaut du formulaire
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour supprimer un événement.');
      return; // Sortir de la fonction si l'utilisateur n'est pas connecté
    }

    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?');
    if (!confirmDelete) return; // Si l'utilisateur annule, on arrête la suppression

    try {
      // Effectuer la requête DELETE pour supprimer l'événement
      await apiRequest('DELETE', `/api/evenements/delete/${selectedEvent._id}`, null, token);

      // Mettre à jour la liste des événements après la suppression
      setAppointments((prevAppointments) =>
        prevAppointments.filter((event) => event._id !== selectedEvent._id)
      );

      // Fermer la modale après la suppression
      handleDetailsModalClose();
      handleModalClose();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      alert('Une erreur est survenue lors de la suppression de l\'événement.');
    }
  };

  // Fonction pour modifier un évènement
  const updateEvent = async (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour modifier un événement.');
      return; // Sortir de la fonction si l'utilisateur n'est pas connecté
    }
  
    try {
      // Effectuer la requête PUT pour modifier l'événement
      const updatedEvent = await apiRequest(
        'PUT',
        `/api/evenements/update/${selectedEvent._id}`,
        newEvent,
        token
      );
  
      // Mettre à jour l'événement dans la liste des événements en remplaçant celui avec le même _id
      setAppointments((prevAppointments) =>
        prevAppointments.map((event) =>
          event._id === selectedEvent._id ? { ...event, ...updatedEvent } : event
        )
      );
  
      // Fermer la modale après modification
      handleDetailsModalClose();
      handleModalClose();
      setEditMode(false);
    } catch (error) {
      console.error('Erreur lors de la modification de l\'événement:', error);
      alert('Une erreur est survenue lors de la modification de l\'événement.');
    }
  };
  

  // Filtrer et trier les événements pour les événements passés et à venir
  const filterEvents = (events, upcoming = true) => {
    const currentDate = new Date();
    
    // Filtrage des événements futurs ou passés
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.date); // Utiliser la date de l'événement
      
      // Compare si l'événement correspond à la date sélectionnée ou à la date du jour
      if (formatDate(currentDate) === formatDate(eventDate)) {
        // eslint-disable-next-line array-callback-return
        return;
      }

      return upcoming ? eventDate > currentDate : eventDate < currentDate;
    });

    // Trier les événements
    return filteredEvents.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      return upcoming ? dateA - dateB : dateB - dateA;  // Trier pour les événements futurs ou passés
    });
  };

  // Événements à venir et passés
  const upcomingEvents = filterEvents(appointments, true);  
  const pastEvents = filterEvents(appointments, false);  

  // Gérer les événements du jour (selon la date sélectionnée)
  const eventsToday = appointments.filter(
    (event) => formatDate(new Date(event.date)) === formatDate(date)
  );

  // Gérer la mise à jour de la date sélectionnée
  const handleDateChange = (newDate) => {
    setDate(newDate); // Met à jour la date sélectionnée
  };

  const handleEditClick = () => {
    setEditMode(true);
    setNewEvent({
      title: selectedEvent.title,
      date: formatDateForInput(selectedEvent.date),
      petName: selectedEvent.petName,
      description: selectedEvent.description || '',
    });
  };
  

  const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2); // Mois en deux chiffres
    const day = (`0${d.getDate()}`).slice(-2); // Jour en deux chiffres
    return `${year}-${month}-${day}`;
  };

  const handleViewEvent = () => {
    // Met à jour la date sélectionnée dans le calendrier
    setDate(new Date(selectedEvent.date));
    // Ferme la modale
    handleDetailsModalClose();
  };
  
  
  
  // Réinitialiser la date à aujourd'hui
  const resetDate = () => {
    setDate(new Date());
  };

  return (
    <div className="section w-66">
      <div className="section-title">
        <h2>📆 Événements et Rendez-vous</h2>
        <button className="add-btn" onClick={handleModalOpen}>+</button>
      </div>

      <div className="calendar-card">
        {/* Affichage du calendrier */}
        <Calendar onChange={handleDateChange} value={date} />

        <div className='all-events-section'>
          {/* Section des événements du jour */}
          <div className="events-today-section">
            <h3>Événement{eventsToday.length <= 1 ? '' : 's'} {formatDate(date) === formatDate(new Date()) ? "aujourd'hui" : `du ${formatDate(date)}`}</h3>
            <ul>
              {eventsToday.length === 0 ? (
                <li>Aucun événement. 😴</li>
              ) : (
                eventsToday.map((event, index) => (
                  <li key={index} className='event-resume' onClick={() => handleEventClick(event)}>
                    {event.title} {event.petName ? event.petName : ''} <br></br>
                    <span className='event-description-visible'>{event.description ? event.description : '' }</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Section des rendez-vous à venir / passés */}
          <div className="upcoming-events-section">
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
                  <li className='event-resume' key={index} onClick={() => handleEventClick(event)}>
                    <strong>{formatDate(new Date(event.date))}</strong> - {event.title}&nbsp;{event.petName ? event.petName : ''} {event.description ? <span className='event-description'>+</span> : '' }
                  </li>
                ))
              )}
            </ul>
          </div>

          {formatDate(date) === formatDate(new Date()) ? '' :
            <button className='btn reset' onClick={resetDate}>Aujourd'hui</button>
          }
        </div>
      </div>

      {/* Modale pour ajouter un événement */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Ajouter un événement</h3>
            <button className="canceled-form-btn" tabIndex="0" onClick={handleModalClose} aria-label="Fermer la modale" >X</button>
            <form className='form-event' onSubmit={addEvent}>
              <input
                type="text"
                name="title"
                placeholder="Titre de l'évènement"
                value={newEvent.title}
                onChange={handleInputChange}
                required 
              />
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                required
                placeholder="Date de l'évènement"
              />
              <div className='select-input-gab'>
                <p>Choisir un animal: </p>
                <select
                  name="petName"
                  value={newEvent.petName}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionner un animal</option>
                  {pets.map((pet) => (
                    <option key={pet._id} value={pet._id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                placeholder="Description de l'évènement"
              />
              <button type="submit">Ajouter</button>
            </form>
          </div>
        </div>
      )}

      {/* Détails d'un événement sélectionné */}
      {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="canceled-form-btn" tabIndex="0" onClick={handleDetailsModalClose} aria-label="Fermer la modale" >X</button>
            {!editMode ? (
              <>
                <h3>{selectedEvent.title}</h3>
                <div style={{display:'flex',justifyContent:'flex-start'}}>
                  <p>Date : {formatDate(new Date(selectedEvent.date))}</p>
                  <button id="event" className="btn" onClick={handleViewEvent}>Voir l'événement</button>
                </div>
                {selectedEvent.petName ? <p>Pour : {selectedEvent.petName}</p> : '' }
                {selectedEvent.description ? <p>Description : {selectedEvent.description}</p> : '' }
                <div className='btn-event-gab'>
                  <button className="edit" onClick={handleEditClick}>Modifier</button>
                  <button className="delete" onClick={deleteEvent}>Supprimer</button>
                </div>
              </>
            ) : (
              <>
                <h3>Modifier l'événement</h3>
                <form className='form-event' onSubmit={updateEvent}>
                  <input type="text"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Titre de l'évènement"
                  />
                  <input type="date"
                    name="date"
                    value={formatDateForInput(newEvent.date)}
                    onChange={handleInputChange}
                    required
                  />
                  <div className='select-input-gab'>
                    <label htmlFor="petName">Choisir un animal:</label>
                    <select
                      name="petName"
                      value={newEvent.petName}
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionner un animal</option>
                      {pets.map((pet) => (
                        <option key={pet._id} value={pet.name}>
                          {pet.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                  />
                  <button type="submit">Valider</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarCard;