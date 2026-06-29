import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Col, Row } from 'react-bootstrap';
import './CommandeForm.module.css';

const ClientList = ({ onClientChange }) => { // Utilisez le nom correct de la prop passée

    const [clients, setClients] = useState([]);
    const [clientSelectionne, setClientSelectionne] = useState('');
    const [rechercheNomPrenom, setRechercheNomPrenom] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/clients');
            setClients(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des clients", error);
        }
    };

    const handleClientChange = (e) => {
        setClientSelectionne(e.target.value);
        onClientChange(e.target.value); // Utilisez la fonction passée par props pour mettre à jour l'état du composant parent
    };


    const handleRechercheNomPrenomChange = (e) => {
        setRechercheNomPrenom(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const filteredClients = clients.filter(client => {
        const fullName = ((client.nom || '') + ' ' + (client.prenom || '')).toLowerCase();
        const createdAt = new Date(client.created_at);
        const yearCondition = selectedYear ? createdAt.getFullYear() === parseInt(selectedYear) : true;
        const monthCondition = selectedMonth ? createdAt.getMonth() === parseInt(selectedMonth) - 1 : true;
        return fullName.includes(rechercheNomPrenom.toLowerCase()) &&
               yearCondition &&
               monthCondition;
    });

    return (
        <Row className="mb-1">

            <Col xs={12} md={3} className="client-selection">
                <Form.Group>
                    <Form.Control className='d-none' type="text" value={rechercheNomPrenom} onChange={handleRechercheNomPrenomChange} placeholder="Entrez le nom ou prénom du client" />
                </Form.Group>
            </Col>

            <Col xs={12} md={3} className="client-selection">
                <Form.Group>
                    <Form.Control className='d-none' as="select" value={selectedYear} onChange={handleYearChange}>
                        <option value="">Toutes les années</option>
                        {/* Créer une liste d'années à partir de 2025 à 2030 */}
                        {Array.from({ length: 7 }, (_, i) => (
                            <option key={i + 2025} value={i + 2025}>{i + 2025}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </Col>
            
            <Col xs={12} md={3} className="client-selection">
                <Form.Group>
                    <Form.Control as="select" value={selectedMonth} onChange={handleMonthChange} className='d-none'>
                        <option value="">Tous les mois</option>
                        {/* Créer une liste de mois de 1 à 12 */}
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </Col>

            <Col xs={12} md={3} className="client-selection">
                <Form.Group>
                   
                    <Form.Control as="select" defaultValue={clientSelectionne} onChange={handleClientChange}>

                        <option value="">Sélectionner un client</option>
                        {filteredClients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.nom} {client.prenom}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </Col>
        </Row>
    );
};

export default ClientList;
