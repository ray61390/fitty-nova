<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Variante;
use App\Models\Producto;
use Illuminate\Http\Request;

class VarianteController extends Controller
{
    public function index(Request $request, $productoId)
    {
        $producto = Producto::where('vendedor_id', $request->user()->id)
            ->findOrFail($productoId);

        $variantes = Variante::where('producto_id', $productoId)->get();

        return response()->json($variantes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'talla'       => 'required|string',
            'stock'       => 'required|integer|min:0',
        ]);

        $variante = Variante::create([
            'producto_id'  => $request->producto_id,
            'talla'        => $request->talla,
            'color'        => $request->color ?? 'Único',
            'sku'          => 'SKU-' . $request->producto_id . '-' . $request->talla . '-' . uniqid(),
            'stock'        => $request->stock,
            'precio_extra' => 0,
        ]);

        return response()->json($variante, 201);
    }

    public function update(Request $request, $id)
    {
        $variante = Variante::findOrFail($id);
        $variante->update([
            'stock' => $request->stock,
            'talla' => $request->talla,
        ]);
        return response()->json($variante);
    }

    public function destroy($id)
    {
        $variante = Variante::findOrFail($id);
        $variante->delete();
        return response()->json(['message' => 'Variante eliminada']);
    }
}