<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProduitController extends Controller
{
   /* public function index()
    {
        return Produit::orderBy('created_at', 'desc')->get();
    } */


    public function index(Request $request)
{
    $query = Produit::orderBy('created_at', 'desc');



    return $query->get();
}


    public function store(Request $request)
    {
        try {
            $data = $this->validateProduct($request);
            
            if ($request->hasFile('image_produit')) {
                $imagePath = $request->file('image_produit')->store('products', 'public');
                $data['image_produit'] = $imagePath;
            }
            
            $produit = Produit::create($data);
            return response()->json($produit, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la création du produit: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        return Produit::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        try {
            $produit = Produit::findOrFail($id);
            $data = $this->validateProduct($request);
            
            if ($request->hasFile('image_produit')) {
                // Delete old image if exists
                if ($produit->image_produit) {
                    Storage::disk('public')->delete($produit->image_produit);
                }
                
                $imagePath = $request->file('image_produit')->store('products', 'public');
                $data['image_produit'] = $imagePath;
            }
            
            $produit->update($data);
            return response()->json($produit, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la mise à jour du produit: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $produit = Produit::findOrFail($id);
            
            // Delete product image if exists
            if ($produit->image_produit) {
                Storage::disk('public')->delete($produit->image_produit);
            }
            
            // Disable foreign key checks temporarily
            DB::statement('SET FOREIGN_KEY_CHECKS=0');
            
            // Delete related order details
            $produit->detailsCommandes()->delete();
            
            // Delete related stock entries (this will cascade to movements due to foreign key)
            foreach ($produit->produitsEnStock as $stockEntry) {
                $stockEntry->delete();
            }
            
            // Delete the product
            $produit->delete();
            
            // Re-enable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
            
            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
            return response()->json(['error' => 'Erreur lors de la suppression du produit: ' . $e->getMessage()], 500);
        }
    }

    private function validateProduct(Request $request): array
    {
        return $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix_achat' => 'required|numeric|min:0',
            'categorie_id' => 'required|exists:categories,id',
            'fournisseur_id' => 'required|exists:fournisseurs,id',
            'image_produit' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    }
}
