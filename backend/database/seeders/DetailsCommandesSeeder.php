<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class DetailsCommandesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        $commandeIds = DB::table('commandes')->pluck('id')->toArray();

        // On récupère le prix de vente connu pour chaque produit (via produits_en_stock),
        // avec un prix de secours si un produit n'a pas encore de stock associé
        $produits = DB::table('produits')
            ->leftJoin('produits_en_stock', 'produits.id', '=', 'produits_en_stock.produit_id')
            ->select('produits.id as produit_id', 'produits_en_stock.prix_vente')
            ->get();

        foreach ($commandeIds as $commandeId) {
            $nbLignes = $faker->numberBetween(1, 5);

            $produitsChoisis = $produits->random(min($nbLignes, $produits->count()));
            if (!$produitsChoisis instanceof \Illuminate\Support\Collection) {
                $produitsChoisis = collect([$produitsChoisis]);
            }

            foreach ($produitsChoisis as $produit) {
                $prix = $produit->prix_vente ?? $faker->randomFloat(2, 15, 600);

                DB::table('details_commandes')->insert([
                    'commande_id' => $commandeId,
                    'produit_id' => $produit->produit_id,
                    'quantite' => $faker->numberBetween(1, 10),
                    'prix' => $prix,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
