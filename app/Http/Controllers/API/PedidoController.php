<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use App\Models\PedidoLinea;
use App\Models\Variante;
use App\Models\Producto;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
public function index(Request $request)
{
    $pedidos = Pedido::with(['lineas.variante.producto.imagenes'])
        ->where('cliente_id', $request->user()->id)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($pedidos);
}

    public function show(Request $request, $id)
    {
        $pedido = Pedido::with(['lineas.variante.producto'])
            ->where('cliente_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($pedido);
    }

    public function store(Request $request)
    {
        $request->validate([
            'lineas' => 'required|array|min:1',
            'lineas.*.variante_id' => 'required|exists:variantes,id',
            'lineas.*.cantidad' => 'required|integer|min:1',
        ]);

        $total = 0;
        foreach ($request->lineas as $linea) {
            $variante = Variante::with('producto')->findOrFail($linea['variante_id']);
            $total += ($variante->producto->precio_base + $variante->precio_extra) * $linea['cantidad'];
        }

        $pedido = Pedido::create([
            'cliente_id' => $request->user()->id,
            'estado'     => 'pendiente',
            'total'      => $total,
        ]);

        foreach ($request->lineas as $linea) {
            $variante = Variante::with('producto')->findOrFail($linea['variante_id']);
            PedidoLinea::create([
                'pedido_id'   => $pedido->id,
                'variante_id' => $linea['variante_id'],
                'cantidad'    => $linea['cantidad'],
                'precio_unit' => $variante->producto->precio_base + $variante->precio_extra,
            ]);
        }

        return response()->json($pedido->load('lineas'), 201);
    }

    public function vendedor(Request $request)
    {
        $productosIds = Producto::where('vendedor_id', $request->user()->id)->pluck('id');

        $pedidos = Pedido::with(['cliente', 'lineas'])
            ->whereHas('lineas', function($q) use ($productosIds) {
                $q->whereHas('variante', function($q2) use ($productosIds) {
                    $q2->whereIn('producto_id', $productosIds);
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pedidos);
    }
}