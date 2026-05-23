<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Descuento extends Model
{
    protected $table = 'descuentos';
    public $timestamps = false;

    protected $fillable = [
        'vendedor_id',
        'nombre',
        'tipo',
        'valor',
        'codigo',
        'activo',
        'fecha_inicio',
        'fecha_fin',
        'usos_maximos',
        'usos_actuales',
    ];
}