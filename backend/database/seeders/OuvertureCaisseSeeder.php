<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class OuvertureCaisseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        for ($i = 0; $i < 15; $i++) {
            DB::table('ouverture_caisse')->insert([
                'date_ouverture' => $faker->dateTimeBetween('-30 days', 'now'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
