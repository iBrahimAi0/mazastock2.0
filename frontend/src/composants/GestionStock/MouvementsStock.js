
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Alert } from 'react-bootstrap';
import { FiPlus, FiTruck } from 'react-icons/fi';
import './MouvementsStock.css';
const MouvementsStock = () => {
    const [mouvements, setMouvements] = useState([]);
    const [produitsEnStock, setProduitsEnStock] = useState([]);
    const [entrepots, setEntrepots] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentMouvement, setCurrentMouvement] = useState({ produitEnStockId: '', entrepotId: '', type_mouvement: '', quantite: '', date: '' });
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

    useEffect(() => {
        fetchMouvements();
        fetchProduitsEnStock();
        fetchEntrepots();
    }, []);

    const fetchMouvements = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/mouvements_stock');
            setMouvements(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des mouvements:', error);
        }
    };

    const fetchProduitsEnStock = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/produits_en_stock');
            setProduitsEnStock(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits en stock:', error);
        }
    };
    
    const fetchEntrepots = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/entrepots');
            setEntrepots(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des entrepôts:', error);
        }
    };
    

    const handleShow = (mouvement = null) => {
        if (mouvement) {
            setCurrentMouvement({
                id: mouvement.id,
                produitEnStockId: produitsEnStock.find((item) => item.id === mouvement.produit_id) || null,
                entrepotId: entrepots.find((item) => item.id === mouvement.entrepot_id) || null,
                type_mouvement: mouvement.type_mouvement,
                quantite: mouvement.quantite,
                date: new Date(mouvement.date) // Convertir en objet Date si nécessaire
            });
        } else {
            setCurrentMouvement({
                produitEnStockId: '',
                entrepotId: '',
                type_mouvement: '',
                quantite: '',
                date: new Date()
            });
        }
        setShowModal(true);
    };
    
    
    
    
    
    

    const handleClose = () => {
        setShowModal(false);
        setCurrentMouvement({ produitEnStockId: '', entrepotId: '', type_mouvement: '', quantite: '', date: new Date() });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = {
            produit_id: currentMouvement.produitEnStockId?.id ?? currentMouvement.produitEnStockId,
            entrepot_id: currentMouvement.entrepotId?.id ?? currentMouvement.entrepotId,
            type_mouvement: currentMouvement.type_mouvement,
            quantite: currentMouvement.quantite,
            date: currentMouvement.date instanceof Date ? currentMouvement.date.toISOString().substring(0, 10) : currentMouvement.date,
        };
    
        try {
            const method = currentMouvement.id ? 'put' : 'post';
            const url = currentMouvement.id
                ? `http://localhost:8000/api/mouvements_stock/${currentMouvement.id}`
                : 'http://localhost:8000/api/mouvements_stock';
    
            await axios[method](url, data);
    
            setAlert({
                show: true,
                message: `Mouvement ${currentMouvement.id ? 'modifié' : 'ajouté'} avec succès!`,
                variant: 'success'
            });
    
            fetchMouvements();
            handleClose();
        } catch (error) {
            console.error('Erreur lors de la soumission:', error.response ? error.response.data : error);
            setAlert({
                show: true,
                message: `Erreur lors de la soumission: ${error.response && error.response.data && error.response.data.detail ? error.response.data.detail : 'Erreur non spécifiée'}`,
                variant: 'danger'
            });
        }
    };
    
    
    




    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce mouvement ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/mouvements_stock/${id}`);
                setAlert({ show: true, message: 'Mouvement supprimé avec succès!', variant: 'success' });
                fetchMouvements();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                setAlert({ show: true, message: 'Erreur lors de la suppression du mouvement.', variant: 'danger' });
            }
        }
    };


    const typesDeMouvement = [
        { label: 'Entrée', value: 'entrée' },
        { label: 'Sortie', value: 'sortie' },
        { label: 'Transfert', value: 'transfert' },
        { label: 'Ajustement', value: 'ajustement' }
    ];

    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <Button 
                    label="Modifier" 
                    className="p-button-warning" 
                    style={{ borderRadius: '20px', flex: 1 }} 
                    onClick={() => handleShow(rowData)} 
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
            <Button label="Fermer" icon="pi pi-times" className="p-button-danger" style={{ borderRadius: '20px' }} onClick={handleClose} />
            <Button 
                label={currentMouvement.id ? 'Mettre à jour' : 'Ajouter'} 
                className="p-button-help" 
                style={{ borderRadius: '20px' }} 
                icon="pi pi-check" 
                onClick={handleSubmit}
            />
        </div>
    );

    return (
        <div className="mouvements-stock-container">
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}

            <div className="page-header">
                <div>
                    <h2 className="page-title">Mouvements de Stock</h2>
                    <p className="page-subtitle">Suivez les entrées et sorties</p>
                </div>
                <Button
                    label="Ajouter Mouvement"
                    icon={<FiPlus />}
                    className="p-button-help add-btn"
                    onClick={() => handleShow()}
                    style={{ borderRadius: '20px' }}
                />
            </div>

            <DataTable value={mouvements} responsive paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} className="modern-datatable">
                <Column sortable field="id" header={<FiTruck />} style={{ width: '60px' }} />
                <Column sortable field="nomProduit" header="Produit" />
                <Column sortable field="entrepot.nom" header="Entrepôt" />
                <Column sortable field="type_mouvement" header="Type de Mouvement" />
                <Column sortable field="quantite" header="Quantité" />
                <Column sortable field="date" header="Date" />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '200px' }} />
            </DataTable>

            <Dialog visible={showModal} style={{ width: '450px' }} header={currentMouvement.id ? 'Modifier Mouvement' : 'Ajouter Mouvement'} onHide={handleClose} footer={dialogFooter} className="modern-dialog">
                <form onSubmit={handleSubmit}>
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="produitEnStockId">Produit</label>
                            <Dropdown
                                value={currentMouvement.produitEnStockId}
                                options={produitsEnStock}
                                optionLabel="produit.nom"
                                onChange={(e) => setCurrentMouvement({ ...currentMouvement, produitEnStockId: e.value })}
                                placeholder="Sélectionnez un produit"
                            />
                        </div>
                        
                        {/* Product preview section */}
                        {currentMouvement.produitEnStockId && (
                            <div className="product-preview-section">
                                <div className="product-preview-content">
                                    <div className="product-preview-image">
                                        {currentMouvement.produitEnStockId.produit?.image_produit ? (
                                            <img 
                                                src={`http://localhost:8000/storage/${currentMouvement.produitEnStockId.produit.image_produit}`} 
                                                alt={currentMouvement.produitEnStockId.produit.nom}
                                                className="preview-thumbnail"
                                            />
                                        ) : (
                                            <div className="preview-placeholder">
                                                📦
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-preview-info">
                                        <h4 className="preview-name">{currentMouvement.produitEnStockId.produit?.nom || 'Produit'}</h4>
                                        <p className="preview-stock">Stock: {currentMouvement.produitEnStockId.quantite_actuelle || 0}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="p-field">
                            <label htmlFor="entrepotId">Entrepôt</label>
                            <Dropdown
                                value={currentMouvement.entrepotId}
                                options={entrepots}
                                optionLabel="nom"
                                onChange={(e) => setCurrentMouvement({ ...currentMouvement, entrepotId: e.value })}
                                placeholder="Sélectionnez un entrepôt"
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="type_mouvement">Type de Mouvement</label>
                            <Dropdown
                                value={currentMouvement.type_mouvement}
                                options={typesDeMouvement}
                                onChange={(e) => setCurrentMouvement({ ...currentMouvement, type_mouvement: e.value })}
                                optionLabel="label"
                                placeholder="Sélectionnez un type de mouvement"
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="quantite">Quantité</label>
                            <InputNumber id="quantite" value={currentMouvement.quantite} onChange={(e) => setCurrentMouvement({ ...currentMouvement, quantite: e.value })} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="date">Date</label>
                            <Calendar id="date" value={new Date(currentMouvement.date)} onChange={(e) => setCurrentMouvement({ ...currentMouvement, date: e.value })} />
                        </div>
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default MouvementsStock;
