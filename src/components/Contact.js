import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';
import '../styles/utils.css';

const Contact = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Nouvelle variable d'état pour savoir si on modifie un contact
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [adress, setAdress] = useState('');
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const [currentContactId, setCurrentContactId] = useState(null); // ID du contact en cours de modification

  // Fonction pour ouvrir/fermer la modale
  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      // Réinitialiser les champs du formulaire
      setName('');
      setAdress('');
      setPhone('');
      setMail('');
      setIsEditing(false);
    }
  };

  // Récupérer les contacts depuis l'API
  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_BACKEND_URL}/api/contacts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setContacts(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  // Ajouter un contact
  const addContact = async (e) => {
    e.preventDefault();

    const contactData = {
      name,
      adress,
      phone,
      mail,
    };

    const token = localStorage.getItem('authToken'); // Récupérer le token depuis le localStorage

    if (!token) {
      alert('Vous devez être connecté pour ajouter un contact.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_BACKEND_URL}/api/contacts/add`,
        contactData,
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token d'authentification
          },
        }
      );
      setContacts(contacts.map(contact => (contact._id === currentContactId ? response.data : contact)));
      setShowForm(false);
      setIsEditing(false); // Reset mode edit
    } catch (error) {
      console.error('Erreur lors de l\'ajout du contact:', error);
    }
  };

  // Modifier un contact
  const updateContact = async (e) => {
    e.preventDefault();

    if (!name || !adress || !phone || !mail) {
      alert('Tous les champs doivent être remplis');
      return;
    }

    const formData = {
      name,
      adress,
      phone,
      mail,
    };

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour modifier un contact.');
      return;
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_SERVER_BACKEND_URL}/api/contacts/update/${currentContactId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setContacts(contacts.map(contact => (contact._id === currentContactId ? response.data : contact)));
      setShowForm(false);
      setIsEditing(false); // Reset mode edit
    } catch (error) {
      console.error('Erreur lors de la modification du contact:', error.response?.data || error.message);
    }
  };

  // Supprimer un contact
  const deleteContact = async (contactId) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_BACKEND_URL}/api/contacts/remove/${contactId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setContacts(contacts.filter(contact => contact._id !== contactId));
    } catch (error) {
      console.error('Erreur lors de la suppression du contact:', error);
    }
  };

  // Charger les données du contact pour modification
  const handleEdit = (contact) => {
    setIsEditing(true);
    setCurrentContactId(contact._id);
    setName(contact.name);
    setAdress(contact.adress);
    setPhone(contact.phone);
    setMail(contact.mail);
    setShowForm(true);
  };

  return (
    <div className="section w-33">
      <div className="section-title">
        <h2>📇 Contacts</h2>
        <button className="add-btn" onClick={toggleForm}>+</button>
      </div>

      {/* Liste des contacts récupérés */}
      {contacts.length > 0 ? (
        contacts.map((contact) => (
          <div className="contact-card" key={contact._id}>
            <div className="contact-info">
              <h2 className="contact-name">🩺 {contact.name}</h2>
              <p><strong>📱</strong> {contact.phone}</p>
              <p><strong>📍</strong> {contact.adress}</p>
              <p><strong>✉️</strong> {contact.mail}</p>
              <button onClick={() => handleEdit(contact)}>Modifier</button>
              <button onClick={() => deleteContact(contact._id)}>Supprimer</button>
            </div>
          </div>
        ))
      ) : (
        <p>Aucun contact disponible.</p>
      )}

      {/* Modale pour ajouter ou modifier un contact */}
      {showForm && (
        <div className="modal-overlay" onClick={toggleForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{isEditing ? 'Modifier le contact' : 'Ajouter un contact'}</h3>
            <form onSubmit={isEditing ? updateContact : addContact}>
              <div>
                <label>Nom :</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nom du contact"
                  required
                />
              </div>
              <div>
                <label>Adresse :</label>
                <input
                  type="text"
                  value={adress}
                  onChange={(e) => setAdress(e.target.value)}
                  placeholder="Adresse"
                  required
                />
              </div>
              <div>
                <label>Téléphone :</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Téléphone"
                  required
                />
              </div>
              <div>
                <label>Email :</label>
                <input
                  type="email"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <button type="submit">{isEditing ? 'Modifier' : 'Ajouter'}</button>
              <button type="button" onClick={toggleForm}>Annuler</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;