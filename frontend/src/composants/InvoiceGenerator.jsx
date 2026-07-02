import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../images/logo.png";

const InvoiceGenerator = async (commande) => {
  const doc = new jsPDF("p", "mm", "a4");

  // ============================
  // Charger le logo
  // ============================
  const loadImage = () =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = logo;

      img.onload = () => resolve(img);
    });

  const img = await loadImage();

  // ============================
  // Logo
  // ============================

  doc.addImage(img, "PNG", 15, 10, 35, 35);

  // ============================
  // Titre
  // ============================

  doc.setFont("helvetica", "bold");
doc.setFontSize(22);
doc.setTextColor(30, 80, 180);

doc.text("MAZASTOCK", 105, 20, {
  align: "center",
});

doc.setDrawColor(30, 80, 180);
doc.setLineWidth(0.5);
doc.line(15, 45, 195, 45);

  // ============================
  // Facture
  // ============================

  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text("FACTURE", 105, 55, {
    align: "center",
  });

  // ============================
  // Infos facture
  // ============================

  doc.setFontSize(11);

  doc.text(`Facture N° : ${commande.id}`, 15, 70);

  doc.text(
    `Date : ${new Date(commande.created_at).toLocaleDateString("fr-FR")}`,
    15,
    78
  );

  doc.text(`Etat : ${commande.etat}`, 15, 86);

  // ============================
  // Client
  // ============================

  doc.setFillColor(235, 242, 255);

  doc.rect(120, 63, 75, 48, "F");

  doc.setFont("helvetica", "bold");
  doc.text("CLIENT", 125, 72);

  doc.setFont("helvetica", "normal");

  doc.text(
    `${commande.client.nom} ${commande.client.prenom}`,
    125,
    80
  );

  doc.text(
    `${commande.client.email || "-"}`,
    125,
    88
  );

  doc.text(
    `${commande.client.telephone || "-"}`,
    125,
    96
  );

  doc.text(
    `${commande.client.adresse || "-"}`,
    125,
    104
  );

  // ============================
  // Tableau produits
  // ============================

  const body = commande.details.map((item) => [
    item.produit.nom,
    item.quantite,
    `${Number(item.prix).toFixed(2)} MAD`,
    `${(item.quantite * item.prix).toFixed(2)} MAD`,
  ]);

  autoTable(doc, {
    startY: 115,

    head: [
      [
        "Produit",
        "Quantité",
        "Prix Unitaire",
        "Total",
      ],
    ],

    body,

    headStyles: {
      fillColor: [30, 80, 180],
      halign: "center",
    },

    bodyStyles: {
      halign: "center",
    },

    styles: {
      fontSize: 10,
    },
  });

  // ============================
  // Total
  // ============================

  const total = commande.details.reduce(
    (sum, item) => sum + item.quantite * item.prix,
    0
  );

  let finalY = doc.lastAutoTable.finalY + 12;

  doc.setFont("helvetica", "bold");

  doc.setFontSize(13);

  doc.text(
    `TOTAL : ${total.toFixed(2)} MAD`,
    195,
    finalY,
    {
      align: "right",
    }
  );

  // ============================
  // Paiement
  // ============================

  finalY += 12;

  doc.setFontSize(11);

  doc.text(
    `Méthode de paiement : ${
      commande.paiement?.methode || "-"
    }`,
    15,
    finalY
  );

  finalY += 8;

  doc.text(
    `Montant payé : ${
      commande.paiement?.total || total.toFixed(2)
    } MAD`,
    15,
    finalY
  );

  // ============================
  // Footer
  // ============================

  finalY += 25;

  doc.setDrawColor(180);

  doc.line(15, finalY, 195, finalY);

  finalY += 10;

  doc.setFont("helvetica", "italic");

  doc.setTextColor(100);

  doc.text(
    "Merci pour votre confiance.",
    105,
    finalY,
    {
      align: "center",
    }
  );

  finalY += 8;

  doc.text(
    "MAZASTOCK",
    105,
    finalY,
    {
      align: "center",
    }
  );

  // ============================
  // Télécharger
  // ============================

  doc.save(`Facture_${commande.id}.pdf`);
};

export default InvoiceGenerator;