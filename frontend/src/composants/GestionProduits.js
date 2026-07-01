// GestionProduits.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { FiImage, FiUpload, FiX } from "react-icons/fi";
import "./GestionProduits.css";

const GestionProduits = () => {
  const emptyProduct = {
    id: null,
    nom: "",
    description: "",
    prix_achat: 0,
    categorie_id: null,
    fournisseur_id: null,
    image_produit: null,
  };
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduit, setCurrentProduit] = useState({
    id: null,
    nom: "",
    description: "",
    prix_achat: "",
    categorie_id: "",
    fournisseur_id: "",
    image_produit: null,
    imagePreview: null,
  });
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);

  // Refs for Toast and Dialog components
  const toast = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch categories, fournisseurs, and produits from the API
  useEffect(() => {
    fetchCategories();
    fetchFournisseurs();
    fetchProduits();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/fournisseurs",
      );
      setFournisseurs(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des fournisseurs:", error);
    }
  };

  const fetchProduits = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/produits");
      setFilteredProduits(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    }
  };

  // Dialog functions
  const hideDialog = () => {
    setShow(false);
    setIsEditing(false);
    setCurrentProduit({
      id: null,
      nom: "",
      description: "",
      prix_achat: "",
      categorie_id: "",
      fournisseur_id: "",
      image_produit: null,
      imagePreview: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handlers for product CRUD operations
  const handleShow = (produit) => {
    if (produit && produit.id != null) {
      setIsEditing(true);
      setCurrentProduit({
        ...produit,
        categorie_id: categories.find((c) => c.id === produit.categorie_id),
        fournisseur_id: fournisseurs.find(
          (f) => f.id === produit.fournisseur_id,
        ),
        imagePreview: produit.image_produit
          ? `http://localhost:8000/storage/${produit.image_produit}`
          : null,
      });
    } else {
      setIsEditing(false);
      setCurrentProduit({ ...emptyProduct, imagePreview: null });
    }
    setShow(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        showToast("error", "Erreur", "Veuillez sélectionner une image valide");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", "Erreur", "L'image ne doit pas dépasser 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProduit({
          ...currentProduit,
          image_produit: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCurrentProduit({
      ...currentProduit,
      image_produit: null,
      imagePreview: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nom", currentProduit.nom);
    formData.append("description", currentProduit.description);
    formData.append("prix_achat", currentProduit.prix_achat);
    formData.append(
      "categorie_id",
      currentProduit.categorie_id?.id ?? currentProduit.categorie_id,
    );
    formData.append(
      "fournisseur_id",
      currentProduit.fournisseur_id?.id ?? currentProduit.fournisseur_id,
    );

    if (currentProduit.image_produit instanceof File) {
      formData.append("image_produit", currentProduit.image_produit);
    }

    const url = `http://localhost:8000/api/produits/${isEditing ? currentProduit.id : ""}`;
    const method = isEditing ? "post" : "post";

    if (isEditing) {
      formData.append("_method", "PUT");
    }

    try {
      await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchProduits();
      setShow(false);
      setIsEditing(false);
      const successMessage = isEditing
        ? "Produit mis à jour avec succès"
        : "Produit ajouté avec succès";
      showToast("success", "Succès", successMessage);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erreur lors du traitement du produit";
      showToast("error", "Erreur", errorMessage);
      console.error("Erreur lors du traitement du produit:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await axios.delete(`http://localhost:8000/api/produits/${id}`);
        fetchProduits();
        showToast("success", "Succès", "Produit supprimé avec succès");
      } catch (error) {
        showToast(
          "error",
          "Erreur",
          "Erreur lors de la suppression du produit",
        );
        console.error("Erreur lors de la suppression du produit:", error);
      }
    }
  };

  // Toast function
  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  // Dialog footer
  const dialogFooter = (
    <div
      className="p-dialog-footer mt-2"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <Button
        style={{ borderRadius: "20px" }}
        label="Fermer"
        icon="pi pi-times"
        onClick={hideDialog}
        className="p-button-danger"
      />
      <Button
        style={{ borderRadius: "20px" }}
        label={isEditing ? "Mettre à jour" : "Ajouter"}
        className="p-button-help"
        icon="pi pi-check"
        onClick={handleSubmit}
      />
    </div>
  );

  // Image body template for table
  const imageBodyTemplate = (rowData) => {
    const defaultImage =
      "data:image/svg+xml," +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
        <rect fill="#f1f5f9" width="60" height="60"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="24">📦</text>
      </svg>
    `);

    const imageUrl = rowData.image_produit
      ? `http://localhost:8000/storage/${rowData.image_produit}`
      : defaultImage;

    return (
      <div className="product-image-cell">
        <img
          src={imageUrl}
          alt={rowData.nom}
          className="product-thumbnail"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>
    );
  };

  // Action buttons template
  const actionBodyTemplate = (rowData) => {
    return (
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}
      >
        <Button
          label="Modifier"
          className="p-button-warning"
          style={{ borderRadius: "20px", flex: 1 }}
          onClick={() => handleShow(rowData)}
        />
        <Button
          label="Supprimer"
          className="p-button-danger"
          style={{ borderRadius: "20px", flex: 1 }}
          onClick={() => handleDelete(rowData.id)}
        />
      </div>
    );
  };

  const categorieDropdownTemplate = (
    <Dropdown
      value={currentProduit.categorie_id}
      options={categories}
      onChange={(e) =>
        setCurrentProduit({ ...currentProduit, categorie_id: e.value })
      }
      optionLabel="nom"
      placeholder="Sélectionnez une catégorie"
    />
  );

  const fournisseurDropdownTemplate = (
    <Dropdown
      value={currentProduit.fournisseur_id}
      options={fournisseurs}
      onChange={(e) =>
        setCurrentProduit({ ...currentProduit, fournisseur_id: e.value })
      }
      optionLabel="nom"
      placeholder="Sélectionnez un fournisseur"
    />
  );

  // Template pour la colonne Catégorie
  const categoryBodyTemplate = (rowData) => {
    const category = categories.find((c) => c.id === rowData.categorie_id);
    return <>{category ? category.nom : "Non défini"}</>;
  };

  // Template pour la colonne Fournisseur
  const fournisseurBodyTemplate = (rowData) => {
    const fournisseur = fournisseurs.find(
      (f) => f.id === rowData.fournisseur_id,
    );
    return <>{fournisseur ? fournisseur.nom : "Non défini"}</>;
  };

  // JSX for rendering the component
  return (
    <div className="gestion-produits-container">
      <Toast ref={toast} />
      <div className="page-header">
        <div>
          <h2 className="page-title">Gestion des Produits</h2>
          <p className="page-subtitle">Gérez votre catalogue de produits</p>
        </div>
        <Button
          severity="help"
          label="Ajouter un produit"
          style={{ borderRadius: "20px" }}
          icon="pi pi-plus"
          onClick={() => handleShow(emptyProduct)}
          className="add-product-btn"
        />
      </div>

      <DataTable
        value={filteredProduits}
        responsive
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
        className="modern-datatable"
      >
        <Column
          body={imageBodyTemplate}
          header="Image"
          style={{ width: "80px" }}
        />
        <Column sortable field="nom" header="Nom" />
        <Column sortable field="description" header="Description" />
        <Column sortable field="prix_achat" header="Prix d'achat" />
        <Column sortable body={categoryBodyTemplate} header="Catégorie" />
        <Column sortable body={fournisseurBodyTemplate} header="Fournisseur" />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ width: "200px" }}
        />
      </DataTable>

      <Dialog
        visible={show}
        style={{ width: "50vw" }}
        header="Détails du produit"
        modal
        className="p-fluid"
        footer={dialogFooter}
        onHide={hideDialog}
      >
        <div className="p-field">
          <label htmlFor="nom">Nom</label>
          <InputText
            id="nom"
            value={currentProduit.nom}
            onChange={(e) =>
              setCurrentProduit({ ...currentProduit, nom: e.target.value })
            }
          />
        </div>
        <div className="p-field">
          <label htmlFor="description">Description</label>
          <InputTextarea
            id="description"
            value={currentProduit.description}
            onChange={(e) =>
              setCurrentProduit({
                ...currentProduit,
                description: e.target.value,
              })
            }
            rows={3}
          />
        </div>
        <div className="p-field">
          <label htmlFor="prix_achat">Prix d'achat</label>
          <InputNumber
            id="prix_achat"
            value={currentProduit.prix_achat}
            onValueChange={(e) =>
              setCurrentProduit({ ...currentProduit, prix_achat: e.value })
            }
            mode="currency"
            currency="MAD"
            locale="fr-FR"
          />
        </div>
        <div className="p-field">
          <label htmlFor="categorie_id">Catégorie</label>
          {categorieDropdownTemplate}
        </div>
        <div className="p-field">
          <label htmlFor="fournisseur_id">Fournisseur</label>
          {fournisseurDropdownTemplate}
        </div>
        <div className="p-field">
          <label htmlFor="image">Image du produit</label>
          <div className="image-upload-section">
            {currentProduit.imagePreview ? (
              <div className="image-preview-container">
                <img
                  src={currentProduit.imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
                <Button
                  type="button"
                  label="Supprimer"
                  icon={<FiX />}
                  onClick={handleRemoveImage}
                  className="p-button-danger remove-image-btn"
                  style={{ borderRadius: "20px" }}
                />
              </div>
            ) : (
              <div className="upload-placeholder">
                <FiImage className="upload-icon" />
                <p>Glissez-déposez une image ou</p>
                <Button
                  type="button"
                  label="Parcourir"
                  icon={<FiUpload />}
                  onClick={() => fileInputRef.current?.click()}
                  className="p-button-primary"
                  style={{ borderRadius: "20px" }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default GestionProduits;
