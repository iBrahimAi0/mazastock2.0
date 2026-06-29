<?php

namespace App\Http\Controllers;

use App\Models\ProduitEnStock;
use App\Models\Client;
use App\Models\Commande;
use App\Models\Categorie;
use App\Models\Fournisseur;
use Carbon\Carbon;


class StatistiqueController extends Controller
{
    public function nombreProduitsEnStock()
    {
        // Compte tous les produits en stock
        $nombre = ProduitEnStock::count();
        return response()->json($nombre);
    }

    public function produitsAvecFaibleQuantite()
    {
        // Compte les produits en stock dont la quantité actuelle est inférieure à 5
        $nombre = ProduitEnStock::where('quantite_actuelle', '<', 5)->count();
        return response()->json($nombre);
    }

    public function nombreClients()
    {
        // Compte tous les clients
        $nombre = Client::count();
        return response()->json($nombre);
    }


    public function nombreCategories()
    {
        $nombre = Categorie::count();
        return response()->json($nombre);
    }

    public function nombreFournisseurs()
    {
        $nombre = Fournisseur::count();
        return response()->json($nombre);
    }


    public function commandesAujourdhui() {
        $nombre = Commande::whereDate('created_at', Carbon::today())->count();
        return response()->json($nombre);
    }

    public function commandesHier() {
        $nombre = Commande::whereDate('created_at', Carbon::yesterday())->count();
        return response()->json($nombre);
    }

    public function commandesCetteSemaine() {
        $nombre = Commande::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count();
        return response()->json($nombre);
    }

    public function commandesCeMois() {
        $now = Carbon::now();
        $nombre = Commande::whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->count();
        return response()->json($nombre);
    }

    public function commandesCetteAnnee() {
        $nombre = Commande::whereYear('created_at', Carbon::now()->year)->count();
        return response()->json($nombre);
    }




}
