<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListaDeseos extends Model
{
    protected $table = 'lista_deseos';
    public $timestamps = false;

    protected $fillable = ['usuario_id', 'producto_id'];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}