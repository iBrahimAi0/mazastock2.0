import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Row, Col, ListGroup, Card, Container, Badge, Modal } from 'react-bootstrap';
import { MdAdd, MdRemove } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import QuantiteSelector from './QuantiteSelector';
import './CommandeForm.module.css';

import { FaTags } from 'react-icons/fa'; // Importer l'icône FaTags

import ClientList from './ListeClient';

const CommandeForm = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [produits, setProduits] = useState([]);
    const [produitsEnStock, setProduitsEnStock] = useState([]);
    const [produitsSelectionnes, setProduitsSelectionnes] = useState([]);
    const [categorieSelectionnee, setCategorieSelectionnee] = useState('');
    const [clientSelectionne, setClientSelectionne] = useState('');

     // State pour les détails de paiement
     const [methodePaiement, setMethodePaiement] = useState('');
     const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => axios.get('http://localhost:8000/api/categories');
        const fetchProduits = async () => axios.get('http://localhost:8000/api/produits');
        const fetchProduitsEnStock = async () => axios.get('http://localhost:8000/api/produits_en_stock');

        Promise.all([fetchCategories(), fetchProduits(), fetchProduitsEnStock()])
            .then(([categoriesRes, produitsRes, produitsEnStockRes]) => {
                setCategories(categoriesRes.data);
                setProduits(produitsRes.data);
                setProduitsEnStock(produitsEnStockRes.data);
            })
            .catch(error => console.error("Erreur lors de la récupération des données", error));
    }, []);


    const produitsFiltres = categorieSelectionnee === '' ? produitsEnStock : produitsEnStock.filter(ps =>
      produits.find(p => p.id === ps.produit_id && p.categorie_id === categorieSelectionnee)
  );
  

// Fonction pour calculer le nombre de produits par catégorie
const calculerNombreProduitsParCategorie = () => {
  return produits.reduce((acc, produit) => {
    acc[produit.categorie_id] = (acc[produit.categorie_id] || 0) + 1;
    return acc;
  }, {});
};

// Calcul du nombre total de produits
const totalProduits = produits.length;

// Calcul du nombre de produits par catégorie
const nombreProduitsParCategorie = calculerNombreProduitsParCategorie();

    const produitsAffiches = produitsFiltres.map(ps => {
        const detailsProduit = produits.find(p => p.id === ps.produit_id);
        return {
            ...ps,
            nom: detailsProduit.nom,
            categorie_id: detailsProduit.categorie_id,
            prix_vente: ps.prix_vente,
            quantite_actuelle: ps.quantite_actuelle,
        };
    });

    const ajouterProduit = (produitId) => {
        const produitEnStock = produitsEnStock.find(p => p.produit_id === produitId);
        if (!produitEnStock) {
            console.error("Produit non trouvé dans le stock", produitId);
            return;
        }
    
        let produitDansCommande = produitsSelectionnes.find(p => p.id === produitId);
    
        if (produitDansCommande) {
            if (produitDansCommande.quantite < produitEnStock.quantite_actuelle) {
                setProduitsSelectionnes(produitsSelectionnes.map(p =>
                    p.id === produitId ? { ...p, quantite: p.quantite + 1 } : p
                ));
            } else {
                alert("Quantité maximale atteinte pour ce produit.");
            }
        } else {
            const newProduit = {
                ...produitEnStock,
                nom: produits.find(p => p.id === produitId).nom,
                prix_vente: produitEnStock.prix_vente,
                quantite: 1,
                id: produitId, // Assurez-vous que cette propriété est correctement définie
            };
            setProduitsSelectionnes([...produitsSelectionnes, newProduit]);
        }
    };
    
  

    const retirerProduit = (produitId) => {
        const produitDansCommande = produitsSelectionnes.find(p => p.id === produitId);
        if (produitDansCommande.quantite > 1) {
            setProduitsSelectionnes(produitsSelectionnes.map(p => {
                if (p.id === produitId) {
                    return { ...p, quantite: p.quantite - 1 };
                }
                return p;
            }));
        } else {
            setProduitsSelectionnes(produitsSelectionnes.filter(p => p.id !== produitId));
        }
    };

    const supprimerProduitComplet = (produitId) => {
        setProduitsSelectionnes(produitsSelectionnes.filter(produit => produit.id !== produitId));
    };

    
    // Fonction pour soumettre la commande
   // Fonction pour soumettre la commande et effectuer le paiement
   const soumettreCommandeEtPaiement = async () => {
    if (!clientSelectionne) {
        alert("Veuillez sélectionner un client.");
        return;
    }
    const dataEnvoyee = {
        client_id: clientSelectionne,
        produits: produitsSelectionnes.map(p => ({
            produit_id: p.id,
            quantite: p.quantite,
            prix: p.prix_vente,
            montant_total: p.quantite * p.prix_vente // Calcul du montant total pour chaque produit
        })),
        methode_paiement: methodePaiement,
        total_a_payer: produitsSelectionnes.reduce((total, produit) => total + (produit.quantite * produit.prix_vente), 0) // Calcul du total à payer en sommant tous les montants totaux des produits
    };

    console.log("Données envoyées :", dataEnvoyee); // Affichage des données envoyées


    try {
        const response = await axios.post('http://localhost:8000/api/commandes', dataEnvoyee);
        if (response.data.success) {
            // Envoi de la commande réussi
            // Réinitialisation des états
            setClientSelectionne('');
            setProduitsSelectionnes([]);
            setMethodePaiement('');
            setShowModal(false);
            navigate(`/listecommandes`);
        } else {
            alert("Une erreur est survenue lors de la création de la commande.");
        }
    } catch (error) {
        console.error("Erreur lors de la soumission de la commande :", error);
        alert("Erreur lors de la soumission de la commande. Veuillez réessayer.");
    }
};
    

  

    const totalAPayer = produitsSelectionnes.reduce((total, produit) => {
        const prixVenteNumerique = parseFloat(produit.prix_vente);
        const quantiteNumerique = parseFloat(produit.quantite);

        if (!isNaN(prixVenteNumerique) && !isNaN(quantiteNumerique)) {
            return total + (prixVenteNumerique * quantiteNumerique);
        } else {
            console.error("Erreur de conversion en nombre", produit);
            return total;
        }
    }, 0);

  
     return (
      <Container fluid className="commandeForm-container">

<ClientList 
  clientSelectionne={clientSelectionne} 
  onClientChange={setClientSelectionne} // Supposez que vous avez changé le nom de la prop pour plus de clarté
/>


<Row className="mb-2">
              <Col xs={12} md={3} className="categorie-selection mb-3">
            
              <ListGroup>
              <ListGroup.Item
                action
                onClick={() => setCategorieSelectionnee('')}
                className={categorieSelectionnee === '' ? "active" : ""}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <FaTags className="me-2" />Tous Les Produits
                  </div>
                  <Badge pill bg="dark">{totalProduits}</Badge>
                </div>
              </ListGroup.Item>
              {categories.map(categorie => (
                <ListGroup.Item
                  key={categorie.id}
                  action
                  onClick={() => setCategorieSelectionnee(categorie.id)}
                  className={categorieSelectionnee === categorie.id ? "active" : ""}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <FaTags className="me-2" />{categorie.nom}
                    </div>
                    <Badge pill bg="dark">
                      {nombreProduitsParCategorie[categorie.id] || 0}
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>


              </Col>
              <Col xs={12} md={6}>
    <Row>
        {produitsAffiches.map(produit => (
            <Col md={6} key={produit.id} className="mb-3">
                <Card className="produit-card">
                    <Card.Body>
                        <Card.Title>{produit.nom}</Card.Title>
                        <Card.Text>
                            Quantité en stock: <Badge bg="info">{produit.quantite_actuelle}</Badge><br/>
                            Prix de vente: {produit.prix_vente} MAD
                        </Card.Text>
                        <div className="action-icons">
                            <Button 
                                className="btn-icon" 
                                onClick={() => ajouterProduit(produit.id)} 
                                disabled={produit.quantite_actuelle <= 0}
                            >
                                <MdAdd />
                            </Button>
                            <Button 
                                className="btn-icon" 
                                onClick={() => retirerProduit(produit.id)} 
                                disabled={produit.quantite_actuelle <= 0}
                            >
                                <MdRemove />
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        ))}
    </Row>
</Col>

              <Col xs={12} md={3} className="commande-details">
                  <ListGroup variant="flush">
                  {produitsSelectionnes.map(produit => (
    <ListGroup.Item key={produit.id} className="d-flex justify-content-between align-items-center">
        <div>{produit.nom} <br/> Prix : {produit.prix_vente} MAD</div>
        <QuantiteSelector
            quantite={produit.quantite}
            quantiteMax={produit.quantite_actuelle}
            onAugmenter={() => ajouterProduit(produit.id)}
            onDiminuer={() => retirerProduit(produit.id)}
            onSupprimer={() => supprimerProduitComplet(produit.id)}
        />
    </ListGroup.Item>
))}

                      <ListGroup.Item className="d-flex justify-content-between">
                          <strong>Total à payer :</strong>
                          <strong><Badge bg="success">{totalAPayer.toFixed(2)} MAD</Badge></strong>
                      </ListGroup.Item>
                  </ListGroup>
                  <hr></hr>
                  {produitsSelectionnes.length > 0 && (
                <Button variant="primary" className="mt-3" onClick={() => setShowModal(true)}>
                    <FaCheckCircle /> Confirmer la commande
                </Button>
                  )}
              </Col>




{/* Modal de paiement */}
<Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal de Paiement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Formulaire de paiement */}
                    <Form>
                    <Form.Group controlId="methodePaiement">
                        <Form.Label>Méthode de paiement</Form.Label>
                        <Form.Control
                            as="select"
                            value={methodePaiement}
                            onChange={e => {
                                const selectedOption = e.target.value;
                                if (selectedOption !== "") { // Vérifie si une option valide est sélectionnée
                                    setMethodePaiement(selectedOption);
                                }
                            }}
                            required
                        >
                            <option disabled value="">Sélectionner une méthode de paiement</option>
                            <option value="espèces">Espèces</option>
                            <option value="carte">Carte bancaire</option>
                            <option value="cheque">Chèque</option>
                        </Form.Control>
                    </Form.Group>

                        <Form.Group controlId="totalAPayerModal">
                            <Form.Label>Total à payer</Form.Label>
                            <Form.Control
                                type="number"
                                value={totalAPayer.toFixed(2)}
                                readOnly
                                required
                                disabled
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Annuler
                    </Button>
                    <Button 
        variant="primary" 
        onClick={soumettreCommandeEtPaiement}
        disabled={!methodePaiement} // Désactive le bouton si aucune méthode de paiement n'est sélectionnée
    >
        Payer
    </Button>
                </Modal.Footer>
            </Modal>

          </Row>
      </Container>
  );
};

export default CommandeForm;
