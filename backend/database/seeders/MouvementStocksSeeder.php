<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class MouvementStocksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        // Attention : la migration référence produit_id vers la table produits_en_stock
        $produitEnStockIds = DB::table('produits_en_stock')->pluck('id')->toArray();
        $entrepotIds = DB::table('entrepots')->pluck('id')->toArray();

        $types = ['entree', 'sortie'];

        for ($i = 0; $i < 60; $i++) {
            DB::table('mouvements_stock')->insert([
                'produit_id' => $faker->randomElement($produitEnStockIds),
                'type_mouvement' => $faker->randomElement($types),
                'quantite' => $faker->numberBetween(1, 50),
                'date' => $faker->dateTimeBetween('-60 days', 'now')->format('Y-m-d'),
                'entrepot_id' => $faker->randomElement($entrepotIds),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
