import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Card, Button, Form, InputGroup, Table, Row, Col, Badge } from 'react-bootstrap';
import { FiSearch, FiCalendar, FiX, FiTrendingUp, FiDollarSign, FiCreditCard, FiFileText } from 'react-icons/fi';
import './LesVentes.css';

const LesVentes = () => {
    const [ventes, setVentes] = useState([]);
    const [methodePaiementFiltre, setMethodePaiementFiltre] = useState('');
    const [filtre, setFiltre] = useState('');
    const [dates, setDates] = useState({ startDate: null, endDate: null });

    const chargerVentes = useCallback(async () => {
        let params = { methodePaiement: methodePaiementFiltre };
        try {
            const response = await axios.get(`http://localhost:8000/api/ventes`, { params });
            const filteredData = response.data.filter(vente => {
                const date = new Date(vente.created_at);
                const start = dates.startDate;
                const end = dates.endDate;
                return (!start || date >= start) && (!end || date <= end);
            });
            setVentes(filteredData);
        } catch (error) {
            console.error("Erreur lors de la récupération des données de ventes", error);
        }
    }, [methodePaiementFiltre, dates.startDate, dates.endDate]);

    useEffect(() => {
        chargerVentes();
    }, [chargerVentes]);

    const statCards = [
        { 
            icon: <FiDollarSign />, 
            title: "Espèces", 
            methode: "espèces", 
            color: "success",
            bgColor: "linear-gradient(135deg, #10b981, #34d399)"
        },
        { 
            icon: <FiCreditCard />, 
            title: "Carte bancaire", 
            methode: "carte", 
            color: "primary",
            bgColor: "linear-gradient(135deg, #6366f1, #8b5cf6)"
        },
        { 
            icon: <FiFileText />, 
            title: "Chèque", 
            methode: "Chèque", 
            color: "warning",
            bgColor: "linear-gradient(135deg, #f59e0b, #fbbf24)"
        },
        { 
            icon: <FiTrendingUp />, 
            title: "Total général", 
            methode: "", 
            color: "info",
            bgColor: "linear-gradient(135deg, #0ea5e9, #38bdf8)"
        }
    ];

    const handleCardClick = (methode) => {
        setMethodePaiementFiltre(methode);
    };

    const handleFilterChange = (e) => {
        setFiltre(e.target.value.toLowerCase());
    };

    const totauxVentes = useMemo(() => {
        let totaux = { "espèces": 0, "carte": 0, "Chèque": 0, "total": 0 };
        ventes.forEach(vente => {
            if (vente.paiement && vente.paiement.methode) {
                const montant = parseFloat(vente.paiement.total);
                if (!isNaN(montant)) {
                    const method = vente.paiement.methode;
                    totaux[method] = (totaux[method] || 0) + montant;
                    totaux["total"] += montant;
                }
            }
        });
        return totaux;
    }, [ventes]);

    const filteredVentes = useMemo(() => {
        if (!filtre) return ventes;
        return ventes.filter((vente) => {
            const client = `${vente.client?.nom || ''} ${vente.client?.prenom || ''}`.toLowerCase();
            return client.includes(filtre) || vente.id.toString().includes(filtre);
        });
    }, [ventes, filtre]);

    const getPaymentBadge = (methode) => {
        const badges = {
            'espèces': { bg: 'success', text: 'Espèces' },
            'carte': { bg: 'primary', text: 'Carte' },
            'Chèque': { bg: 'warning', text: 'Chèque' }
        };
        const badge = badges[methode] || { bg: 'secondary', text: methode };
        return <Badge bg={badge.bg}>{badge.text}</Badge>;
    };

    return (
        <div className="les-ventes-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Tableau de Bord des Ventes</h2>
                    <p className="page-subtitle">Suivez vos ventes et paiements en temps réel</p>
                </div>
            </div>

            <Row className="stats-grid mb-4">
                {statCards.map((card, idx) => (
                    <Col key={idx} xs={12} sm={6} lg={3}>
                        <Card 
                            className={`stat-card stat-card-${card.color} ${methodePaiementFiltre === card.methode ? 'active' : ''}`}
                            onClick={() => handleCardClick(card.methode)}
                        >
                            <Card.Body>
                                <div className="stat-icon">
                                    {card.icon}
                                </div>
                                <div className="stat-content">
                                    <h6 className="stat-title">{card.title}</h6>
                                    <h4 className="stat-value">
                                        {card.methode === "" 
                                            ? totauxVentes["total"].toFixed(2) 
                                            : (totauxVentes[card.methode] || 0).toFixed(2)} 
                                        <span className="stat-currency">MAD</span>
                                    </h4>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card className="filters-card mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col xs={12} md={4}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FiSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Rechercher un client ou une commande..."
                                    value={filtre}
                                    onChange={handleFilterChange}
                                />
                            </InputGroup>
                        </Col>
                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                            <div className="date-filters">
                                <InputGroup className="date-input">
                                    <InputGroup.Text>
                                        <FiCalendar />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="date"
                                        value={dates.startDate ? dates.startDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => setDates({ ...dates, startDate: e.target.value ? new Date(e.target.value) : null })}
                                    />
                                </InputGroup>
                                <span className="date-separator">au</span>
                                <InputGroup className="date-input">
                                    <InputGroup.Text>
                                        <FiCalendar />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="date"
                                        value={dates.endDate ? dates.endDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => setDates({ ...dates, endDate: e.target.value ? new Date(e.target.value) : null })}
                                    />
                                </InputGroup>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => setDates({ startDate: null, endDate: null })}
                                    className="reset-btn"
                                >
                                    <FiX /> Réinitialiser
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="table-card">
                <Card.Body>
                    <div className="table-responsive">
                        <Table hover className="modern-table">
                            <thead>
                                <tr>
                                    <th>Commande N°</th>
                                    <th>Date</th>
                                    <th>Client</th>
                                    <th>Total</th>
                                    <th>Méthode</th>
                                    <th>Détails</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVentes.map(vente => (
                                    <tr key={vente.id}>
                                        <td className="fw-semibold">#{vente.id}</td>
                                        <td>{new Date(vente.created_at).toLocaleDateString('fr-FR')}</td>
                                        <td>
                                            <div className="client-name">
                                                {vente.client?.nom} {vente.client?.prenom}
                                            </div>
                                        </td>
                                        <td className="fw-semibold text-success">
                                            {parseFloat(vente.paiement?.total || 0).toFixed(2)} MAD
                                        </td>
                                        <td>{getPaymentBadge(vente.paiement?.methode)}</td>
                                        <td>
                                            <div className="details-cell">
                                                {vente.details?.map((detail, idx) => (
                                                    <div key={idx} className="detail-item">
                                                        {detail.produit?.nom} - {detail.quantite} x {detail.prix} MAD
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredVentes.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-4">
                                            Aucune vente trouvée
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default LesVentes;
