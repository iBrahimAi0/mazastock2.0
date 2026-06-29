<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['Responsable Stock', 'responsablestock@example.com', 'ResponsableStock'],
            ['Gestionnaire Produits', 'gestionnaireproduits@example.com', 'GestionnaireProduits'],
            ['Responsable Commandes', 'responsablecommandes@example.com', 'ResponsableCommandes'],
            ['Responsable Achats', 'responsableachats@example.com', 'ResponsableAchats'],
            ['Responsable Ventes', 'responsableventes@example.com', 'ResponsableVentes'],
            ['Responsable Catégories', 'responsablecategories@example.com', 'ResponsableCategories'],
            ['Caissier', 'caissier@example.com', 'Caissier'],
            ['Analyste', 'analyste@example.com', 'Analyste'],
        ];

        foreach ($users as [$name, $email, $role]) {
            User::updateOrCreate(['email' => $email], [
                'name' => $name,
                'password' => Hash::make('123456789'),
                'role' => $role,
            ]);
        }
    }
}
