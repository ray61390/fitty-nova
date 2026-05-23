<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Resena;
use App\Models\Producto;
use Illuminate\Http\Request;

class ResenaController extends Controller
{
    public function index($productoId)
    {
        $resenas = Resena::where('producto_id', $productoId)
            ->where('aprobada', 1)
            ->with('cliente')
            ->get();

        return response()->json($resenas);
    }

    public function store(Request $request, $productoId)
    {
        $request->validate([
            'puntuacion' => 'required|integer|min:1',
            'titulo'     => 'nullable|string|max:200',
            'comentario' => 'nullable|string',
        ]);

        $resena = Resena::create([
            'producto_id' => $productoId,
            'cliente_id'  => $request->user()->id,
            'puntuacion'  => $request->puntuacion,
            'titulo'      => $request->titulo,
            'comentario'  => $request->comentario,
            'aprobada'    => 0,
            'created_at'  => now(),
        ]);

        return response()->json($resena, 201);
    }

    public function vendedor(Request $request)
    {
        $productosIds = Producto::where('vendedor_id', $request->user()->id)->pluck('id');
        $resenas = Resena::with('producto')
            ->whereIn('producto_id', $productosIds)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($resenas);
    }

    public function cliente(Request $request)
    {
        $resenas = Resena::with('producto')
            ->where('cliente_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($resenas);
    }
}