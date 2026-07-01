<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class AjustementStocksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        $mouvementIds = DB::table('mouvements_stock')->pluck('id')->toArray();

        $raisons = [
            'Produit endommagé',
            'Erreur de comptage',
            'Vol / perte',
            'Retour client',
            'Péremption',
            'Correction d\'inventaire',
        ];

        // On ajuste seulement une partie des mouvements (pas tous les mouvements ont besoin d'un ajustement)
        $sample = $faker->randomElements($mouvementIds, min(15, count($mouvementIds)));

        foreach ($sample as $mouvementId) {
            DB::table('ajustements_stock')->insert([
                'mouvement_stock_id' => $mouvementId,
                'raison' => $faker->randomElement($raisons),
                'details' => $faker->optional(0.6)->sentence(12),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
