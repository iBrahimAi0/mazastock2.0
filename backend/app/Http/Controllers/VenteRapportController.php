<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commande; // Assurez-vous que ce modèle existe et est correctement lié à vos tables.
use App\Models\DetailCommande; // Assurez-vous que ce modèle existe.
use Illuminate\Support\Facades\DB;
class VenteRapportController extends Controller
{

public function suivreTendancesProduitPlusVendu(Request $request)
{
    $dates = $this->validateDates($request);

    $tendances = DetailCommande::join('produits', 'details_commandes.produit_id', '=', 'produits.id')
                    ->whereBetween('details_commandes.created_at', [$dates['dateDebut'], $dates['dateFin']])
                    ->select('produits.nom as produit', DB::raw('sum(details_commandes.quantite) as quantite_vendue'))
                    ->groupBy('produits.nom')
                    ->orderByDesc('quantite_vendue')
                    ->limit(5) // Vous pouvez ajuster le nombre de produits à afficher ici
                    ->get();

    return response()->json($tendances);
}









    /**
     * Générer des rapports sur les ventes par produit.
     */
    public function rapportParProduit(Request $request)
    {
        $dates = $this->validateDates($request);

        $rapport = DetailCommande::join('commandes', 'details_commandes.commande_id', '=', 'commandes.id')
                    ->join('produits', 'details_commandes.produit_id', '=', 'produits.id')
                    ->whereBetween('commandes.created_at', [$dates['dateDebut'], $dates['dateFin']])
                    ->select('produits.nom as produit', DB::raw('sum(details_commandes.quantite) as quantite'), DB::raw('sum(details_commandes.prix * details_commandes.quantite) as totalVente'))
                    ->groupBy('produits.nom')
                    ->get();

        return response()->json($rapport);
    }

    /**
     * Générer des rapports sur les ventes par client.
     */
   
     public function rapportParClient(Request $request)
{
    $dates = $this->validateDates($request);

    $rapport = Commande::join('clients', 'commandes.client_id', '=', 'clients.id')
                ->whereBetween('commandes.created_at', [$dates['dateDebut'], $dates['dateFin']])
                // Concaténation du nom et du prénom du client pour afficher le nom complet
                ->select(DB::raw("CONCAT(clients.nom, ' ', clients.prenom) as clientNomComplet"), DB::raw('sum(details_commandes.quantite) as quantite'), DB::raw('sum(details_commandes.prix * details_commandes.quantite) as totalVente'))
                ->join('details_commandes', 'commandes.id', '=', 'details_commandes.commande_id')
                ->groupBy('clients.nom', 'clients.prenom') // Assurez-vous de grouper aussi par prénom pour gérer les cas où des clients peuvent avoir le même nom
                ->get();

    return response()->json($rapport);
}

    private function validateDates(Request $request): array
    {
        return $request->validate([
            'dateDebut' => 'required|date',
            'dateFin' => 'required|date|after_or_equal:dateDebut',
        ]);
    }

    // Vous pouvez ajouter des méthodes similaires pour les rapports par catégorie et par période ici.
}
