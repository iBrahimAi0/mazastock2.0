<?php

namespace App\Http\Controllers;

//use Log;
use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{

    public function index()
    {
        $categories = Categorie::all();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $categorie = Categorie::create($this->validateCategory($request));
        return response()->json($categorie, 201);
    }

    public function show($id)
    {
        return response()->json(Categorie::findOrFail($id));
    }
    
    public function update(Request $request, $id)
    {
        $categorie = Categorie::find($id);
        if (!$categorie) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }
        
        $categorie->update($this->validateCategory($request));
        return response()->json($categorie);
    }
    
    public function destroy($id)
    {
        $categorie = Categorie::find($id);
        if (!$categorie) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }
        
        $categorie->delete();
        return response()->json(null, 204);
    }

    private function validateCategory(Request $request): array
    {
        return $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
    }
}
