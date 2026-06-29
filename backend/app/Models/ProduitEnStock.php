<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProduitEnStock extends Model
{
    use HasFactory;

   protected $table = 'produits_en_stock';

    protected $fillable = ['produit_id', 'description', 'prix_vente', 'quantite_initiale', 'quantite_actuelle'];


    public function produit()
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }

}
