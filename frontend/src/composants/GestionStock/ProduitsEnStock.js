import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Alert } from 'react-bootstrap';
import { FiPlus, FiBox, FiPackage } from 'react-icons/fi';
import './ProduitsEnStock.css';

const ProduitsEnStock = () => {
    const [produitsEnStock, setProduitsEnStock] = useState([]);
    const [produits, setProduits] = useState([]);
    const [show, setShow] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduit, setSelectedProduit] = useState(null);
    const [quantiteInitiale, setQuantiteInitiale] = useState('');
    const [quantiteActuelle, setQuantiteActuelle] = useState('');
    const [prixVente, setPrixVente] = useState('');
    const [currentId, setCurrentId] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [stockResponse, productsResponse] = await Promise.all([
            axios.get('/api/produits_en_stock'),
            axios.get('/api/produits'),
        ]);
        setProduitsEnStock(stockResponse.data);
        setProduits(productsResponse.data.filter(
            (product) => !stockResponse.data.some((stock) => stock.produit_id === product.id)
        ));
    };

    const fetchProduitsEnStock = async () => {
        const res = await axios.get('http://localhost:8000/api/produits_en_stock');
        setProduitsEnStock(res.data);
    };

    const handleClose = () => {
        setShow(false);
        setIsEditing(false);
        resetForm();
    };

    const handleShow = (produitEnStock = null) => {
        if (produitEnStock) {
            setIsEditing(true);
            setCurrentId(produitEnStock.id);
            setQuantiteInitiale(produitEnStock.quantite_initiale);
            setQuantiteActuelle(produitEnStock.quantite_actuelle);
            setPrixVente(produitEnStock.prix_vente);
    
            // Trouver le produit correspondant dans la liste des produits
            const produit = produits.find(p => p.id === produitEnStock.produit_id);
            setSelectedProduit(produit); // Sélectionner le produit correspondant
        } else {
            setIsEditing(false);
            setCurrentId(null);
            resetForm();
        }
        setShow(true);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedProduit || !selectedProduit.id) {
            setAlert({ show: true, message: 'Veuillez sélectionner un produit.', type: 'danger' });
            return;
        }
        
        const data = {
            produit_id: selectedProduit.id,
            quantite_initiale: quantiteInitiale,
            quantite_actuelle: quantiteActuelle,
            prix_vente: prixVente,
        };

        try {
            if (isEditing) {
                await axios.put(`http://localhost:8000/api/produits_en_stock/${currentId}`, data);
                setAlert({ show: true, message: 'Produit en stock mis à jour avec succès.', type: 'success' });
                setToastSeverity('success');
                setToastMessage('Produit en stock mis à jour avec succès.');
            } else {
                await axios.post('http://localhost:8000/api/produits_en_stock', data);
                setAlert({ show: true, message: 'Produit ajouté en stock avec succès.', type: 'success' });
                setToastSeverity('success');
                setToastMessage('Produit ajouté en stock avec succès.');
            }
            loadData();
            handleClose();
            setToastVisible(true);
        } catch (error) {
            console.error('Erreur lors de l\'ajout/mise à jour du produit en stock', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erreur lors de l\'ajout/mise à jour du produit.';
            setAlert({ show: true, message: errorMessage, type: 'danger' });
            setToastSeverity('error');
            setToastMessage(errorMessage);
            setToastVisible(true);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit du stock ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/produits_en_stock/${id}`);
                setAlert({ show: true, message: 'Produit en stock supprimé avec succès.', type: 'success' });
                loadData();
                setToastSeverity('success');
                setToastMessage('Produit en stock supprimé avec succès.');
                setToastVisible(true);
            } catch (error) {
                console.error('Erreur lors de la suppression du produit en stock', error);
                setAlert({ show: true, message: 'Erreur lors de la suppression du produit.', type: 'danger' });
                setToastSeverity('error');
                setToastMessage('Erreur lors de la suppression du produit.');
                setToastVisible(true);
            }
        }
    };

    const resetForm = () => {
        setSelectedProduit(null);
        setQuantiteInitiale('');
        setQuantiteActuelle('');
        setPrixVente('');
        setCurrentId(null);
    };

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

    const imageBodyTemplate = (rowData) => {
        const defaultImage = 'data:image/svg+xml,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
            <rect fill="#f1f5f9" width="50" height="50"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="20">📦</text>
          </svg>
        `);
        
        const imageUrl = rowData.produit?.image_produit 
          ? `http://localhost:8000/storage/${rowData.produit.image_produit}`
          : defaultImage;

        return (
          <div className="product-image-cell">
            <img 
              src={imageUrl} 
              alt={rowData.produit?.nom || 'Produit'} 
              className="product-thumbnail"
              onError={(e) => { e.target.src = defaultImage; }}
            />
          </div>
        );
    };

    const dialogFooter = (
        <div className="p-dialog-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button label="Fermer" icon="pi pi-times" className="p-button-danger" style={{ borderRadius: '20px' }} onClick={handleClose} />
            <Button 
                label={isEditing ? 'Mettre à jour' : 'Ajouter'} 
                className={isEditing ? 'p-button-warning' : 'p-button-secondary'}  
                style={{ borderRadius: '20px' }} 
                icon="pi pi-check" 
                onClick={handleSubmit}
            />
        </div>
    );

    return (
        <div className="produits-stock-container">
            <Alert show={alert.show} variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                {alert.message}
            </Alert>
            <Toast visible={toastVisible} severity={toastSeverity} onClose={() => setToastVisible(false)} life={3000}>
                {toastMessage}
            </Toast>

            <div className="page-header">
                <div>
                    <h2 className="page-title">Produits en Stock</h2>
                    <p className="page-subtitle">Gérez votre inventaire</p>
                </div>
                <Button 
                    label="Ajouter un produit" 
                    icon={<FiPlus />} 
                    className="p-button-secondary add-btn" 
                    style={{ borderRadius: '20px' }} 
                    onClick={() => handleShow()}
                />
            </div>



            <DataTable value={produitsEnStock} responsive paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} className="modern-datatable">
                <Column body={imageBodyTemplate} header="Image" style={{ width: '80px' }} />
                <Column sortable field="id" header={<FiBox />} style={{ width: '60px' }} />
                <Column sortable field="produit.nom" header="Produit" />
                <Column sortable field="quantite_initiale" header="Quantité Initiale" />
                <Column sortable field="quantite_actuelle" header="Quantité Actuelle" />
                <Column sortable field="prix_vente" header="Prix de Vente" />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '200px' }} />
            </DataTable>
            <Dialog visible={show} style={{ width: '450px' }} header={isEditing ? 'Modifier le produit en stock' : 'Ajouter un produit en stock'} onHide={handleClose} footer={dialogFooter} className="modern-dialog">
                <form onSubmit={handleSubmit}>
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="produitSelect">Produit</label>
                            <Dropdown id="produitSelect" value={selectedProduit} options={produits} optionLabel="nom" onChange={(e) => setSelectedProduit(e.value)} placeholder="Sélectionnez un produit" showClear required />
                        </div>
                        <div className="p-field">
                            <label htmlFor="quantiteInitiale">Quantité Initiale</label>
                            <InputNumber id="quantiteInitiale" value={quantiteInitiale} onValueChange={(e) => setQuantiteInitiale(e.value)} required />
                        </div>
                        <div className="p-field">
                            <label htmlFor="quantiteActuelle">Quantité Actuelle</label>
                            <InputNumber id="quantiteActuelle" value={quantiteActuelle} onValueChange={(e) => setQuantiteActuelle(e.value)} required />
                        </div>
                        <div className="p-field">
                            <label htmlFor="prixVente">Prix de Vente</label>
                            <InputNumber id="prixVente" value={prixVente} onValueChange={(e) => setPrixVente(e.value)} mode="currency" currency="MAD" locale="fr-FR" required />
                        </div>
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default ProduitsEnStock;
