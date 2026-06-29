<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\ProduitEnStock;

class ProduitEnStockController extends Controller
{
    public function index()
    {
        $produitsEnStock = ProduitEnStock::with('produit')->get();
        return response()->json($produitsEnStock);
    }

    // Créer un nouveau produit en stock
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'produit_id' => 'required|exists:produits,id|unique:produits_en_stock,produit_id',
                'description' => 'nullable|string',
                'prix_vente' => 'required|numeric|min:0',
                'quantite_initiale' => 'required|integer|min:0',
                'quantite_actuelle' => 'required|integer|min:0'
            ], [
                'produit_id.unique' => 'Ce produit est déjà en stock.'
            ]);

            $produitEnStock = ProduitEnStock::create($validatedData);
            return response()->json($produitEnStock, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de l\'ajout du produit en stock: ' . $e->getMessage()], 500);
        }
    }

    // Afficher un seul produit en stock
    public function show($id)
    {
        return ProduitEnStock::findOrFail($id);
    }

    // Mettre à jour un produit en stock
    public function update(Request $request, $id)
    {
        $produitEnStock = ProduitEnStock::findOrFail($id);

        $validatedData = $request->validate([
            'produit_id' => 'required|exists:produits,id|unique:produits_en_stock,produit_id,' . $produitEnStock->id,
            'description' => 'nullable|string',
            'prix_vente' => 'required|numeric|min:0',
            'quantite_initiale' => 'sometimes|required|integer|min:0',
            'quantite_actuelle' => 'sometimes|required|integer|min:0'
        ]);

        $produitEnStock->update($validatedData);
        return response()->json($produitEnStock, 200);
    }

    // Supprimer un produit en stock
    public function destroy($id)
    {
        ProduitEnStock::destroy($id);
        return response()->json(null, 204);
    }
}
