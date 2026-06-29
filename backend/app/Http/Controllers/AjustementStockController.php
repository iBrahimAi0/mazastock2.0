<?php

namespace App\Http\Controllers;

use App\Models\AjustementStock;
use Illuminate\Http\Request;

class AjustementStockController extends Controller
{
    public function index()
    {
        // Récupère tous les ajustements de stock
        return AjustementStock::with('mouvementStock')->get();
    }

    public function store(Request $request)
    {
        // Valide la requête
        $validated = $request->validate([
            'mouvement_stock_id' => 'required|exists:mouvements_stock,id',
            'raison' => 'required|string|max:255',
            'details' => 'nullable|string',
        ]);

        // Crée un nouvel ajustement de stock
        $ajustement = AjustementStock::create($validated);
        return response()->json($ajustement, 201);
    }

    public function show($id)
    {
        // Affiche un ajustement de stock spécifique
        return AjustementStock::with('mouvementStock')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        // Trouve l'ajustement de stock et met à jour
        $ajustement = AjustementStock::findOrFail($id);
        $validated = $request->validate([
            'mouvement_stock_id' => 'required|exists:mouvements_stock,id',
            'raison' => 'required|string|max:255',
            'details' => 'nullable|string',
        ]);

        $ajustement->update($validated);
        return response()->json($ajustement, 200);
    }

    public function destroy($id)
    {
        // Supprime l'ajustement de stock
        AjustementStock::destroy($id);
        return response()->json(null, 204);
    }
}
