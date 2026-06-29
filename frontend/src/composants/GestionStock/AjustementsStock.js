import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Alert } from 'react-bootstrap';
import { FaPlus, FaTag } from 'react-icons/fa';

const AjustementsStock = () => {
  const [ajustements, setAjustements] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAjustement, setCurrentAjustement] = useState({ id: '', mouvement_stock_id: '', raison: '', details: '' });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    fetchAjustements();
    fetchMouvements();
  }, []);

  const fetchAjustements = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/ajustements_stock');
      setAjustements(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des ajustements:', error);
    }
  };

  const fetchMouvements = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/mouvements_stock');
      setMouvements(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des mouvements:', error);
    }
  };

  const handleShow = (ajustement = {}) => {
    setCurrentAjustement({
      id: ajustement.id || '',
      mouvement_stock_id: ajustement.mouvement_stock_id || '',
      raison: ajustement.raison || '',
      details: ajustement.details || '',
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentAjustement({ id: '', mouvement_stock_id: '', raison: '', details: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAjustement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = currentAjustement.id ? 'put' : 'post';
    const url = currentAjustement.id
      ? `http://localhost:8000/api/ajustements_stock/${currentAjustement.id}`
      : 'http://localhost:8000/api/ajustements_stock';

    try {
      await axios[method](url, currentAjustement);
      setAlert({ show: true, message: `Ajustement ${currentAjustement.id ? 'modifié' : 'ajouté'} avec succès!`, variant: 'success' });
      fetchAjustements();
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setAlert({ show: true, message: 'Erreur lors de la soumission de l\'ajustement.', variant: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/ajustements_stock/${id}`);
      setAlert({ show: true, message: 'Ajustement supprimé avec succès!', variant: 'success' });
      fetchAjustements();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setAlert({ show: true, message: 'Erreur lors de la suppression de l\'ajustement.', variant: 'danger' });
    }
  };

  const dropdownOptions = mouvements.map(mouvement => ({
    label: `ID: ${mouvement.id}, Type: ${mouvement.type_mouvement}`,
    value: mouvement.id
  }));

  return (
    <div className="container">
      {alert.show && <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>{alert.message}</Alert>}
      <Button label="Ajouter Ajustement" icon={<FaPlus />} className="p-button-help mb-3" style={{ borderRadius: '20px', marginBottom: '10px' }} onClick={() => handleShow()} />
      <DataTable value={ajustements} responsive paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
        <Column sortable field="id" header={<FaTag />} />
        <Column sortable field="mouvement_stock_id" header="ID Mouvement" />
        <Column sortable field="raison" header="Raison" />
        <Column sortable field="details" header="Détails" />
        <Column header="Actions" body={(rowData) => (
         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button label="Modifier" className="p-button-warning p-mr-2" style={{ borderRadius: '20px' }} onClick={() => handleShow(rowData)} />
            <Button label="Supprimer" className="p-button-danger" style={{ borderRadius: '20px' }} onClick={() => handleDelete(rowData.id)} />
          </div>
        )} />
      </DataTable>
      <Dialog visible={showModal} onHide={handleClose} header={currentAjustement.id ? 'Modifier Ajustement' : 'Ajouter Ajustement'} style={{ width: '30vw' }}>
        <form onSubmit={handleSubmit}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="mouvement_stock_id">Mouvement de Stock</label>
            <Dropdown id="mouvement_stock_id" name="mouvement_stock_id" value={currentAjustement.mouvement_stock_id} options={dropdownOptions} onChange={handleChange} placeholder="Sélectionnez un mouvement" />
          </div>
          <div className="p-field">
            <label htmlFor="raison">Raison</label>
            <InputText id="raison" name="raison" value={currentAjustement.raison} onChange={handleChange} required />
          </div>
          <div className="p-field">
            <label htmlFor="details">Détails</label>
            <InputText id="details" name="details" value={currentAjustement.details} onChange={handleChange} />
          </div>
          <div className="p-dialog-footer mt-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button style={{ borderRadius: '20px' }} label="Fermer" icon="pi pi-times" className="p-button-secondary" onClick={handleClose} />
            <Button style={{ borderRadius: '20px' }} label={currentAjustement.id ? 'Mettre à jour' : 'Ajouter'} icon="pi pi-check" className="p-button-help" type="submit" />
          </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default AjustementsStock;
