<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MouvementStock;
use App\Models\ProduitEnStock;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MouvementStockController extends Controller
{
    // Lister tous les mouvements de stock
    public function index()
{
    // Remplacez 'produitEnStock.produit' par la relation appropriée dans votre modèle MouvementStock
    // pour accéder au produit associé au produit en stock.
    $mouvements = MouvementStock::with(['produitEnStock.produit', 'entrepot'])->get();

    // Transformez les données si nécessaire pour inclure les informations du produit directement
    // dans chaque mouvement de stock.
    $mouvementsTransformed = $mouvements->map(function ($mouvement) {
        $mouvement->nomProduit = $mouvement->produitEnStock?->produit?->nom;
        $mouvement->quantiteActuelleProduit = $mouvement->produitEnStock?->quantite_actuelle;
        return $mouvement;
    });

    return response()->json($mouvementsTransformed);
}

    

    /*
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'produit_id' => 'required|exists:produits_en_stock,id', // Assurez-vous que ceci correspond à votre table et colonne correctes
            'type_mouvement' => 'required|in:entrée,sortie,transfert,ajustement',
            'quantite' => 'required|integer',
            'date' => 'required|date',
            'entrepot_id' => 'required|exists:entrepots,id'
        ]);

        $mouvementStock = MouvementStock::create($validatedData);
        return response()->json($mouvementStock, 201);
    } */


    // Créer un nouveau mouvement de stock
public function store(Request $request)
{
    $validatedData = $this->validateMovement($request);

    $mouvementStock = DB::transaction(function () use ($validatedData) {
        $stock = ProduitEnStock::lockForUpdate()->findOrFail($validatedData['produit_id']);
        $this->applyStockDelta($stock, $this->stockDelta(
            $validatedData['type_mouvement'],
            $validatedData['quantite']
        ));

        return MouvementStock::create($validatedData);
    });

    return response()->json($mouvementStock->load(['produitEnStock.produit', 'entrepot']), 201);
}




    // Afficher un mouvement de stock spécifique
    public function show($id)
    {
        return MouvementStock::with(['produitEnStock', 'entrepot'])->findOrFail($id);
    }

    // Mettre à jour un mouvement de stock
    public function update(Request $request, $id)
    {
        $validatedData = $this->validateMovement($request);

        $mouvementStock = DB::transaction(function () use ($id, $validatedData) {
            $movement = MouvementStock::lockForUpdate()->findOrFail($id);
            $stockIds = collect([$movement->produit_id, $validatedData['produit_id']])->unique()->sort()->values();
            $stocks = ProduitEnStock::whereIn('id', $stockIds)->lockForUpdate()->get()->keyBy('id');

            $oldStock = $stocks->get($movement->produit_id);
            $newStock = $stocks->get($validatedData['produit_id']);
            $this->applyStockDelta($oldStock, -$this->stockDelta($movement->type_mouvement, $movement->quantite));
            $this->applyStockDelta($newStock, $this->stockDelta(
                $validatedData['type_mouvement'],
                $validatedData['quantite']
            ));

            $movement->update($validatedData);
            return $movement;
        });

        return response()->json($mouvementStock->load(['produitEnStock.produit', 'entrepot']));
    }

    // Supprimer un mouvement de stock
    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $movement = MouvementStock::lockForUpdate()->findOrFail($id);
            $stock = ProduitEnStock::lockForUpdate()->findOrFail($movement->produit_id);
            $this->applyStockDelta($stock, -$this->stockDelta($movement->type_mouvement, $movement->quantite));
            $movement->delete();
        });

        return response()->json(null, 204);
    }

    private function validateMovement(Request $request): array
    {
        return $request->validate([
            'produit_id' => 'required|exists:produits_en_stock,id',
            'type_mouvement' => 'required|in:entrée,sortie,transfert,ajustement',
            'quantite' => 'required|integer|min:1',
            'date' => 'required|date',
            'entrepot_id' => 'required|exists:entrepots,id',
        ]);
    }

    private function stockDelta(string $type, int $quantity): int
    {
        return match ($type) {
            'entrée' => $quantity,
            'sortie' => -$quantity,
            default => 0,
        };
    }

    private function applyStockDelta(ProduitEnStock $stock, int $delta): void
    {
        $newQuantity = $stock->quantite_actuelle + $delta;
        if ($newQuantity < 0) {
            throw ValidationException::withMessages([
                'quantite' => 'La quantité en stock est insuffisante.',
            ]);
        }

        $stock->quantite_actuelle = $newQuantity;
        $stock->save();
    }
}
