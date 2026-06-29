<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AjustementStock extends Model
{
    use HasFactory;

    protected $table = 'ajustements_stock';

    protected $fillable = ['mouvement_stock_id', 'raison', 'details'];

    public function mouvementStock()
    {
        return $this->belongsTo(MouvementStock::class);
    }
}
