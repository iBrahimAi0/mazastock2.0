import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Form, InputGroup, Table, Row, Col, Badge } from 'react-bootstrap';
import { FiFileText, FiDownload, FiCalendar, FiTrendingUp, FiTrendingDown, FiFilter } from 'react-icons/fi';
import './Rapports.css';

const RapportVentes = () => {
    const [typeRapport, setTypeRapport] = useState('produit');
    const [dateDebut, setDateDebut] = useState(null);
    const [dateFin, setDateFin] = useState(null);
    const [rapports, setRapports] = useState([]);
    const [tendancesProduit, setTendancesProduit] = useState([]);

    const fetchRapport = async () => {
        try {
            const endpoint = `http://localhost:8000/api/rapports/ventes-par-${typeRapport}`;
            const { data } = await axios.get(endpoint, {
                params: { dateDebut, dateFin }
            });
            setRapports(data);
        } catch (error) {
            console.error("Erreur lors de la récupération du rapport", error);
        }
    };

    const fetchTendancesProduit = async () => {
        try {
            const endpoint = `http://localhost:8000/api/rapports/tendances-produit-plus-vendu`;
            const { data } = await axios.get(endpoint, {
                params: { dateDebut, dateFin }
            });
            setTendancesProduit(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des tendances de vente", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchRapport();
        fetchTendancesProduit();
    };

    const exportPDF = () => {
        // Create a simple PDF export using window.print or a library
        const printContent = document.getElementById('rapport-content');
        if (printContent) {
            const originalTitle = document.title;
            document.title = 'Rapport des Ventes';
            window.print();
            document.title = originalTitle;
        }
    };

    const exportExcel = () => {
        // Export data to Excel format
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add sales report data
        csvContent += "Rapport des Ventes\n\n";
        csvContent += typeRapport === 'produit' ? "Produit,Quantité,Total Vente\n" : "Client,Quantité,Total Vente\n";
        
        rapports.forEach(row => {
            const name = typeRapport === 'produit' ? row.produit : row.clientNomComplet;
            csvContent += `${name},${row.quantite},${row.totalVente}\n`;
        });

        // Add trends data
        csvContent += "\nTendances du Produit le Plus Vendu\n\n";
        csvContent += "Produit,Quantité Vendue,Tendance\n";
        
        tendancesProduit.forEach(row => {
            csvContent += `${row.produit},${row.quantite_vendue},${row.tendance}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `rapport_ventes_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const reportOptions = [
        { label: 'Par Produit', value: 'produit' },
        { label: 'Par Client', value: 'client' }
    ];

    const getTrendBadge = (tendance) => {
        if (tendance === 'up') {
            return <Badge bg="success" className="trend-badge"><FiTrendingUp /> En hausse</Badge>;
        } else if (tendance === 'down') {
            return <Badge bg="danger" className="trend-badge"><FiTrendingDown /> En baisse</Badge>;
        }
        return <Badge bg="secondary">Stable</Badge>;
    };

    return (
        <div className="rapports-container" id="rapport-content">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Rapports des Ventes</h2>
                    <p className="page-subtitle">Analysez vos performances commerciales</p>
                </div>
                <div className="export-buttons">
                    <Button variant="outline-primary" onClick={exportPDF} className="export-btn">
                        <FiDownload /> Export PDF
                    </Button>
                    <Button variant="outline-success" onClick={exportExcel} className="export-btn">
                        <FiDownload /> Export Excel
                    </Button>
                </div>
            </div>

            <Card className="filters-card mb-4">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="align-items-end">
                            <Col xs={12} md={3}>
                                <Form.Group>
                                    <Form.Label>Type de rapport</Form.Label>
                                    <Form.Select 
                                        value={typeRapport} 
                                        onChange={(e) => setTypeRapport(e.value)}
                                    >
                                        {reportOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group>
                                    <Form.Label>Date de début</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FiCalendar />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="date"
                                            value={dateDebut ? dateDebut.toISOString().split('T')[0] : ''}
                                            onChange={(e) => setDateDebut(e.target.value ? new Date(e.target.value) : null)}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group>
                                    <Form.Label>Date de fin</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FiCalendar />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="date"
                                            value={dateFin ? dateFin.toISOString().split('T')[0] : ''}
                                            onChange={(e) => setDateFin(e.target.value ? new Date(e.target.value) : null)}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Button type="submit" className="btn-primary w-100">
                                    <FiFilter /> Générer Rapport
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            <Row className="mb-4">
                <Col xs={12}>
                    <Card className="table-card">
                        <Card.Header className="card-header-modern">
                            <div className="card-title">
                                <FiFileText />
                                <span>Rapport des Ventes</span>
                            </div>
                            <Badge bg="primary" className="report-type-badge">
                                {typeRapport === 'produit' ? 'Par Produit' : 'Par Client'}
                            </Badge>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <Table hover className="modern-table">
                                    <thead>
                                        <tr>
                                            <th>{typeRapport === 'produit' ? 'Produit' : 'Client'}</th>
                                            <th>Quantité</th>
                                            <th>Total Vente</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rapports.map((rapport, idx) => (
                                            <tr key={idx}>
                                                <td className="fw-semibold">
                                                    {typeRapport === 'produit' ? rapport.produit : rapport.clientNomComplet}
                                                </td>
                                                <td>{rapport.quantite}</td>
                                                <td className="fw-semibold text-success">
                                                    {parseFloat(rapport.totalVente).toFixed(2)} MAD
                                                </td>
                                            </tr>
                                        ))}
                                        {rapports.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center text-muted py-4">
                                                    Aucune donnée disponible. Générez un rapport pour voir les résultats.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Card className="table-card">
                        <Card.Header className="card-header-modern">
                            <div className="card-title">
                                <FiTrendingUp />
                                <span>Tendances du Produit le Plus Vendu</span>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <Table hover className="modern-table">
                                    <thead>
                                        <tr>
                                            <th>Produit</th>
                                            <th>Quantité Vendue</th>
                                            <th>Tendance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tendancesProduit.map((tendance, idx) => (
                                            <tr key={idx}>
                                                <td className="fw-semibold">{tendance.produit}</td>
                                                <td>{tendance.quantite_vendue}</td>
                                                <td>{getTrendBadge(tendance.tendance)}</td>
                                            </tr>
                                        ))}
                                        {tendancesProduit.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center text-muted py-4">
                                                    Aucune donnée de tendance disponible.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default RapportVentes;
