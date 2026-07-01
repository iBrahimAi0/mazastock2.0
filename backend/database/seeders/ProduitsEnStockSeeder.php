<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ProduitsEnStockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        $produits = DB::table('produits')->get(['id', 'prix_achat']);

        foreach ($produits as $produit) {
            $quantiteInitiale = $faker->numberBetween(20, 200);

            // Marge de vente entre 15% et 60% au-dessus du prix d'achat
            $prixVente = round($produit->prix_achat * $faker->randomFloat(2, 1.15, 1.6), 2);

            DB::table('produits_en_stock')->insert([
                'produit_id' => $produit->id,
                'description' => $faker->optional(0.5)->sentence(6),
                'prix_vente' => $prixVente,
                'quantite_initiale' => $quantiteInitiale,
                'quantite_actuelle' => $faker->numberBetween(0, $quantiteInitiale),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
