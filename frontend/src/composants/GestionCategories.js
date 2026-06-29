import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Alert, Container, Card, Table, InputGroup } from 'react-bootstrap';
import { FiPlusCircle, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import './GestionCategories.css';

const GestionCategories = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalCategory, setModalCategory] = useState({ id: '', nom: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = categories.filter(cat =>
                cat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(categories);
        }
    }, [searchTerm, categories]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/categories');
            setCategories(response.data);
            setFilteredCategories(response.data);
        } catch (error) {
            setAlert({ show: true, message: "Erreur lors de la récupération des catégories.", variant: 'danger' });
        }
    };

    const handleShow = (category = { id: '', nom: '', description: '' }, editing = false) => {
        setModalCategory(category);
        setIsEditing(editing);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setModalCategory(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const actionUrl = `http://localhost:8000/api/categories/${isEditing ? `${modalCategory.id}` : ''}`;
        const method = isEditing ? 'put' : 'post';

        try {
            await axios[method](actionUrl, modalCategory);
            fetchCategories();
            handleClose();
            setAlert({ show: true, message: `Catégorie ${isEditing ? 'modifiée' : 'ajoutée'} avec succès.`, variant: 'success' });
        } catch (error) {
            setAlert({ show: true, message: `Erreur lors de ${isEditing ? 'la modification' : "l'ajout"} d'une catégorie.`, variant: 'danger' });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/categories/${id}`);
            fetchCategories();
            setAlert({ show: true, message: "Catégorie supprimée avec succès.", variant: 'success' });
        } catch (error) {
            setAlert({ show: true, message: "Erreur lors de la suppression d'une catégorie.", variant: 'danger' });
        }
    };

    return (
        <Container fluid className="categories-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Gestion des Catégories</h2>
                    <p className="page-subtitle">Gérez vos catégories de produits</p>
                </div>
                <Button className="btn-primary" onClick={() => handleShow()}>
                    <FiPlusCircle /> Nouvelle Catégorie
                </Button>
            </div>

            <Alert show={alert.show} variant={alert.variant} dismissible onClose={() => setAlert({ ...alert, show: false })}>
                {alert.message}
            </Alert>

            <Card className="search-card">
                <InputGroup>
                    <InputGroup.Text>
                        <FiSearch />
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Rechercher une catégorie..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
            </Card>

            <Card className="table-card">
                <div className="table-responsive">
                    <Table hover className="modern-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Description</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map(category => (
                                <tr key={category.id}>
                                    <td className="fw-semibold">{category.nom}</td>
                                    <td className="text-muted">{category.description || '-'}</td>
                                    <td className="text-end">
                                        <div className="action-buttons">
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm"
                                                onClick={() => handleShow(category, true)}
                                                className="action-btn"
                                            >
                                                <FiEdit2 />
                                            </Button>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDelete(category.id)}
                                                className="action-btn"
                                            >
                                                <FiTrash2 />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCategories.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted py-4">
                                        Aucune catégorie trouvée
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Modifier' : 'Ajouter'} une catégorie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nom" 
                                value={modalCategory.nom} 
                                onChange={handleChange} 
                                required 
                                placeholder="Entrez le nom de la catégorie"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                name="description" 
                                value={modalCategory.description} 
                                onChange={handleChange}
                                placeholder="Entrez une description (optionnel)"
                            />
                        </Form.Group>
                        <div className="modal-footer justify-content-between">
                            <Button variant="outline-secondary" onClick={handleClose}>
                                Annuler
                            </Button>
                            <Button variant="primary" type="submit">
                                {isEditing ? 'Modifier' : 'Créer'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default GestionCategories;
