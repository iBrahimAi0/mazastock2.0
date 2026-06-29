<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VenteController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CommandeController;

use App\Http\Controllers\EntrepotController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\VenteRapportController;
use App\Http\Controllers\MouvementStockController;
use App\Http\Controllers\ProduitEnStockController;
use App\Http\Controllers\AjustementStockController;
use App\Http\Controllers\OuvertureCaisseController;
use App\Http\Controllers\StatistiqueController;

//use App\Http\Controllers\Auth\AuthController;
//use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn (Request $request) => $request->user());

    Route::apiResources([
        'categories' => CategorieController::class,
        'fournisseurs' => FournisseurController::class,
        'clients' => ClientController::class,
        'produits' => ProduitController::class,
        'produits_en_stock' => ProduitEnStockController::class,
        'entrepots' => EntrepotController::class,
        'mouvements_stock' => MouvementStockController::class,
        'ajustements_stock' => AjustementStockController::class,
    ]);

    Route::apiResource('commandes', CommandeController::class)->except('update');
    Route::put('/commandes/{commande}', [CommandeController::class, 'updateEtat']);

    Route::get('/ventes', [VenteController::class, 'index']);
    Route::post('/ventes/periode', [VenteController::class, 'parPeriode']);

    Route::post('/ouvrir-caisse', [OuvertureCaisseController::class, 'ouvrirCaisse']);
    Route::get('/ouvertures-caisse', [OuvertureCaisseController::class, 'listerOuvertures']);

    Route::get('/rapports/ventes-par-produit', [VenteRapportController::class, 'rapportParProduit']);
    Route::get('/rapports/ventes-par-client', [VenteRapportController::class, 'rapportParClient']);
    Route::get('/rapports/tendances-produit-plus-vendu', [VenteRapportController::class, 'suivreTendancesProduitPlusVendu']);

    Route::get('/statistiques/produitsEnStock', [StatistiqueController::class, 'nombreProduitsEnStock']);
    Route::get('/statistiques/produitsFaibleQuantite', [StatistiqueController::class, 'produitsAvecFaibleQuantite']);
    Route::get('/statistiques/clients', [StatistiqueController::class, 'nombreClients']);
    Route::get('/statistiques/categories', [StatistiqueController::class, 'nombreCategories']);
    Route::get('/statistiques/fournisseurs', [StatistiqueController::class, 'nombreFournisseurs']);
    Route::get('/statistiques/commandesAujourdhui', [StatistiqueController::class, 'commandesAujourdhui']);
    Route::get('/statistiques/commandesHier', [StatistiqueController::class, 'commandesHier']);
    Route::get('/statistiques/commandesCetteSemaine', [StatistiqueController::class, 'commandesCetteSemaine']);
    Route::get('/statistiques/commandesCeMois', [StatistiqueController::class, 'commandesCeMois']);
    Route::get('/statistiques/commandesCetteAnnee', [StatistiqueController::class, 'commandesCetteAnnee']);
});
