<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['nom' => 'Alimentation', 'description' => 'Produits alimentaires et boissons'],
            ['nom' => 'Électronique', 'description' => 'Appareils et accessoires électroniques'],
            ['nom' => 'Vêtements', 'description' => 'Habillement homme, femme et enfant'],
            ['nom' => 'Cosmétiques', 'description' => 'Produits de beauté et d\'hygiène'],
            ['nom' => 'Mobilier', 'description' => 'Meubles et articles de décoration'],
            ['nom' => 'Papeterie', 'description' => 'Fournitures de bureau et scolaires'],
            ['nom' => 'Jouets', 'description' => 'Jeux et jouets pour enfants'],
            ['nom' => 'Sport', 'description' => 'Équipements et accessoires sportifs'],
        ];

        foreach ($categories as $categorie) {
            DB::table('categories')->insert([
                'nom' => $categorie['nom'],
                'description' => $categorie['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
