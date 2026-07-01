<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Faker\Factory as Faker;

class ProduitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        $categorieIds = DB::table('categories')->pluck('id')->toArray();
        $fournisseurIds = DB::table('fournisseurs')->pluck('id')->toArray();

        // Colonne ajoutée par la migration 2026_06_29_..._add_image_produit_to_produits_table
        $hasImageColumn = Schema::hasColumn('produits', 'image');

        for ($i = 0; $i < 40; $i++) {
            $data = [
                'nom' => ucfirst($faker->words(2, true)),
                'description' => $faker->sentence(10),
                'prix_achat' => $faker->randomFloat(2, 10, 500),
                'categorie_id' => $faker->randomElement($categorieIds),
                'fournisseur_id' => $faker->randomElement($fournisseurIds),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if ($hasImageColumn) {
                $data['image'] = null;
            }

            DB::table('produits')->insert($data);
        }
    }
}
