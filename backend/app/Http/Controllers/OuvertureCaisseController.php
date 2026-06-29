<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OuvertureCaisse;
use Carbon\Carbon;

class OuvertureCaisseController extends Controller
{
    // Méthode pour "ouvrir la caisse" et enregistrer l'événement
    public function ouvrirCaisse(Request $request) {
        $ouverture = new OuvertureCaisse();
        $ouverture->date_ouverture = Carbon::now();
        $ouverture->save();

        return response()->json([
            'message' => 'Caisse ouverte avec succès',
            'date_ouverture' => $ouverture->date_ouverture
        ]);
    }

        // Méthode pour lister toutes les ouvertures de caisse
        public function listerOuvertures() {
        // Utilisez orderBy avant de récupérer les résultats avec get()
        $ouvertures = OuvertureCaisse::orderBy('created_at', 'desc')->get();
        return response()->json($ouvertures);
    }
    
}
