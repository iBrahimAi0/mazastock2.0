import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './axiosSetup';
import { Chart } from 'primereact/chart';
import { FiBarChart2, FiBox, FiUsers, FiPackage, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import './TableauDeBord.css';

export default function TableauDeBord() {
    const [barChartData, setBarChartData] = useState({});
    const [stockPieData, setStockPieData] = useState({});
    const [clientPieData, setClientPieData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);
            try {
                // Préparation des URLs des endpoints
                const statsEndpoints = [
                    { key: 'Aujourd\'hui', url: 'http://localhost:8000/api/statistiques/commandesAujourdhui' },
                    { key: 'Hier', url: 'http://localhost:8000/api/statistiques/commandesHier' },
                    { key: 'Cette Semaine', url: 'http://localhost:8000/api/statistiques/commandesCetteSemaine' },
                    { key: 'Ce Mois', url: 'http://localhost:8000/api/statistiques/commandesCeMois' },
                    { key: 'Cette Année', url: 'http://localhost:8000/api/statistiques/commandesCetteAnnee' },
                ];

                // Exécution des requêtes de commandes en parallèle
                const commandResponses = await Promise.all(
                    statsEndpoints.map(endpoint => axios.get(endpoint.url))
                );

                const barData = {
                    labels: statsEndpoints.map(stat => stat.key),
                    datasets: [{
                        label: 'Nombre de Commandes',
                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 2,
                        borderRadius: 8,
                        data: commandResponses.map(response => response.data)
                    }]
                };

                setBarChartData(barData);

                // Exécution des requêtes pour les stocks et clients
                const otherStatsResponses = await Promise.all([
                    axios.get('http://localhost:8000/api/statistiques/produitsEnStock'),
                    axios.get('http://localhost:8000/api/statistiques/produitsFaibleQuantite'),
                    axios.get('http://localhost:8000/api/statistiques/clients'),
                    axios.get('http://localhost:8000/api/statistiques/categories'),
                    axios.get('http://localhost:8000/api/statistiques/fournisseurs')
                ]);

                const stockData = {
                    labels: ['Produits en Stock', 'Produits à Faible Quantité'],
                    datasets: [{
                        data: [otherStatsResponses[0].data, otherStatsResponses[1].data],
                        backgroundColor: ['rgba(99, 102, 241, 0.8)', 'rgba(245, 158, 11, 0.8)'],
                        borderColor: ['rgba(99, 102, 241, 1)', 'rgba(245, 158, 11, 1)'],
                        borderWidth: 2
                    }]
                };

                const clientData = {
                    labels: ['Clients', 'Catégories', 'Fournisseurs'],
                    datasets: [{
                        data: [otherStatsResponses[2].data, otherStatsResponses[3].data, otherStatsResponses[4].data],
                        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(14, 165, 233, 0.8)'],
                        borderColor: ['rgba(16, 185, 129, 1)', 'rgba(139, 92, 246, 1)', 'rgba(14, 165, 233, 1)'],
                        borderWidth: 2
                    }]
                };

                setStockPieData(stockData);
                setClientPieData(clientData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    // Styles des graphiques
    const commonOptions = {
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    font: {
                        size: 12,
                        weight: 600
                    },
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 11
                    }
                },
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)'
                }
            },
            x: {
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 11
                    }
                },
                grid: {
                    display: false
                }
            }
        }
    };

    const pieOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    font: {
                        size: 12,
                        weight: 600
                    },
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="tableau-de-bord-container">
                <div className="loading-state">
                    <FiRefreshCw className="spinner" />
                    <p>Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="tableau-de-bord-container">
            <div className="section-header">
                <div>
                    <h2 className="page-title">Tableau de bord</h2>
                    <p className="page-subtitle">Vue synthétique de vos indicateurs clés</p>
                </div>
                <span className="metric-pill"><FiTrendingUp /> En temps réel</span>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <div className="card-header">
                        <div>
                            <h5 className="card-title">Commandes</h5>
                            <p className="card-subtitle">Évolution mensuelle et hebdomadaire</p>
                        </div>
                        <span className="metric-pill"><FiBarChart2 /> Statistiques</span>
                    </div>
                    <div className="chart-container">
                        <Chart style={{ height: '340px', width: '100%' }} type="bar" data={barChartData} options={commonOptions} />
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <div>
                            <h5 className="card-title">Aperçu stock</h5>
                            <p className="card-subtitle">Répartition rapide</p>
                        </div>
                    </div>
                    <div className="chart-container pie-charts">
                        <div className="pie-chart-wrapper">
                            <Chart type="pie" data={stockPieData} options={pieOptions} />
                        </div>
                        <div className="pie-chart-wrapper">
                            <Chart type="pie" data={clientPieData} options={pieOptions} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <div className="card-header">
                        <div>
                            <h5 className="card-title">Résumé opérationnel</h5>
                            <p className="card-subtitle">Points de suivi utiles</p>
                        </div>
                    </div>
                    <div className="quick-stats-grid">
                        <div className="quick-stat-card">
                            <div className="stat-icon products">
                                <FiBox />
                            </div>
                            <div className="stat-content">
                                <h6>Produits</h6>
                                <p>Suivi stock</p>
                            </div>
                        </div>
                        <div className="quick-stat-card">
                            <div className="stat-icon clients">
                                <FiUsers />
                            </div>
                            <div className="stat-content">
                                <h6>Clients</h6>
                                <p>Base clients</p>
                            </div>
                        </div>
                        <div className="quick-stat-card">
                            <div className="stat-icon warehouses">
                                <FiPackage />
                            </div>
                            <div className="stat-content">
                                <h6>Entrepôts</h6>
                                <p>Logistique</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
