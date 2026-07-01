<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class CommandesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        $clientIds = DB::table('clients')->pluck('id')->toArray();
        $etats = ['en_attente', 'validee', 'expediee', 'livree', 'annulee'];

        for ($i = 0; $i < 30; $i++) {
            DB::table('commandes')->insert([
                'client_id' => $faker->randomElement($clientIds),
                'etat' => $faker->randomElement($etats),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
