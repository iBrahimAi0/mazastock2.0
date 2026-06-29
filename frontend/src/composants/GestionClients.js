import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import './GestionClients.css';

const GestionClients = () => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClient, setCurrentClient] = useState({ id: null, nom: '', prenom: '', email: '', telephone: '', adresse: '' });
  const toast = useRef(null);
  const [filtre, setFiltre] = useState('');

  const handleFilterChange = (event) => {
    setFiltre(event.target.value.toLowerCase());
  };

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
    }
  };

  const handleShow = (client = { nom: '', prenom: '', email: '', telephone: '', adresse: '' }, editing = false) => {
    setCurrentClient(client);
    setIsEditing(editing);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentClient({ nom: '', prenom: '', email: '', telephone: '', adresse: '' });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentClient({ ...currentClient, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:8000/api/clients/${isEditing ? currentClient.id : ''}`;
    const method = isEditing ? 'put' : 'post';
    try {
      await axios[method](url, currentClient);
      fetchClients();
      handleClose();
      const successMessage = isEditing ? 'Client mis à jour avec succès' : 'Client ajouté avec succès';
      showToast('success', 'Succès', successMessage);
    } catch (error) {
      console.error('Erreur lors du traitement du client:', error);
      showToast('error', 'Erreur', 'Erreur lors du traitement du client');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await axios.delete(`http://localhost:8000/api/clients/${id}`);
        fetchClients();
        showToast('success', 'Succès', 'Client supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression du client:', error);
        showToast('error', 'Erreur', 'Erreur lors de la suppression du client');
      }
    }
  };

  const clientsFiltres = clients.filter(client =>
    client.nom.toLowerCase().includes(filtre) ||
    client.prenom.toLowerCase().includes(filtre) ||
    client.email.toLowerCase().includes(filtre) ||
    client.telephone.includes(filtre) ||
    client.adresse.toLowerCase().includes(filtre)
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
        <Button 
          label="Modifier" 
          className="p-button-warning" 
          style={{ borderRadius: '20px', flex: 1 }} 
          onClick={() => handleShow(rowData, true)} 
        />
        <Button 
          label="Supprimer" 
          className="p-button-danger" 
          style={{ borderRadius: '20px', flex: 1 }} 
          onClick={() => handleDelete(rowData.id)} 
        />
      </div>
    );
  };

  const dialogFooter = (
    <div className="p-dialog-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button style={{ borderRadius: '20px' }} label="Fermer" icon="pi pi-times" onClick={handleClose} className="p-button-danger" />
      <Button style={{ borderRadius: '20px' }} className="p-button-help" label={isEditing ? 'Mettre à jour' : 'Ajouter'} icon="pi pi-check" onClick={handleSubmit} />
    </div>
  );

  return (
    <div className="gestion-clients-container">
      <Toast ref={toast} />
      
      <div className="page-header">
        <div>
          <h2 className="page-title">Gestion des Clients</h2>
          <p className="page-subtitle">Gérez votre base de clients</p>
        </div>
        <Button 
          severity="help" 
          label="Ajouter un client"  
          style={{ borderRadius: '20px' }} 
          icon={<FiUserPlus />}
          onClick={() => handleShow()} 
          className="add-client-btn"
        />
      </div>

      <div className="search-section">
        <div className="p-inputgroup">
          <InputText placeholder="Rechercher un client..." onChange={handleFilterChange} className="search-input" />
          <Button icon={<FiSearch />} className="p-button-help search-button" />
        </div>
      </div>

      <DataTable value={clientsFiltres} responsive paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} className="modern-datatable">
        <Column sortable field="nom" header="Nom" />
        <Column sortable field="prenom" header="Prénom" />
        <Column sortable field="email" header="Email" />
        <Column sortable field="telephone" header="Téléphone" />
        <Column sortable field="adresse" header="Adresse" />
        <Column body={actionBodyTemplate} header="Actions" style={{ width: '200px' }} />
      </DataTable>

      <Dialog visible={showModal} style={{ width: '450px' }} header={isEditing ? 'Modifier le client' : 'Ajouter un client'} onHide={handleClose} footer={dialogFooter} className="modern-dialog">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <div className="p-field">
              <label htmlFor="nom">Nom</label>
              <InputText id="nom" value={currentClient.nom} onChange={handleChange} name="nom" />
            </div>
            <div className="p-field">
              <label htmlFor="prenom">Prénom</label>
              <InputText id="prenom" value={currentClient.prenom} onChange={handleChange} name="prenom" />
            </div>
            <div className="p-field">
              <label htmlFor="email">Email</label>
              <InputText id="email" value={currentClient.email} onChange={handleChange} name="email" />
            </div>
            <div className="p-field">
              <label htmlFor="telephone">Téléphone</label>
              <InputText id="telephone" value={currentClient.telephone} onChange={handleChange} name="telephone" />
            </div>
            <div className="p-field">
              <label htmlFor="adresse">Adresse</label>
              <InputText id="adresse" value={currentClient.adresse} onChange={handleChange} name="adresse" />
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default GestionClients;
