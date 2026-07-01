<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
$this->call([
                AdminUserSeeder::class,
            UsersSeeder::class,
            CategoriesSeeder::class,
            FournisseursSeeder::class,
            ClientsSeeder::class,
            EntrepotsSeeder::class,
            ProduitsSeeder::class,
            ProduitsEnStockSeeder::class,
            OuvertureCaisseSeeder::class,
            MouvementStocksSeeder::class,
            AjustementStocksSeeder::class,
            CommandesSeeder::class,
            DetailsCommandesSeeder::class,
            PaiementsSeeder::class,
        ]);
    }
    
}
