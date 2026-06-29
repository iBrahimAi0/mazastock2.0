<?php

namespace App\Models;

use App\Models\Paiement;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'etat',
        // Vous pouvez ajouter d'autres champs requis ici.
    ];

    // Relation avec le client
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    // Relation avec les détails de commande
    public function details()
    {
        return $this->hasMany(DetailCommande::class);
    }

     // Relation avec le produit
     public function produit()
     {
         return $this->belongsTo(Produit::class);
     }

     public function paiement()
     {
         return $this->hasOne(Paiement::class);
     }
}
