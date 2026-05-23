<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ListaDeseos;
use Illuminate\Http\Request;

class ListaDeseosController extends Controller
{
    public function index(Request $request)
    {
        $lista = ListaDeseos::where('usuario_id', $request->user()->id)
            ->with('producto.imagenes')
            ->get();

        return response()->json($lista);
    }

    public function store(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
        ]);

        $existe = ListaDeseos::where('usuario_id', $request->user()->id)
            ->where('producto_id', $request->producto_id)
            ->exists();

        if ($existe) {
            return response()->json(['message' => 'El producto ya está en tu lista de deseos'], 409);
        }

        $item = ListaDeseos::create([
            'usuario_id'  => $request->user()->id,
            'producto_id' => $request->producto_id,
        ]);

        return response()->json($item, 201);
    }

    public function destroy(Request $request, $productoId)
    {
        ListaDeseos::where('usuario_id', $request->user()->id)
            ->where('producto_id', $productoId)
            ->delete();

        return response()->json(['message' => 'Producto eliminado de la lista de deseos']);
    }
}