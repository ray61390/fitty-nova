<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ProductoImagen;
use Illuminate\Http\Request;

class ImagenController extends Controller
{
    public function store(Request $request)
    {
        $productoId = $request->get('producto_id') 
            ?? $request->input('producto_id') 
            ?? $request->query('producto_id');

        $request->validate([
            'imagen' => 'required|image|max:5120',
        ]);

        if (!$productoId) {
            return response()->json(['message' => 'producto_id requerido'], 422);
        }

        $archivo = $request->file('imagen')->store('productos', 'public');

        $imagen = ProductoImagen::create([
            'producto_id' => $productoId,
            'url'         => '/storage/' . $archivo,
            'orden'       => 0,
            'es_portada'  => 1,
        ]);

        return response()->json($imagen, 201);
    }
}