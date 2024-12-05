import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import '../styles/styles.css';
import '../styles/utils.css';

const Contact = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', adress: '', phone: '', mail: '' });
  const [currentContactId, setCurrentContactId] = useState(null);

  const toggleForm = () => {
    setShowForm(prevState => !prevState);
    if (showForm) {
      setFormData({ name: '', adress: '', phone: '', mail: '' });
      setIsEditing(false);
    }
  };

  const fetchContacts = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const data = await apiRequest('GET', `/api/contacts`, null, token);
      setContacts(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des contacts:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, adress, phone, mail } = formData;
    if (!name || !adress || !phone || !mail) {
      alert('Tous les champs doivent être remplis');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour ajouter/modifier un contact.');
      return;
    }

    const apiUrl = isEditing
      ? `/api/contacts/update/${currentContactId}`
      : '/api/contacts/add';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const updatedContact = await apiRequest(method, `${apiUrl}`, formData, token);
      setContacts(prevContacts =>
        isEditing
          ? prevContacts.map(contact => (contact._id === currentContactId ? updatedContact : contact))
          : [...prevContacts, updatedContact]
      );
      setShowForm(false);
      setIsEditing(false);
      setFormData({ name: '', adress: '', phone: '', mail: '' });
    } catch (error) {
      console.error(`Erreur lors de la ${isEditing ? 'modification' : 'ajout'} du contact:`, error);
    }
  };

  const handleEdit = (contact) => {
    setIsEditing(true);
    setCurrentContactId(contact._id);
    setFormData({ name: contact.name, adress: contact.adress, phone: contact.phone, mail: contact.mail });
    setShowForm(true);
  };

  const deleteContact = async (contactId) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await apiRequest('DELETE', `/api/contacts/remove/${contactId}`, null, token);
      setContacts(contacts.filter(contact => contact._id !== contactId));
    } catch (error) {
      console.error('Erreur lors de la suppression du contact:', error);
    }
  };

  const handleDelete = (contactId) => {
    const confirmDeletion = window.confirm("Êtes-vous sûr de vouloir supprimer cet animal ? Cette action est irréversible.");
    if (confirmDeletion) {
      deleteContact(contactId);
    }
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
              <a href={`tel:${contact.phone}`}><strong>📱</strong> {contact.phone}</a>
              <p ><strong>📍</strong> {contact.adress}</p>
              <a href={`mailto:${contact.mail}`}><strong>✉️</strong> {contact.mail}</a>
              <div className='contact-btn'>
                <button className='btn modify' onClick={() => handleEdit(contact)}>Modifier</button>
                <button className='btn' onClick={() => handleDelete(contact._id)}>Supprimer</button>
              </div>
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
            <button className="canceled-form-btn" type="button" onClick={toggleForm}>X</button>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div>
                <p>Nom :</p>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nom du contact"
                  required
                />
              </div>
              <div>
                <p>Adresse :</p>
                <input
                  type="text"
                  value={formData.adress}
                  onChange={(e) => setFormData({ ...formData, adress: e.target.value })}
                  placeholder="Adresse"
                  required
                />
              </div>
              <div>
                <p>Téléphone :</p>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Téléphone"
                  required
                />
              </div>
              <div>
                <p>Email :</p>
                <input
                  type="email"
                  value={formData.mail}
                  onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
                  placeholder="Email"
                  required
                />
              </div>
              <button type="submit">{isEditing ? 'Modifier' : 'Ajouter'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;