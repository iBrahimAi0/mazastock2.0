<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class FournisseursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        for ($i = 0; $i < 10; $i++) {
            DB::table('fournisseurs')->insert([
                'nom' => $faker->company(),
                'adresse' => $faker->address(),
                'telephone' => $faker->phoneNumber(),
                'email' => $faker->unique()->companyEmail(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
