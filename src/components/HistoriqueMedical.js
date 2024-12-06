import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api'; // Assurez-vous que apiRequest est correctement configuré
import '../styles/styles.css';
import '../styles/utils.css';

// Logos spécifiques pour les différents types de fichiers
import imagePreviewDefault from '../assets/icons/default.png'; // Logo par défaut pour l'image
import pdfLogo from '../assets/icons/pdf.png'; // Logo pour les fichiers PDF
import docLogo from '../assets/icons/doc.png'; // Logo pour les fichiers DOC
import imgLogo from '../assets/icons/image.png'; // Logo pour les fichiers JPG
import txtLogo from '../assets/icons/txt.png'; // Logo pour les fichiers TXT

const HistoriqueMedical = () => {
  const [documents, setDocuments] = useState([]); // Liste des documents récupérés
  const [showUploader, setShowUploader] = useState(false); // Contrôle du champ d'upload
  const [selectedFile, setSelectedFile] = useState(null); // Fichier sélectionné

  // Récupérer la liste des documents
  useEffect(() => {
    const fetchDocuments = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Vous devez être connecté pour voir les documents.');
        return;
      }

      try {
        const result = await apiRequest('GET', '/api/documents', null, token);
        if (Array.isArray(result.documents)) {
          setDocuments(result.documents);
        } else {
          console.error('Erreur : Les documents ne sont pas dans le format attendu.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des documents:', error.message);
      }
    };

    fetchDocuments();
  }, []);

  // Gérer la sélection d'un fichier
  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log(selectedFile);
  };

  const toggleForm = () => {
    setShowUploader(!showUploader);
    setSelectedFile(null);
  };

  const resetForm = () => {
    setSelectedFile(null);
  };

  // Gérer l'upload du fichier
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Veuillez sélectionner un fichier avant de l\'enregistrer.');
      return;
    }

    const formData = new FormData();
    formData.append('document', selectedFile);

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour ajouter un document.');
      return;
    }

    try {
      const result = await apiRequest('POST', '/api/documents/add', formData, token);

      if (result && result.message === 'Document téléchargé avec succès.') {
        // Ajouter le nouveau document à la liste existante
        setDocuments((prevDocuments) => [
          ...prevDocuments,
          {
            filename: result.newDocument.filename,
            filePath: result.newDocument.filePath,
            originalname: result.newDocument.originalname,
            _id: result.newDocument._id,
          },
        ]);
        toggleForm();
      } else {
        console.error('Erreur lors du téléchargement du document:', result);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement du document:', error);
    }
  };

  // Fonction de gestion de la suppression d'un document
  const handleDeleteDocument = async (documentId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour supprimer un document.');
      return;
    }

    // Demander la confirmation avant de supprimer
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?');

    if (!confirmDelete) {
      return; // Si l'utilisateur annule, on sort de la fonction
    }

    try {
      const result = await apiRequest('DELETE', `/api/documents/delete/${documentId}`, null, token);
      
      if (result.message === 'Document supprimé avec succès.') {
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc._id !== documentId) // Utilisation de _id
        );
      } else {
        alert('Erreur lors de la suppression du document.');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      alert('Erreur lors de la suppression du document.');
    }
  };

  // Fonction pour obtenir le logo en fonction du type de fichier
  const getFileLogo = (file) => {
    const fileName = file?.name;
    const fileExtension = fileName?.split('.').pop().toLowerCase();
    
    if (fileExtension === 'pdf') return pdfLogo;
    if (fileExtension === 'doc') return docLogo;
    if (fileExtension === 'docx') return docLogo;
    if (fileExtension === 'jpg' || imgLogo === 'jpeg') return imgLogo;
    if (fileExtension === 'png') return imgLogo;
    if (fileExtension === 'txt') return txtLogo;

    return imagePreviewDefault; // Logo par défaut si type non reconnu
  };

  return (
    <div className="section w-50">
      <div className="section-title">
        <h2>📁 Historique Médical</h2>
        <button className="add-btn" onClick={() => setShowUploader(!showUploader)}>+</button>
      </div>

      {/* Afficher le champ de téléchargement si demandé */}
      {showUploader && (
        <div className="modal-overlay">
          <div className="modal-content upload-section">
            <h3>Ajouter un document</h3>
            <button className="canceled-form-btn" type="button" onClick={toggleForm}>X</button>
            <form className="form-file" onSubmit={handleFileUpload}>
              <div className={selectedFile ? 'input-img-preview' : 'input-img'}>
                <div className={selectedFile ? 'input-file-preview' : 'input-file'}>
                  <p className="button-file">+ Ajouter un document</p>
                  <p className="infos-img-type">10mo max</p>
                </div>
                <input
                  className={selectedFile ? 'preview-active' : ''}
                  type="file"
                  name="image"
                  onChange={handleFileSelection}
                  accept=".pdf, .doc, .docx, .txt, .jpg, .png"
                />
                {selectedFile && (
                  <img
                    id="fileLogo"
                    src={getFileLogo(selectedFile)}
                    alt="Logo du fichier"
                    style={{
                      maxHeight: '110px',
                      position:'absolute',
                      maxWidth: '420px',
                      display: 'block',
                      margin: '0px auto',
                    }}
                  />
                )}
              </div>
              {selectedFile && (
                <div style={{display:'flex'}}>
                  <p>Document sélectionné: <strong>{selectedFile.name}</strong></p>
                  <button className="reset-form-file-btn" type="button" onClick={resetForm}>X</button>
                </div>
              )}
            {selectedFile ? <button type="submit">Ajouter le document</button> : ''}
            </form>
          </div>
        </div>
      )}

      <div className="documents-card">
        {documents.length === 0 ? (
          <p>Vous n'avez aucun document.</p>
        ) : (
          <ul>
            {documents.map((doc) => (
              <li className={doc._id} key={doc._id}>
                <a href={`${process.env.REACT_APP_SERVER_BACKEND_URL}${doc.filePath}`} target="_blank" rel="noopener noreferrer">
                  {doc.originalname}
                </a>
                <button onClick={() => handleDeleteDocument(doc._id)}>X</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoriqueMedical;