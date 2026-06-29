import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Alert } from 'react-bootstrap';
import { FiPlus, FiPackage } from 'react-icons/fi';

const Entrepots = () => {
    const [entrepots, setEntrepots] = useState([]);
    const [show, setShow] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEntrepot, setCurrentEntrepot] = useState({ nom: '', adresse: '' });
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState('');

    useEffect(() => {
        fetchEntrepots();
    }, []);

    const fetchEntrepots = async () => {
        try {
            const { data } = await axios.get('http://localhost:8000/api/entrepots');
            setEntrepots(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des entrepôts:', error);
        }
    };

    const handleClose = () => {
        setShow(false);
        setIsEditing(false);
        resetForm();
    };

    const handleShow = (entrepot = { nom: '', adresse: '' }) => {
        setCurrentEntrepot(entrepot);
        setIsEditing(!!entrepot.id);
        setShow(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name) {
            setCurrentEntrepot(prev => ({ ...prev, [name]: value }));
        }
    };
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8000/api/entrepots/${currentEntrepot.id}`, currentEntrepot);
                setAlert({ show: true, message: 'Entrepôt modifié avec succès.', type: 'success' });
                setToastSeverity('success');
                setToastMessage('Entrepôt modifié avec succès.');
            } else {
                await axios.post('http://localhost:8000/api/entrepots', currentEntrepot);
                setAlert({ show: true, message: 'Entrepôt ajouté avec succès.', type: 'success' });
                setToastSeverity('success');
                setToastMessage('Entrepôt ajouté avec succès.');
            }
            fetchEntrepots();
            handleClose();
            setToastVisible(true);
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            setAlert({ show: true, message: 'Erreur lors de la soumission de l\'entrepôt.', type: 'danger' });
            setToastSeverity('error');
            setToastMessage('Erreur lors de la soumission de l\'entrepôt.');
            setToastVisible(true);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/entrepots/${id}`);
            fetchEntrepots();
            setAlert({ show: true, message: 'Entrepôt supprimé avec succès.', type: 'success' });
            setToastSeverity('success');
            setToastMessage('Entrepôt supprimé avec succès.');
            setToastVisible(true);
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            setAlert({ show: true, message: 'Erreur lors de la suppression de l\'entrepôt.', type: 'danger' });
            setToastSeverity('error');
            setToastMessage('Erreur lors de la suppression de l\'entrepôt.');
            setToastVisible(true);
        }
    };

    const resetForm = () => {
        setCurrentEntrepot({ nom: '', adresse: '' });
    };


    return (
        <div className="mt-3">
            <Alert show={alert.show} variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                {alert.message}
            </Alert>
            <Toast visible={toastVisible} severity={toastSeverity} onClose={() => setToastVisible(false)} life={3000}>
                {toastMessage}
            </Toast>

            <Button label="Ajouter un entrepôt" icon={<FiPlus />} className="p-button-secondary mb-3" style={{ borderRadius: '20px' }} onClick={() => handleShow()} />

            <DataTable value={entrepots} responsive paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                <Column sortable field="id" header={<FiPackage />} />
                <Column sortable field="nom" header="Nom" />
                <Column sortable field="adresse" header="Adresse" />
                <Column header="Actions" body={(rowData) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button label="Modifier" className="p-button-warning p-mr-2" style={{ borderRadius: '20px' }} onClick={() => handleShow(rowData)} />
                        <Button label="Supprimer" className="p-button-danger" style={{ borderRadius: '20px' }} onClick={() => handleDelete(rowData.id)} />
                    </div>
                )} />
            </DataTable>

            <Dialog visible={show} style={{ width: '450px' }} header={isEditing ? 'Modifier un entrepôt' : 'Ajouter un entrepôt'} onHide={handleClose}>
                <form onSubmit={handleSubmit}>
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="nom">Nom</label>
                            <InputText id="nom" name="nom" value={currentEntrepot.nom} onChange={handleChange} required />

                        </div>
                        <div className="p-field">
                            <label htmlFor="adresse">Adresse</label>
                            <InputText id="adresse" name="adresse" value={currentEntrepot.adresse} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="p-dialog-footer mt-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button label="Fermer" icon="pi pi-times" className="p-button-danger" style={{ borderRadius: '20px' }} onClick={handleClose} />
                        <Button label={isEditing ? 'Mettre à jour' : 'Ajouter'} className={isEditing ? 'p-button-warning p-mr-2' : 'p-button-secondary p-mr-2'} style={{ borderRadius: '20px' }} icon="pi pi-check" type="submit" />
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default Entrepots;
