<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MouvementStock extends Model
{
    use HasFactory;

    protected $table = 'mouvements_stock';
    
    protected $fillable = ['produit_id', 'type_mouvement', 'quantite', 'date', 'entrepot_id'];

    public function produitEnStock()
    {
        return $this->belongsTo(ProduitEnStock::class, 'produit_id');
    }

    public function entrepot()
    {
        return $this->belongsTo(Entrepot::class, 'entrepot_id');
    }
}
