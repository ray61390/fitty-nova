<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos';

    protected $fillable = [
        'vendedor_id',
        'categoria_id',
        'marca_id',
        'nombre',
        'slug',
        'descripcion',
        'precio_base',
        'genero',
        'activo',
        'destacado',
    ];

    public function vendedor()
    {
        return $this->belongsTo(Usuario::class, 'vendedor_id');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function marca()
    {
        return $this->belongsTo(Marca::class, 'marca_id');
    }

    public function variantes()
    {
        return $this->hasMany(Variante::class, 'producto_id');
    }

    public function imagenes()
    {
        return $this->hasMany(ProductoImagen::class, 'producto_id');
    }

    public function resenas()
    {
        return $this->hasMany(Resena::class, 'producto_id');
    }
}