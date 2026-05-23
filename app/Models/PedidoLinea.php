<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PedidoLinea extends Model
{
    protected $table = 'pedido_lineas';
    public $timestamps = false;

    protected $fillable = [
        'pedido_id',
        'variante_id',
        'cantidad',
        'precio_unit',
        'descuento',
    ];

    public function variante()
    {
        return $this->belongsTo(Variante::class, 'variante_id');
    }
}