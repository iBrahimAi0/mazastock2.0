<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OuvertureCaisse extends Model
{
    use HasFactory;

    // Définir le nom de la table si ce n'est pas le pluriel du nom du modèle
    protected $table = 'ouverture_caisse';

    // Définir les attributs qui peuvent être assignés en masse
    protected $fillable = [
        'date_ouverture',
        // Ajoutez d'autres colonnes ici si nécessaire
    ];

    // Indiquez si vous souhaitez que les timestamps soient gérés automatiquement
    public $timestamps = true;

    // Relations avec d'autres modèles (si nécessaire)

    // Méthodes personnalisées (si nécessaire)
}
