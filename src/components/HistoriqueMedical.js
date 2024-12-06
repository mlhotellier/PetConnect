import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api'; // Assurez-vous que apiRequest est correctement configuré
import '../styles/styles.css';
import '../styles/utils.css';

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
        console.log('Documents récupérés:', result.documents);
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
  };

  // Gérer l'upload du fichier
  const handleFileUpload = async () => {
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

      if (result && result.filePath) {
        // Ajouter le nouveau document à la liste existante
        setDocuments((prevDocuments) => [
          ...prevDocuments,
          {
            filename: result.newDocument.filename,
            filePath: result.newDocument.filePath,
            originalname: result.newDocument.originalname,
          },
        ]);
        setSelectedFile(null);
        setShowUploader(false);
      } else {
        console.error('Erreur lors du téléchargement du document:', result);
        alert('Erreur lors du téléchargement du document.');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement du document:', error);
      alert('Erreur lors du téléchargement du document.');
    }
  };

  return (
    <div className="section w-50">
      <div className="section-title">
        <h2>📁 Historique Médical</h2>
        <button className="add-btn" onClick={() => setShowUploader(!showUploader)}>+</button>
      </div>

      {/* Afficher le champ de téléchargement si demandé */}
      {showUploader && (
        <div className="upload-section">
          <input
            type="file"
            onChange={handleFileSelection}
            accept=".pdf, .doc, .docx, .txt, .jpg, .png"
          />
          <button onClick={handleFileUpload}>Enregistrer le doc</button>
          <button onClick={() => setShowUploader(false)}>Annuler</button>
        </div>
      )}

      <div className="documents-card">
        {documents.length === 0 ? (
          <p>Vous n'avez aucun document.</p>
        ) : (
          <ul>
            {documents.map((doc) => (
              <li key={doc.filePath}>
                <a href={`${process.env.REACT_APP_SERVER_BACKEND_URL}${doc.filePath}`} target="_blank" rel="noopener noreferrer">
                  {doc.originalname}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoriqueMedical;