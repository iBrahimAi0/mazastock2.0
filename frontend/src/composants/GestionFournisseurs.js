import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Modal, Card, Container, Row, Col, InputGroup, Table, Button as BootstrapButton } from 'react-bootstrap';
import { FiEdit2, FiPlus, FiUser, FiMail, FiPhone, FiHome, FiSearch, FiTrash2 } from 'react-icons/fi';
import './GestionFournisseurs.css';

const GestionFournisseurs = () => {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [filteredFournisseurs, setFilteredFournisseurs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFournisseur, setCurrentFournisseur] = useState({ id: null, nom: '', adresse: '', telephone: '', email: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

    useEffect(() => {
        fetchFournisseurs();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = fournisseurs.filter(fournisseur =>
                fournisseur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fournisseur.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fournisseur.telephone.includes(searchTerm)
            );
            setFilteredFournisseurs(filtered);
        } else {
            setFilteredFournisseurs(fournisseurs);
        }
    }, [searchTerm, fournisseurs]);

    const fetchFournisseurs = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/fournisseurs');
            setFournisseurs(response.data);
            setFilteredFournisseurs(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des fournisseurs:", error);
        }
    };

    const handleShow = (fournisseur = { nom: '', adresse: '', telephone: '', email: '' }, editing = false) => {
        setCurrentFournisseur(fournisseur);
        setIsEditing(editing);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setCurrentFournisseur({ nom: '', adresse: '', telephone: '', email: '' });
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentFournisseur({ ...currentFournisseur, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8000/api/fournisseurs/${currentFournisseur.id}`, currentFournisseur);
            } else {
                await axios.post('http://localhost:8000/api/fournisseurs', currentFournisseur);
            }
            fetchFournisseurs();
            handleClose();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du fournisseur:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/fournisseurs/${id}`);
                fetchFournisseurs();
            } catch (error) {
                console.error("Erreur lors de la suppression du fournisseur:", error);
            }
        }
    };

    return (
        <Container fluid className="fournisseurs-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Gestion des Fournisseurs</h2>
                    <p className="page-subtitle">Gérez vos fournisseurs et contacts</p>
                </div>
                <div className="header-actions">
                    <BootstrapButton 
                        variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="me-2"
                    >
                        Grille
                    </BootstrapButton>
                    <BootstrapButton 
                        variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
                        size="sm"
                        onClick={() => setViewMode('table')}
                        className="me-2"
                    >
                        Tableau
                    </BootstrapButton>
                    <BootstrapButton className="btn-primary" onClick={() => handleShow()}>
                        <FiPlus /> Nouveau Fournisseur
                    </BootstrapButton>
                </div>
            </div>

            <Card className="search-card">
                <InputGroup>
                    <InputGroup.Text>
                        <FiSearch />
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Rechercher un fournisseur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
            </Card>

            {viewMode === 'grid' ? (
                <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                    {filteredFournisseurs.map(fournisseur => (
                        <Col key={fournisseur.id}>
                            <Card className="fournisseur-card">
                                <Card.Body>
                                    <div className="card-header-icon">
                                        <div className="icon-circle">
                                            <FiUser />
                                        </div>
                                    </div>
                                    <Card.Title className="text-center mt-3">{fournisseur.nom}</Card.Title>
                                    <Card.Text className="fournisseur-details">
                                        <div className="detail-item">
                                            <FiHome /> <span>{fournisseur.adresse || 'Non renseigné'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <FiPhone /> <span>{fournisseur.telephone}</span>
                                        </div>
                                        <div className="detail-item">
                                            <FiMail /> <span>{fournisseur.email}</span>
                                        </div>
                                    </Card.Text>
                                    <div className="card-actions">
                                        <BootstrapButton 
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={() => handleShow(fournisseur, true)}
                                            className="action-btn"
                                        >
                                            <FiEdit2 /> Modifier
                                        </BootstrapButton>
                                        <BootstrapButton 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleDelete(fournisseur.id)}
                                            className="action-btn"
                                        >
                                            <FiTrash2 /> Supprimer
                                        </BootstrapButton>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                    {filteredFournisseurs.length === 0 && (
                        <Col xs={12}>
                            <div className="text-center text-muted py-5">
                                Aucun fournisseur trouvé
                            </div>
                        </Col>
                    )}
                </Row>
            ) : (
                <Card className="table-card">
                    <div className="table-responsive">
                        <Table hover className="modern-table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Adresse</th>
                                    <th>Téléphone</th>
                                    <th>Email</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFournisseurs.map(fournisseur => (
                                    <tr key={fournisseur.id}>
                                        <td className="fw-semibold">{fournisseur.nom}</td>
                                        <td className="text-muted">{fournisseur.adresse || '-'}</td>
                                        <td>{fournisseur.telephone}</td>
                                        <td>{fournisseur.email}</td>
                                        <td className="text-end">
                                            <div className="action-buttons">
                                                <BootstrapButton 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => handleShow(fournisseur, true)}
                                                    className="action-btn"
                                                >
                                                    <FiEdit2 />
                                                </BootstrapButton>
                                                <BootstrapButton 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleDelete(fournisseur.id)}
                                                    className="action-btn"
                                                >
                                                    <FiTrash2 />
                                                </BootstrapButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredFournisseurs.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted py-4">
                                            Aucun fournisseur trouvé
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            )}

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Modifier' : 'Ajouter'} un fournisseur</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label><FiUser /> Nom</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Entrez le nom" 
                                name="nom" 
                                value={currentFournisseur.nom} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FiHome /> Adresse</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Entrez l'adresse" 
                                name="adresse" 
                                value={currentFournisseur.adresse} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FiPhone /> Téléphone</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Entrez le numéro de téléphone" 
                                name="telephone" 
                                value={currentFournisseur.telephone} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FiMail /> Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Entrez l'email" 
                                name="email" 
                                value={currentFournisseur.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>
                        <div className="modal-footer justify-content-between">
                            <BootstrapButton variant="outline-secondary" onClick={handleClose}>
                                Annuler
                            </BootstrapButton>
                            <BootstrapButton variant="primary" type="submit">
                                {isEditing ? 'Mettre à jour' : 'Créer'}
                            </BootstrapButton>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default GestionFournisseurs;
