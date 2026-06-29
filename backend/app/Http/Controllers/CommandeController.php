<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\DetailCommande;
use App\Models\ProduitEnStock;
use App\Models\Paiement; 
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class CommandeController extends Controller
{
    // Lister toutes les commandes
    public function index()
    {
        $commandes = Commande::with(['client', 'produit','details.produit'])->orderBy('created_at', 'desc')->get();
        return response()->json($commandes);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'produits' => 'required|array|min:1',
            'produits.*.produit_id' => 'required|exists:produits,id',
            'produits.*.quantite' => 'required|integer|min:1',
            'produits.*.prix' => 'required|numeric|min:0',
            'methode_paiement' => 'required|string|max:50',
            'total_a_payer' => 'required|numeric|min:0',
        ]);

        $commande = DB::transaction(function () use ($validated) {
            $calculatedTotal = collect($validated['produits'])->sum(
                fn (array $product) => $product['prix'] * $product['quantite']
            );
            if (abs($calculatedTotal - $validated['total_a_payer']) > 0.01) {
                throw ValidationException::withMessages([
                    'total_a_payer' => 'Le total ne correspond pas aux lignes de la commande.',
                ]);
            }

            $commande = Commande::create([
                'client_id' => $validated['client_id'],
                'etat' => 'en attente',
            ]);

            foreach ($validated['produits'] as $produit) {
                $produitEnStock = ProduitEnStock::where('produit_id', $produit['produit_id'])
                    ->lockForUpdate()
                    ->first();
                if (!$produitEnStock || $produitEnStock->quantite_actuelle < $produit['quantite']) {
                    throw ValidationException::withMessages([
                        'produits' => "Quantité en stock insuffisante pour le produit {$produit['produit_id']}.",
                    ]);
                }

                DetailCommande::create([
                    'commande_id' => $commande->id,
                    'produit_id' => $produit['produit_id'],
                    'quantite' => $produit['quantite'],
                    'prix' => $produit['prix'],
                ]);
                $produitEnStock->decrement('quantite_actuelle', $produit['quantite']);
            }

            Paiement::create([
                'commande_id' => $commande->id,
                'methode' => $validated['methode_paiement'],
                'total' => $calculatedTotal,
            ]);

            return $commande->load(['client', 'details.produit', 'paiement']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Commande créée avec succès',
            'data' => $commande,
        ], 201);
    }
    


    // Afficher une commande spécifique
    public function show($id)
    {
        try {
            $commande = Commande::with(['client', 'details.produit', 'paiement'])->findOrFail($id);
            return response()->json($commande);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Commande non trouvée'], 404);
        }
    }

    public function updateEtat(Request $request, $id)
    {
        $commande = Commande::findOrFail($id); // Trouve la commande ou échoue avec une 404
        
        $validated = $request->validate([
            'etat' => 'required|in:en attente,en cours de traitement,expédiée',
        ]);
        
        $commande->etat = $validated['etat'];
        $commande->save(); // Sauvegarde les changements dans la base de données
        
        return response()->json($commande);
    }

    // Supprimer une commande
    public function destroy($id)
    {
        try {
            DB::transaction(function () use ($id) {
                $commande = Commande::with('details')->lockForUpdate()->findOrFail($id);
                foreach ($commande->details as $detail) {
                    $stock = ProduitEnStock::where('produit_id', $detail->produit_id)
                        ->lockForUpdate()
                        ->first();
                    if ($stock) {
                        $stock->increment('quantite_actuelle', $detail->quantite);
                    }
                }
                $commande->delete();
            });
            return response()->json(['message' => 'Commande supprimée avec succès']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Commande non trouvée'], 404);
        }
    }
}
