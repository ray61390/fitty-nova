<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Devolucion;
use App\Models\Pedido;
use Illuminate\Http\Request;

class DevolucionController extends Controller
{
    public function index(Request $request)
    {
        $devoluciones = Devolucion::where('cliente_id', $request->user()->id)
            ->with('pedido')
            ->get();

        return response()->json($devoluciones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'pedido_id' => 'required|exists:pedidos,id',
            'motivo'    => 'required|string',
        ]);

        $pedido = Pedido::where('cliente_id', $request->user()->id)
            ->findOrFail($request->pedido_id);

        if (!in_array($pedido->estado, ['pendiente', 'confirmado', 'enviado', 'entregado'])) {
            return response()->json(['message' => 'No puedes devolver este pedido'], 422);
        }

        $devolucion = Devolucion::create([
            'pedido_id'  => $request->pedido_id,
            'cliente_id' => $request->user()->id,
            'motivo'     => $request->motivo,
            'estado'     => 'solicitada',
            'importe'    => $pedido->total,
        ]);

        return response()->json($devolucion, 201);
    }
}