<?php

namespace App\Http\Controllers;

use App\Models\Entrepot;
use Illuminate\Http\Request;

class EntrepotController extends Controller
{
    public function index()
    {
        // Récupère tous les entrepôts
        return Entrepot::all();
    }

    public function store(Request $request)
    {
        // Valide la requête
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string',
        ]);

        // Crée un nouvel entrepôt
        $entrepot = Entrepot::create($validated);
        return response()->json($entrepot, 201);
    }

    public function show($id)
    {
        // Affiche un entrepôt spécifique
        return Entrepot::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        // Trouve l'entrepôt et met à jour
        $entrepot = Entrepot::findOrFail($id);
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string',
        ]);

        $entrepot->update($validated);
        return response()->json($entrepot, 200);
    }

    public function destroy($id)
    {
        // Supprime l'entrepôt
        Entrepot::destroy($id);
        return response()->json(null, 204);
    }
}
