<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class EntrepotsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        $entrepots = [
            'Entrepôt Central',
            'Entrepôt Nord',
            'Entrepôt Sud',
            'Entrepôt Casablanca',
            'Entrepôt Rabat',
        ];

        foreach ($entrepots as $nom) {
            DB::table('entrepots')->insert([
                'nom' => $nom,
                'adresse' => $faker->address(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
