import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Card, Button, Table, Modal, Row, Col, Dropdown,InputGroup,Form,FormControl } from 'react-bootstrap';
import { FaSearch, FaTimesCircle } from 'react-icons/fa'; // Ajoutez ces icônes
import { FaInfoCircle } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faSpinner, faShippingFast } from '@fortawesome/free-solid-svg-icons';
import './StylesCommuns.css';
import ReactDOM from 'react-dom';

const CommandesList = () => {
    const [commandes, setCommandes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCommande, setSelectedCommande] = useState(null);
    const [filter, setFilter] = useState('');

const [searchTerm, setSearchTerm] = useState('');
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');

const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());
const handleStartDateChange = (e) => setStartDate(e.target.value);
const handleEndDateChange = (e) => setEndDate(e.target.value);

const handleFilterReset = () => {
  setStartDate('');
  setEndDate('');
  setSearchTerm('');
  // Reset le filtre pour afficher toutes les commandes
  setFilter('');
};

const filteredCommandes = useMemo(() => commandes.filter((commande) => {
  if (filter && commande.etat !== filter) return false;

  const clientName = `${commande.client?.nom || ''} ${commande.client?.prenom || ''}`.toLowerCase();
  if (searchTerm && !clientName.includes(searchTerm) && !commande.id.toString().includes(searchTerm)) {
    return false;
  }

  const date = new Date(commande.created_at);
  if (startDate && date < new Date(`${startDate}T00:00:00`)) return false;
  if (endDate && date > new Date(`${endDate}T23:59:59`)) return false;
  return true;
}), [commandes, filter, searchTerm, startDate, endDate]);




const DropdownMenuPortal = ({ children }) => {
  return ReactDOM.createPortal(
    children,
    document.body
  );
};


    useEffect(() => {
        fetchCommandes();
    }, []);

    const fetchCommandes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/commandes');
            setCommandes(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes', error);
        }
    };

    const handleShowDetails = (commande) => {
        setSelectedCommande(commande);
        setShowModal(true);
    };

    const handleChangeEtat = async (commandeId, newEtat) => {
        try {
            await axios.put(`http://localhost:8000/api/commandes/${commandeId}`, { etat: newEtat });
            const updatedCommandes = commandes.map(commande => commande.id === commandeId ? { ...commande, etat: newEtat } : commande);
            setCommandes(updatedCommandes);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'état de la commande', error);
        }
    };

    const findColorForState = (etat) => {
        const card = statCards.find(card => card.state === etat);
        return card ? card.color : "secondary";
    };

    const statCards = [
        { title: "En attente", state: "en attente", icon: faClock, color: "primary" },
        { title: "En cours de traitement", state: "en cours de traitement", icon: faSpinner, color: "danger" },
        { title: "Expédiée", state: "expédiée", icon: faShippingFast, color: "success" },
    ];

    return (
        <div> <br></br>
            <Row xs={1} md={4} className="g-4 mb-4 " role="button">
                {statCards.map((card, idx) => (
                    <Col key={idx}>
                        <Card className={`text-center shadow h-100 text-white bg-${card.color}`}>
                            <Card.Body onClick={() => setFilter(card.state)}>
                                <FontAwesomeIcon icon={card.icon} size="lg" />
                                <Card.Title>{card.title}</Card.Title>
                                <Card.Text>{commandes.filter(c => c.etat === card.state).length} commandes</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                <Col>
                    <Button variant="dark" onClick={() => setFilter('')} className="w-100 h-100">Voir toutes</Button>
                </Col>
            </Row>




            <Row className="mb-3">
  <Col>
    <InputGroup>
      <FormControl
        placeholder="Recherche..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <InputGroup.Text>
        <FaSearch />
      </InputGroup.Text>
    </InputGroup>
  </Col>
  <Col md="auto">
    <Form.Control
      type="date"
      value={startDate}
      onChange={handleStartDateChange}
    />
  </Col>
  <Col md="auto">
    <Form.Control
      type="date"
      value={endDate}
      onChange={handleEndDateChange}
    />
  </Col>
  <Col xs="auto">
    <Button variant="warning" onClick={handleFilterReset}>
      <FaTimesCircle /> Annuler
    </Button>
  </Col>
</Row>





            <Table striped bordered hover responsive className="table-clients">
                <thead>
                    <tr>
                        <th>ID Commande</th>
                        <th>Client</th>
                        <th>État</th>
                        <th>Date</th>
                        <th>Total à payer</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                
                <tbody>
                    {filteredCommandes.map(commande => (
                        <tr key={commande.id}>
                            <td>{commande.id}</td>
                            <td>{commande.client.nom + ' ' + commande.client.prenom}</td>


                            <td>
                            <Dropdown>
  <Dropdown.Toggle variant={findColorForState(commande.etat)} id="dropdown-basic">
    {commande.etat}
  </Dropdown.Toggle>

  <DropdownMenuPortal>
    <Dropdown.Menu style={{ position: 'absolute', zIndex: 1050 }}>
      <Dropdown.Item onClick={() => handleChangeEtat(commande.id, "en attente")}>En attente</Dropdown.Item>
      <Dropdown.Item onClick={() => handleChangeEtat(commande.id, "en cours de traitement")}>En cours de traitement</Dropdown.Item>
      <Dropdown.Item onClick={() => handleChangeEtat(commande.id, "expédiée")}>Expédiée</Dropdown.Item>
    </Dropdown.Menu>
  </DropdownMenuPortal>
</Dropdown>
</td>





                            <td>{new Date(commande.created_at).toLocaleDateString("fr-FR")}</td>
                            <td>{commande.details.reduce((total, item) => total + (parseInt(item.quantite, 10) * parseFloat(item.prix)), 0).toFixed(2)} MAD</td>
                            <td>
                                <Button variant="dark" onClick={() => handleShowDetails(commande)}>
                                    <FaInfoCircle /> Détails
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>



            {selectedCommande && (
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Détails de la commande {selectedCommande.id}</Modal.Title>
                    </Modal.Header>
                     <Modal.Body>
    <Table striped bordered hover>
        <thead>
            <tr className='text-center'>
                <th>Nom Produit</th> {/* Modifié de "ID Produit" à "Nom Produit" */}
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            {selectedCommande.details.map((detail) => (
                <tr key={detail.produit_id} className='text-center'>
                    {/* Assurez-vous que `detail.produit` contient le nom du produit */}
                    <td>{detail.produit.nom}</td> {/* Modifié pour afficher le nom du produit */}
                    <td>{detail.quantite}</td>
                    <td>{detail.prix} MAD</td>
                    <td>{(detail.quantite * detail.prix).toFixed(2)} MAD</td>
                </tr>
            ))}
        </tbody>
        <tfoot>
            <tr className='text-center'>
                <th colSpan="3">Total à payer</th>
                <th>{selectedCommande.details.reduce((total, item) => total + (item.quantite * item.prix), 0).toFixed(2)} MAD</th>
            </tr>
        </tfoot>
    </Table>
</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default CommandesList;
