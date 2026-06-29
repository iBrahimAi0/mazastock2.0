<?php

namespace Tests\Feature;

use App\Models\Categorie;
use App\Models\Client;
use App\Models\Entrepot;
use App\Models\Fournisseur;
use App\Models\MouvementStock;
use App\Models\Produit;
use App\Models\ProduitEnStock;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InventoryWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_inventory_endpoints_require_authentication(): void
    {
        $this->getJson('/api/produits')->assertUnauthorized();
    }

    public function test_login_returns_the_user_role_and_a_token(): void
    {
        User::factory()->create([
            'email' => 'manager@example.com',
            'password' => 'secret-password',
            'role' => 'ResponsableStock',
        ]);

        $this->postJson('/api/login', [
            'email' => 'manager@example.com',
            'password' => 'secret-password',
        ])->assertOk()
            ->assertJsonPath('user.role', 'ResponsableStock')
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'role']]);
    }

    public function test_stock_movement_create_update_and_delete_keep_quantity_consistent(): void
    {
        Sanctum::actingAs(User::factory()->create());
        [$stock, $warehouse] = $this->makeStock(10);

        $movement = $this->postJson('/api/mouvements_stock', [
            'produit_id' => $stock->id,
            'entrepot_id' => $warehouse->id,
            'type_mouvement' => 'sortie',
            'quantite' => 3,
            'date' => '2026-06-23',
        ])->assertCreated()->json();
        $this->assertSame(7, $stock->fresh()->quantite_actuelle);

        $this->putJson('/api/mouvements_stock/' . $movement['id'], [
            'produit_id' => $stock->id,
            'entrepot_id' => $warehouse->id,
            'type_mouvement' => 'entrée',
            'quantite' => 2,
            'date' => '2026-06-23',
        ])->assertOk();
        $this->assertSame(12, $stock->fresh()->quantite_actuelle);

        $this->deleteJson('/api/mouvements_stock/' . $movement['id'])->assertNoContent();
        $this->assertSame(10, $stock->fresh()->quantite_actuelle);
        $this->assertDatabaseMissing('mouvements_stock', ['id' => $movement['id']]);
    }

    public function test_an_order_decrements_stock_and_uses_the_status_update_route(): void
    {
        Sanctum::actingAs(User::factory()->create());
        [$stock] = $this->makeStock(10);
        $client = Client::create([
            'nom' => 'Doe',
            'prenom' => 'Jane',
            'email' => 'jane@example.com',
            'telephone' => '0600000000',
            'adresse' => 'Casablanca',
        ]);

        $orderId = $this->postJson('/api/commandes', [
            'client_id' => $client->id,
            'produits' => [[
                'produit_id' => $stock->produit_id,
                'quantite' => 2,
                'prix' => 25,
            ]],
            'methode_paiement' => 'espèces',
            'total_a_payer' => 50,
        ])->assertCreated()->json('data.id');

        $this->assertSame(8, $stock->fresh()->quantite_actuelle);
        $this->putJson('/api/commandes/' . $orderId, ['etat' => 'expédiée'])
            ->assertOk()
            ->assertJsonPath('etat', 'expédiée');
    }

    private function makeStock(int $quantity): array
    {
        $category = Categorie::create(['nom' => 'Informatique']);
        $supplier = Fournisseur::create([
            'nom' => 'Supplier',
            'adresse' => 'Rabat',
            'telephone' => '0600000001',
            'email' => 'supplier@example.com',
        ]);
        $product = Produit::create([
            'nom' => 'Clavier',
            'prix_achat' => 10,
            'categorie_id' => $category->id,
            'fournisseur_id' => $supplier->id,
        ]);
        $stock = ProduitEnStock::create([
            'produit_id' => $product->id,
            'prix_vente' => 25,
            'quantite_initiale' => $quantity,
            'quantite_actuelle' => $quantity,
        ]);
        $warehouse = Entrepot::create(['nom' => 'Principal', 'adresse' => 'Casablanca']);

        return [$stock, $warehouse];
    }
}
