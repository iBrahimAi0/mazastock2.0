<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ClientsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        for ($i = 0; $i < 20; $i++) {
            DB::table('clients')->insert([
                'nom' => $faker->lastName(),
                'prenom' => $faker->firstName(),
                'email' => $faker->unique()->safeEmail(),
                'telephone' => $faker->phoneNumber(),
                'adresse' => $faker->address(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
