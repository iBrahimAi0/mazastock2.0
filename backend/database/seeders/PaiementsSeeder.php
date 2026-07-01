<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PaiementsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        $methodes = ['especes', 'carte_bancaire', 'virement', 'cheque'];

        // Un paiement par commande, avec le total calculé depuis les lignes de la commande
        $commandes = DB::table('commandes')->pluck('id');

        foreach ($commandes as $commandeId) {
            $total = DB::table('details_commandes')
                ->where('commande_id', $commandeId)
                ->selectRaw('SUM(quantite * prix) as total')
                ->value('total');

            DB::table('paiements')->insert([
                'commande_id' => $commandeId,
                'methode' => $faker->randomElement($methodes),
                'total' => $total ?? $faker->randomFloat(2, 20, 2000),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
