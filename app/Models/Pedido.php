<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos';

    protected $fillable = [
        'cliente_id',
        'direccion_id',
        'descuento_id',
        'estado',
        'subtotal',
        'descuento_total',
        'gastos_envio',
        'total',
        'notas',
    ];

    public function cliente()
    {
        return $this->belongsTo(Usuario::class, 'cliente_id');
    }

    public function lineas()
    {
        return $this->hasMany(PedidoLinea::class, 'pedido_id');
    }
}