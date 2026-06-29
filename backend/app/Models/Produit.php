<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;
    protected $fillable = ['nom', 'description', 'prix_achat', 'categorie_id', 'fournisseur_id', 'image_produit'];

    public function produitsEnStock()
    {
        return $this->hasMany(\App\Models\ProduitEnStock::class, 'produit_id');
    }

    public function detailsCommandes()
    {
        return $this->hasMany(\App\Models\DetailCommande::class, 'produit_id');
    }

}
