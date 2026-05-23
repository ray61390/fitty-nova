<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Variante extends Model
{
    protected $table = 'variantes';
    public $timestamps = false;

    protected $fillable = ['producto_id', 'talla', 'color', 'sku', 'stock', 'precio_extra', 'activa'];
    public function producto()
{
    return $this->belongsTo(Producto::class, 'producto_id');
}
}